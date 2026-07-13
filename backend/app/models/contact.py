from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from .base import Base


class Contact(Base):

    __tablename__ = "contacts"


    id_contact = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )


    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.id_company"),
        nullable=False
    )


    imported_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id_user"),
        nullable=False
    )


    name = Column(
        String,
        nullable=False
    )


    email = Column(
        String,
        nullable=False
    )


    department = Column(
        String
    )


    category = Column(
        String
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    file_id = Column(
        UUID(as_uuid=True),
        ForeignKey("contact_files.id_file"),
        nullable=False
    )

    file = relationship(
        "ContactFile",
        back_populates="contacts"
    )
    company = relationship(
        "Company",
        back_populates="contacts"
    )