#!/usr/bin/env python3
"""Send the vendor-introduction email to property management companies.

Reads the "Leads" tab, sends to rows with Status = New, logs every send to
"Sent Log" and marks the lead as Sent. Sends one at a time through Zoho SMTP
with a random pause between emails and a daily cap.

Usage:
  python send_outreach.py --init               # create tabs/headers in the Google Sheet
  python send_outreach.py --preview            # write preview.html for a sample company (no sheet needed)
  python send_outreach.py --dry-run            # show who would get an email today, send nothing
  python send_outreach.py --test you@mail.com  # send this batch to yourself, sheet untouched
  python send_outreach.py                      # real send (up to today's limit)
  python send_outreach.py --limit 3            # real send, at most 3 emails this run
"""
from __future__ import annotations

import argparse
import imaplib
import random
import smtplib
import ssl
import sys
import time
from email.message import EmailMessage
from email.utils import formataddr, formatdate, make_msgid

import common as c


def build_message(cfg: dict, from_addr: str, to_addr: str, subject: str, text: str, page: str) -> EmailMessage:
    msg = EmailMessage()
    msg["From"] = formataddr((cfg["from_name"], from_addr))
    msg["To"] = to_addr
    msg["Subject"] = subject
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain=c.email_domain(from_addr))
    msg["Reply-To"] = from_addr
    # No List-Unsubscribe header: it marks the email as bulk mail (Gmail → Promotions).
    # Opt-out is offered in the footer instead ("reply unsubscribe").
    msg.set_content(text)
    msg.add_alternative(page, subtype="html")
    return msg


def copy_to_sent(cfg: dict, user: str, password: str, msg: EmailMessage) -> None:
    """Zoho does not store SMTP-sent mail automatically; put a copy in Sent so it shows in the web UI."""
    try:
        with imaplib.IMAP4_SSL(cfg["imap_host"], cfg.get("imap_port", 993)) as imap:
            imap.login(user, password)
            imap.append(cfg.get("sent_folder", "Sent"), "\\Seen", imaplib.Time2Internaldate(time.time()), msg.as_bytes())
    except Exception as e:  # not fatal: the send itself succeeded
        print(f"   ! could not copy to Sent folder: {e}")


def pick_batch(leads: list, sent_rows: list, max_count: int) -> tuple:
    """Return (batch, skipped) applying status, validity and dedupe rules."""
    sent_emails = {r.get("Email", "").lower() for r in sent_rows}
    sent_domains = {c.email_domain(e) for e in sent_emails} - c.FREE_MAIL_DOMAINS
    blocked = {c.DO_NOT_CONTACT.lower(), c.BOUNCED.lower()}
    blocked_emails = {r["Email"].lower() for r in leads if r.get("Status", "").lower() in blocked}

    batch, skipped, seen = [], [], set()
    for r in leads:
        if len(batch) >= max_count:
            break
        if r.get("Status", "").strip().lower() != c.NEW.lower():
            continue
        email = r.get("Email", "").strip()
        el = email.lower()
        dom = c.email_domain(el)
        reason = None
        if not c.is_valid_email(email):
            reason = "invalid email"
        elif el in sent_emails or el in blocked_emails:
            reason = "already contacted"
        elif dom not in c.FREE_MAIL_DOMAINS and (dom in sent_domains or dom in seen):
            reason = "company domain already contacted"
        elif el in seen:
            reason = "duplicate in batch"
        if reason:
            skipped.append((r, reason))
            continue
        seen.add(el)
        if dom not in c.FREE_MAIL_DOMAINS:
            seen.add(dom)
        batch.append(r)
    return batch, skipped


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--init", action="store_true", help="create sheet tabs and headers, then exit")
    ap.add_argument("--preview", action="store_true", help="write preview.html / preview.txt and exit")
    ap.add_argument("--dry-run", action="store_true", help="list today's batch without sending")
    ap.add_argument("--test", metavar="EMAIL", help="send the batch to this address instead; sheet is not changed")
    ap.add_argument("--limit", type=int, help="max emails this run (still capped by daily_limit)")
    args = ap.parse_args()

    cfg = c.load_config()

    if args.preview:
        subject, text, page = c.render(cfg, "Example Property Management", "")
        (c.HERE / "preview.html").write_text(page, encoding="utf-8")
        (c.HERE / "preview.txt").write_text(f"Subject: {subject}\n\n{text}", encoding="utf-8")
        print(f"Subject: {subject}\nWrote preview.html and preview.txt in {c.HERE}")
        return

    sh = c.open_sheet(cfg)
    if args.init:
        c.ensure_tabs(sh)
        print("Sheet tabs ready: Leads, Sent Log, Replies.")
        return

    leads_ws = sh.worksheet(c.LEADS_TAB)
    sent_ws = sh.worksheet(c.SENT_TAB)
    lead_headers, leads = c.read_rows(leads_ws)
    missing = [h for h in ("Company", "Email", "Status") if h not in lead_headers]
    if missing:
        raise SystemExit(f"Leads header row is damaged (missing {missing}; found {lead_headers[:4]}...). "
                         "Fix row 1 of the Leads tab and run again. Nothing was sent.")
    _, sent_rows = c.read_rows(sent_ws)

    sent_today = sum(1 for r in sent_rows if r.get("Date Sent", "").startswith(c.today_str()))
    remaining = max(0, int(cfg["daily_limit"]) - sent_today)
    if args.test:
        remaining = max(remaining, 1)  # allow testing even after the daily cap
    if args.limit is not None:
        remaining = min(remaining, args.limit)

    batch, skipped = pick_batch(leads, sent_rows, remaining)
    for r, reason in skipped:
        print(f"skip  row {r['_row']}: {r.get('Company') or '?'} <{r.get('Email')}> — {reason}")
    if args.test and not batch:
        # Nothing queued yet: test with a sample company so the template can be checked anyway.
        batch = [{"_row": 0, "Company": "Example Property Management", "Contact Name": "",
                  "Email": args.test, "Notes": ""}]
    print(f"Sent today: {sent_today}/{cfg['daily_limit']}. This run: {len(batch)} email(s).")
    if not batch:
        return

    for r in batch:
        dom = c.email_domain(r["Email"])
        if c.has_mx(dom) is False:
            print(f"warn  {r['Email']}: domain {dom} has no mail server — will be skipped")
    if args.dry_run:
        for r in batch:
            subject, _, _ = c.render(cfg, r.get("Company", ""), r.get("Contact Name", ""))
            print(f"would send  row {r['_row']}: {r['Email']}  |  {subject}")
        return

    user, password = c.zoho_credentials()
    ctx = ssl.create_default_context()
    for i, r in enumerate(batch):
        dom = c.email_domain(r["Email"])
        if c.has_mx(dom) is False:
            if not args.test:
                c.set_cells(leads_ws, lead_headers, r["_row"], {"Status": c.BOUNCED, "Notes": (r.get("Notes", "") + " [no MX record]").strip()})
            continue

        subject, text, page = c.render(cfg, r.get("Company", ""), r.get("Contact Name", ""))
        to_addr = args.test or r["Email"]
        if args.test:
            subject = f"[TEST → {r['Email']}] {subject}"
        msg = build_message(cfg, user, to_addr, subject, text, page)

        # One fresh SMTP connection per email: Zoho drops idle connections during the long pauses.
        try:
            with smtplib.SMTP_SSL(cfg["smtp_host"], cfg.get("smtp_port", 465), context=ctx, timeout=60) as smtp:
                smtp.login(user, password)
                smtp.send_message(msg)
        except (smtplib.SMTPException, OSError) as e:
            print(f"FAIL  {to_addr}: {e}")
            if isinstance(e, smtplib.SMTPRecipientsRefused) and not args.test:
                c.set_cells(leads_ws, lead_headers, r["_row"], {"Status": c.BOUNCED, "Notes": (r.get("Notes", "") + f" [refused: {e}]").strip()})
            continue

        print(f"sent  {to_addr}  |  {subject}")
        copy_to_sent(cfg, user, password, msg)

        if not args.test:
            ts = c.now_str()
            c.retry(sent_ws.append_row,
                    [ts, r.get("Company", ""), r.get("Contact Name", ""), r["Email"], subject, msg["Message-ID"]],
                    value_input_option="RAW")
            c.set_cells(leads_ws, lead_headers, r["_row"], {"Status": c.SENT, "Sent Date": ts})

        if i < len(batch) - 1:
            pause = random.randint(int(cfg.get("min_pause_seconds", 60)), int(cfg.get("max_pause_seconds", 180)))
            print(f"      waiting {pause}s…")
            time.sleep(pause)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit("\nStopped. Already-sent emails are logged in the sheet.")
