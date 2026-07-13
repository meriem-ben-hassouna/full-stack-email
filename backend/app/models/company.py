from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from .base import Base



class Company(Base):

    __tablename__ = "companies"


    id_company = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )


    name = Column(
        String,
        nullable=False
    )


    code = Column(
        String,
        unique=True,
        nullable=False
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    users = relationship(
        "User",
        back_populates="company"
    )


    contacts = relationship(
        "Contact",
        back_populates="company"
    )


    groups = relationship(
        "Group",
        back_populates="company"
    )

    contact_files = relationship(
        "ContactFile",
        back_populates="company"
    )