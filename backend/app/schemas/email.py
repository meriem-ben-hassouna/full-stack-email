from pydantic import BaseModel
from uuid import UUID
from datetime import datetime



# =========================
# SEND EMAIL
# =========================

class EmailCreate(BaseModel):

    sender_id: UUID
    group_ids: list[UUID]

    subject: str
    body: str



# =========================
# EMAIL RESPONSE
# =========================

class EmailResponse(BaseModel):

    id_email: UUID
    sender_id: UUID
    subject: str
    body: str
    sent_at: datetime
    status: str


    class Config:
        from_attributes = True