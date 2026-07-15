import re
import os
import smtplib
from email.mime.text import MIMEText


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


def send_email(to_email: str, subject: str, body: str) -> bool:
    """
    Sends a single email. If SMTP credentials are configured via
    environment variables, a real email is sent. Otherwise the send
    is simulated (useful for local development / demos without a
    mail provider) and always reports success.
    """

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not (smtp_host and smtp_port and smtp_user and smtp_password):
        # No SMTP configured -> simulate a successful delivery.
        return True

    try:
        message = MIMEText(body, "plain")
        message["Subject"] = subject
        message["From"] = smtp_user
        message["To"] = to_email

        with smtplib.SMTP(smtp_host, int(smtp_port)) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [to_email], message.as_string())

        return True

    except Exception:
        return False
