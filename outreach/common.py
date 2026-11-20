"""Shared helpers for the property-management outreach scripts.

Config comes from config.json (non-secret settings) and .env (Zoho app password).
Leads, sent log and replies live in a Google Sheet accessed with a service account.
"""
from __future__ import annotations

import html
import json
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

HERE = Path(__file__).resolve().parent

LEADS_TAB = "Leads"
SENT_TAB = "Sent Log"
REPLIES_TAB = "Replies"

LEADS_HEADERS = [
    "Company", "Contact Name", "Title", "Email", "Website", "Phone", "City",
    "Type", "Source", "Vendor Portal URL", "Status", "Sent Date", "Reply Date", "Notes",
]
SENT_HEADERS = ["Date Sent", "Company", "Contact Name", "Email", "Subject", "Message-ID"]
REPLIES_HEADERS = [
    "Date", "Company", "From", "Subject", "Snippet", "Type", "Message-ID", "Outcome", "Next Step",
]

# Statuses
NEW = "New"
SENT = "Sent"
REPLIED = "Replied"
BOUNCED = "Bounced"
DO_NOT_CONTACT = "Do not contact"
VENDOR_PORTAL = "Vendor portal"
# Set manually after reading a reply: Interested, Vendor registered, Not interested

# Domains shared by many unrelated senders: never dedupe/match on these.
FREE_MAIL_DOMAINS = {
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "icloud.com",
    "live.com", "msn.com", "comcast.net", "att.net", "bellsouth.net", "me.com",
    "protonmail.com", "zoho.com", "ymail.com", "mail.com", "gmx.com",
}

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$")


def load_config() -> dict:
    path = HERE / "config.json"
    if not path.exists():
        raise SystemExit("config.json not found: copy config.example.json to config.json and fill it in.")
    with open(path, encoding="utf-8") as f:
        cfg = json.load(f)
    try:
        from dotenv import load_dotenv
        load_dotenv(HERE / ".env")
    except ImportError:
        pass
    return cfg


def zoho_credentials() -> tuple:
    user = os.environ.get("ZOHO_USER", "").strip()
    password = os.environ.get("ZOHO_APP_PASSWORD", "").strip()
    if not user or not password:
        raise SystemExit("ZOHO_USER / ZOHO_APP_PASSWORD missing: copy .env.example to .env and fill it in.")
    return user, password


def open_sheet(cfg: dict):
    import gspread
    key_file = HERE / cfg.get("service_account_file", "service_account.json")
    if not key_file.exists():
        raise SystemExit(f"Service account key not found: {key_file}")
    gc = gspread.service_account(filename=str(key_file))
    return gc.open_by_key(cfg["sheet_id"])


def ensure_tabs(sh) -> None:
    """Create the three tabs with headers if they don't exist yet."""
    worksheets = sh.worksheets()
    existing = {ws.title: ws for ws in worksheets}
    # A new spreadsheet has one empty default tab ("Sheet1"/"Лист1"): reuse it as Leads.
    if LEADS_TAB not in existing and len(worksheets) == 1 and not worksheets[0].get_all_values():
        worksheets[0].update_title(LEADS_TAB)
        existing = {LEADS_TAB: worksheets[0]}
    for title, headers in ((LEADS_TAB, LEADS_HEADERS), (SENT_TAB, SENT_HEADERS), (REPLIES_TAB, REPLIES_HEADERS)):
        ws = existing.get(title)
        if ws is None:
            ws = sh.add_worksheet(title=title, rows=1000, cols=len(headers))
        first = ws.row_values(1)
        if not first:
            ws.update(range_name="A1", values=[headers])
            ws.freeze(rows=1)
        else:
            missing = [h for h in headers if h not in first]
            if missing:
                ws.update(range_name=f"{col_letter(len(first) + 1)}1", values=[missing])


def col_letter(n: int) -> str:
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def read_rows(ws) -> tuple:
    """Return (headers, rows) where each row is a dict with a '_row' sheet row number."""
    values = ws.get_all_values()
    if not values:
        return [], []
    headers = values[0]
    rows = []
    for i, raw in enumerate(values[1:], start=2):
        raw = raw + [""] * (len(headers) - len(raw))
        row = {h: raw[j].strip() for j, h in enumerate(headers)}
        row["_row"] = i
        rows.append(row)
    return headers, rows


def set_cells(ws, headers: List[str], row_num: int, updates: Dict[str, str]) -> None:
    data = []
    for name, value in updates.items():
        if name in headers:
            data.append({"range": f"{col_letter(headers.index(name) + 1)}{row_num}", "values": [[value]]})
    if data:
        ws.batch_update(data)


def email_domain(email: str) -> str:
    return email.rsplit("@", 1)[-1].lower() if "@" in email else ""


def is_valid_email(email: str) -> bool:
    return bool(EMAIL_RE.match(email or ""))


def has_mx(domain: str) -> Optional[bool]:
    """True/False if checkable, None if dnspython isn't installed."""
    try:
        import dns.resolver
    except ImportError:
        return None
    try:
        dns.resolver.resolve(domain, "MX", lifetime=8)
        return True
    except Exception:
        try:
            dns.resolver.resolve(domain, "A", lifetime=8)  # implicit MX fallback
            return True
        except Exception:
            return False


def now_str() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M")


def today_str() -> str:
    return datetime.now().strftime("%Y-%m-%d")


# ---------- template rendering ----------

def greeting_for(company: str, contact: str) -> str:
    if contact:
        return f"Dear {contact},"
    if company:
        return f"Dear {company} Team,"
    return "Dear Property Management Team,"


def render(cfg: dict, company: str, contact: str) -> tuple:
    """Return (subject, text_body, html_body) for one lead."""
    company = company.strip()
    contact = contact.strip()
    display_company = company or "your company"
    subject = cfg["subject"].replace("{{company}}", company or "Your Properties")
    site = cfg["site_url"].rstrip("/")

    text = (HERE / "template.txt").read_text(encoding="utf-8")
    text = (text.replace("{{greeting}}", greeting_for(company, contact))
                .replace("{{company}}", display_company)
                .replace("{{site}}", site))

    page = (HERE / "template.html").read_text(encoding="utf-8")
    page = (page.replace("{{greeting}}", html.escape(greeting_for(company, contact)))
                .replace("{{company}}", html.escape(display_company))
                .replace("{{site}}", site))
    return subject, text, page
