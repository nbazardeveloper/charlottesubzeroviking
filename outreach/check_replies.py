#!/usr/bin/env python3
"""Find replies and bounces to the outreach emails and record them in the sheet.

Reads the Zoho Inbox over IMAP (read-only), matches messages to sent emails by
In-Reply-To/References, then by sender address, then by sender company domain.
Writes new ones to the "Replies" tab and updates the lead's Status:
  reply                -> Replied        (only if the lead is still "Sent")
  "unsubscribe"/remove -> Do not contact
  bounce               -> Bounced
  out-of-office        -> logged only, status unchanged
Statuses you set by hand (Interested, Vendor registered, ...) are never overwritten,
except by Do not contact / Bounced.

Usage:
  python check_replies.py            # look back `reply_lookback_days` days
  python check_replies.py --days 60
"""
from __future__ import annotations

import argparse
import email
import imaplib
import re
from datetime import datetime, timedelta
from email.header import decode_header, make_header
from email.utils import getaddresses, parsedate_to_datetime

import common as c

UNSUB_RE = re.compile(r"\b(unsubscribe|remove me|remove us|stop emailing|do not contact|opt[ -]?out)\b", re.I)
BOUNCE_FROM_RE = re.compile(r"(mailer-daemon|postmaster|mail delivery)", re.I)
BOUNCE_SUBJ_RE = re.compile(r"(undeliver|delivery status notification|delivery failure|returned mail|failure notice|could not be delivered)", re.I)
AUTO_SUBJ_RE = re.compile(r"(out of (the )?office|automatic reply|auto(matic)?[- ]?reply|autoreply|away from)", re.I)
ID_RE = re.compile(r"<[^<>\s]+>")


def dec(value) -> str:
    if not value:
        return ""
    try:
        return str(make_header(decode_header(value)))
    except Exception:
        return str(value)


def body_text(msg) -> str:
    """Plain-text body (falls back to stripped HTML)."""
    parts = msg.walk() if msg.is_multipart() else [msg]
    html_fallback = ""
    for p in parts:
        if p.get_content_maintype() == "multipart" or p.get("Content-Disposition", "").startswith("attachment"):
            continue
        try:
            payload = p.get_payload(decode=True)
            if payload is None:
                continue
            txt = payload.decode(p.get_content_charset() or "utf-8", errors="replace")
        except Exception:
            continue
        if p.get_content_type() == "text/plain":
            return txt
        if p.get_content_type() == "text/html" and not html_fallback:
            html_fallback = re.sub(r"<[^>]+>", " ", txt)
        if p.get_content_type() in ("message/delivery-status", "text/rfc822-headers"):
            html_fallback += "\n" + txt
    return html_fallback


def new_part(text: str) -> str:
    """Drop the quoted original so 'unsubscribe' in our own footer isn't matched."""
    lines = []
    for line in text.splitlines():
        s = line.strip()
        if s.startswith(">") or re.match(r"^(On .+ wrote:|-{2,}\s*Original Message|From: .+)$", s, re.I) \
                or "---- On " in s or s.startswith("________________"):
            break
        lines.append(line)
    return "\n".join(lines).strip()


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--days", type=int, help="how many days back to scan")
    args = ap.parse_args()

    cfg = c.load_config()
    days = args.days or int(cfg.get("reply_lookback_days", 30))
    user, password = c.zoho_credentials()

    sh = c.open_sheet(cfg)
    leads_ws, sent_ws, replies_ws = sh.worksheet(c.LEADS_TAB), sh.worksheet(c.SENT_TAB), sh.worksheet(c.REPLIES_TAB)
    lead_headers, leads = c.read_rows(leads_ws)
    _, sent_rows = c.read_rows(sent_ws)
    _, reply_rows = c.read_rows(replies_ws)

    by_msgid = {r["Message-ID"]: r["Email"].lower() for r in sent_rows if r.get("Message-ID")}
    contacted = {r["Email"].lower() for r in sent_rows}
    lead_by_email = {r["Email"].lower(): r for r in leads if r.get("Email")}
    lead_by_domain = {}
    for e in contacted:
        d = c.email_domain(e)
        if d and d not in c.FREE_MAIL_DOMAINS:
            lead_by_domain.setdefault(d, lead_by_email.get(e))
    seen_ids = {r.get("Message-ID") for r in reply_rows}

    since = (datetime.now() - timedelta(days=days)).strftime("%d-%b-%Y")
    found = 0
    with imaplib.IMAP4_SSL(cfg["imap_host"], cfg.get("imap_port", 993)) as imap:
        imap.login(user, password)
        imap.select(cfg.get("inbox_folder", "INBOX"), readonly=True)
        typ, data = imap.search(None, "SINCE", since)
        ids = data[0].split() if typ == "OK" else []
        for num in ids:
            typ, msg_data = imap.fetch(num, "(BODY.PEEK[])")
            if typ != "OK" or not msg_data or not isinstance(msg_data[0], tuple):
                continue
            msg = email.message_from_bytes(msg_data[0][1])
            mid = (msg.get("Message-ID") or "").strip() or f"{msg.get('From')}|{msg.get('Date')}|{msg.get('Subject')}"
            if mid in seen_ids:
                continue

            from_name, from_addr = (getaddresses([msg.get("From", "")]) or [("", "")])[0]
            from_addr = from_addr.lower()
            if from_addr == user.lower():
                continue
            subject = dec(msg.get("Subject"))
            body = body_text(msg)

            # Which lead is this about?
            refs = set(ID_RE.findall((msg.get("In-Reply-To") or "") + " " + (msg.get("References") or "")))
            lead_email = next((by_msgid[x] for x in refs if x in by_msgid), None)
            is_bounce = bool(BOUNCE_FROM_RE.search(from_addr + " " + from_name) or BOUNCE_SUBJ_RE.search(subject))
            if is_bounce and not lead_email:
                lead_email = next((e for e in contacted if e and e in body.lower()), None)
            if not lead_email and from_addr in contacted:
                lead_email = from_addr
            lead = lead_by_email.get(lead_email) if lead_email else lead_by_domain.get(c.email_domain(from_addr))
            if not lead:
                continue  # unrelated mail

            fresh = new_part(body)
            auto = (msg.get("Auto-Submitted", "no").lower() not in ("", "no")) or bool(AUTO_SUBJ_RE.search(subject))
            if is_bounce:
                kind, new_status = "Bounce", c.BOUNCED
            elif auto:
                kind, new_status = "Auto-reply", None
            elif UNSUB_RE.search(subject + "\n" + fresh[:500]):
                kind, new_status = "Unsubscribe", c.DO_NOT_CONTACT
            else:
                kind = "Reply"
                new_status = c.REPLIED if lead.get("Status", "").lower() in ("", c.SENT.lower(), c.NEW.lower()) else None

            try:
                when = parsedate_to_datetime(msg.get("Date")).strftime("%Y-%m-%d %H:%M")
            except Exception:
                when = c.now_str()
            snippet = re.sub(r"\s+", " ", fresh or body)[:300]
            replies_ws.append_row([when, lead.get("Company", ""), f"{from_name} <{from_addr}>".strip(), subject,
                                   snippet, kind, mid, "", ""], value_input_option="RAW")
            seen_ids.add(mid)
            updates = {}
            if new_status and lead.get("Status") != new_status:
                updates["Status"] = new_status
                lead["Status"] = new_status
            if kind == "Reply" and not lead.get("Reply Date"):
                updates["Reply Date"] = when
                lead["Reply Date"] = when
            if updates:
                c.set_cells(leads_ws, lead_headers, lead["_row"], updates)
            found += 1
            print(f"{kind:12} {lead.get('Company') or lead_email}: {subject[:70]}")

    print(f"Done. {found} new message(s) recorded.")


if __name__ == "__main__":
    main()
