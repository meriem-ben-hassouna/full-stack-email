from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from .base import Base
from app.models.enums import Role


class User(Base):

    __tablename__ = "users"


    id_user = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )


    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.id_company"),
        nullable=False
    )


    username = Column(
        String,
        nullable=False
    )


    email = Column(
        String,
        unique=True,
        nullable=False
    )


    password_hash = Column(
        String,
        nullable=False
    )


    role = Column(
        Enum(Role),
        nullable=False
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    company = relationship(
        "Company",
        back_populates="users"
    )

    emails = relationship(
        "Email",
        back_populates="sender"
    )