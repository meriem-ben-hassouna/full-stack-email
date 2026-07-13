from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.email import Email, EmailRecipient
from app.models.group import Group, GroupMember
from app.models.enums import EmailStatus

from app.schemas.email import (
    EmailCreate,
    EmailResponse
)


router = APIRouter(
    prefix="/emails",
    tags=["Emails"]
)



# ==========================
# SEND EMAIL
# ==========================

@router.post(
    "/send",
    response_model=EmailResponse
)
def send_email(
    data: EmailCreate,
    db: Session = Depends(get_db)
):


    # Create email record

    email = Email(
        sender_id=data.sender_id,
        subject=data.subject,
        body=data.body,
        status=EmailStatus.DELIVERED
    )


    db.add(email)
    db.flush()



    # Find contacts from groups

    members = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id.in_(data.group_ids)
        )
        .all()
    )


    if not members:
        raise HTTPException(
            status_code=400,
            detail="No recipients found"
        )



    # Create recipients

    for member in members:

        recipient = EmailRecipient(
            email_id=email.id_email,
            contact_id=member.contact_id,
            delivery_status="pending"
        )

        db.add(recipient)



    db.commit()
    db.refresh(email)


    return email





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
        .all()
    )


    return emails