from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from .base import Base


class GroupMember(Base):

    __tablename__ = "group_members"


    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )


    group_id = Column(
        UUID(as_uuid=True),
        ForeignKey("groups.id_group"),
        nullable=False
    )


    contact_id = Column(
        UUID(as_uuid=True),
        ForeignKey("contacts.id_contact"),
        nullable=False
    )


    added_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    group = relationship(
        "Group",
        back_populates="members"
    )



class Group(Base):

    __tablename__ = "groups"


    id_group = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )


    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.id_company"),
        nullable=False
    )


    created_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id_user"),
        nullable=False
    )


    name = Column(
        String,
        nullable=False
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    company = relationship(
        "Company",
        back_populates="groups"
    )


    members = relationship(
        "GroupMember",
        back_populates="group"
    )

