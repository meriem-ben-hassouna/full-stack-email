from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

from app.schemas.contact import ContactResponse



# =========================
# CREATE GROUP
# =========================

class GroupCreate(BaseModel):
    name: str
    company_id: UUID
    created_by: UUID



# =========================
# UPDATE GROUP
# =========================

class GroupUpdate(BaseModel):
    name: str



# =========================
# RESPONSE
# =========================

class GroupResponse(BaseModel):

    id_group: UUID
    name: str
    company_id: UUID
    created_by: UUID
    created_at: datetime


    class Config:
        from_attributes = True



# =========================
# GROUP WITH MEMBER DETAILS
# (used to render bubble click -> member list, and group builder)
# =========================

class GroupWithMembers(GroupResponse):
    members: list[ContactResponse] = []