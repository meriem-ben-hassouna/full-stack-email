from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from .base import Base
from app.models.enums import EmailStatus



class EmailRecipient(Base):

    __tablename__ = "email_recipients"


    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )


    email_id = Column(
        UUID(as_uuid=True),
        ForeignKey("emails.id_email"),
        nullable=False
    )


    contact_id = Column(
        UUID(as_uuid=True),
        ForeignKey("contacts.id_contact"),
        nullable=False
    )


    delivery_status = Column(
        String,
        nullable=False
    )
    email = relationship(
        "Email",
        back_populates="recipients"
    )


    delivered_at = Column(
        DateTime
    )



class Email(Base):

    __tablename__ = "emails"


    id_email = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )


    sender_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id_user"),
        nullable=False
    )


    subject = Column(
        String,
        nullable=False
    )


    body = Column(
        Text,
        nullable=False
    )


    sent_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    status = Column(
        Enum(EmailStatus),
        nullable=False
    )


    recipients = relationship(
        "EmailRecipient",
        back_populates="email"
    )

    sender = relationship(
        "User",
        back_populates="emails"
    )