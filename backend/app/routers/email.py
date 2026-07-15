from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db

from app.models.email import Email, EmailRecipient
from app.models.group import GroupMember
from app.models.contact import Contact
from app.models.enums import EmailStatus

from app.schemas.email import (
    EmailCreate,
    EmailResponse
)

from app.services.email_service import personalize_body, send_email


router = APIRouter(
    prefix="/emails",
    tags=["Emails"]
)


# ==========================
# SEND EMAIL
# Recipients can come from groups and/or explicit contact ids
# (the virtual "All contacts" bubble is not a real DB group, so the
# frontend sends every contact id directly for it).
# Every contact gets a personalized copy: [contact name] in the body
# is replaced with their real name before "sending".
# ==========================

@router.post(
    "/send",
    response_model=EmailResponse
)
def send_email_endpoint(
    data: EmailCreate,
    db: Session = Depends(get_db)
):

    contact_ids = set(str(c) for c in data.contact_ids)

    if data.group_ids:
        members = (
            db.query(GroupMember)
            .filter(GroupMember.group_id.in_(data.group_ids))
            .all()
        )
        for m in members:
            contact_ids.add(str(m.contact_id))

    if not contact_ids:
        raise HTTPException(
            status_code=400,
            detail="No recipients found"
        )

    contacts = (
        db.query(Contact)
        .filter(Contact.id_contact.in_(contact_ids))
        .all()
    )

    if not contacts:
        raise HTTPException(
            status_code=400,
            detail="No recipients found"
        )

    # Create email record

    email = Email(
        sender_id=data.sender_id,
        subject=data.subject,
        body=data.body,
        status=EmailStatus.DELIVERED
    )

    db.add(email)
    db.flush()

    delivered_count = 0

    for contact in contacts:

        personalized = personalize_body(data.body, contact.name)
        success = send_email(contact.email, data.subject, personalized)

        recipient = EmailRecipient(
            email_id=email.id_email,
            contact_id=contact.id_contact,
            delivery_status="delivered" if success else "failed",
            delivered_at=datetime.utcnow() if success else None,
        )

        db.add(recipient)

        if success:
            delivered_count += 1

    email.status = (
        EmailStatus.DELIVERED
        if delivered_count == len(contacts)
        else EmailStatus.PARTIAL
    )

    db.commit()
    db.refresh(email)

    result = EmailResponse.model_validate(email)
    result.recipients_count = len(contacts)

    return result


# ==========================
# EMAIL HISTORY
# ==========================

@router.get(
    "/history",
    response_model=list[EmailResponse]
)
def email_history(
    sender_id: str,
    db: Session = Depends(get_db)
):

    emails = (
        db.query(Email)
        .filter(
            Email.sender_id == sender_id
        )
        .order_by(Email.sent_at.desc())
        .all()
    )

    results = []
    for e in emails:
        r = EmailResponse.model_validate(e)
        r.recipients_count = len(e.recipients)
        results.append(r)

    return results
