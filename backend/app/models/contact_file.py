from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from .base import Base



class ContactFile(Base):

    __tablename__ = "contact_files"


    id_file = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )


    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.id_company"),
        nullable=False
    )


    filename = Column(
        String,
        nullable=False
    )


    category = Column(
        String
    )


    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    company = relationship(
        "Company",
        back_populates="contact_files"
    )


    contacts = relationship(
        "Contact",
        back_populates="file"
    )