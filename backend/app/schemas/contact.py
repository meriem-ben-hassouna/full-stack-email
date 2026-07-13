from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime



# =========================
# CONTACT RESPONSE
# =========================

class ContactResponse(BaseModel):

    id_contact: UUID
    name: str
    email: EmailStr
    department: str | None
    category: str | None
    created_at: datetime


    class Config:
        from_attributes = True