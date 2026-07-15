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
    file_id: UUID
    created_at: datetime


    class Config:
        from_attributes = True



# =========================
# IMPORT RESULT
# =========================

class ContactImportResponse(BaseModel):
    message: str
    file_id: UUID
    filename: str
    imported: int
    skipped_duplicates: int