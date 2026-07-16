import re
import os
import html
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


# Matches [contact name], [Contact Name], [name], {contact_name}, etc.
PLACEHOLDER_PATTERN = re.compile(
    r"\[\s*contact[ _]?name\s*\]|\{\s*contact[ _]?name\s*\}",
    re.IGNORECASE
)


def personalize_body(body: str, contact_name: str) -> str:
    """
    Replaces the [contact name] placeholder with the real contact's
    name so every recipient gets a personalized email.
    """
    if not body:
        return body

    return PLACEHOLDER_PATTERN.sub(contact_name, body)


# ==========================
# LIGHTWEIGHT MARKUP -> HTML
# The composer's B / I / U / H1 / H2 toolbar buttons wrap selected
# text in **bold**, *italic*, _underline_ and "# " / "## " heading
# prefixes. This turns that into real HTML so it actually renders
# formatted in the recipient's inbox.
# ==========================

def _markup_to_html(body: str) -> str:
    lines = body.split("\n")
    html_lines = []

    for line in lines:
        escaped = html.escape(line)

        if escaped.startswith("## "):
            html_lines.append(f"<h2>{escaped[3:]}</h2>")
            continue
        if escaped.startswith("# "):
            html_lines.append(f"<h1>{escaped[2:]}</h1>")
            continue

        # Bold and italic share the * character, so bold (**) must be
        # replaced before single-* italics to avoid double-matching.
        escaped = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", escaped)
        escaped = re.sub(r"\*(.+?)\*", r"<i>\1</i>", escaped)
        escaped = re.sub(r"_(.+?)_", r"<u>\1</u>", escaped)

        html_lines.append(escaped if escaped else "&nbsp;")

    return "<br>".join(html_lines)


def send_email(to_email: str, subject: str, body: str) -> bool:
    """
    Sends a single email. If SMTP credentials are configured via
    environment variables, a real email is sent (as HTML, so bold /
    italic / underline / headings from the composer actually render).
    Otherwise the send is simulated (useful for local development /
    demos without a mail provider) and always reports success.
    """

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not (smtp_host and smtp_port and smtp_user and smtp_password):
        # No SMTP configured -> simulate a successful delivery.
        return True

    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = smtp_user
        message["To"] = to_email

        # Plain-text fallback for clients that don't render HTML,
        # plus the real HTML version with formatting applied.
        message.attach(MIMEText(body, "plain"))
        message.attach(MIMEText(_markup_to_html(body), "html"))

        with smtplib.SMTP(smtp_host, int(smtp_port)) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [to_email], message.as_string())

        return True

    except Exception:
        return False
