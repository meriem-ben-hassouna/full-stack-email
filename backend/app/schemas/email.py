from pydantic import BaseModel
from uuid import UUID
from datetime import datetime



# =========================
# SEND EMAIL
# =========================

class EmailCreate(BaseModel):

    sender_id: UUID
    group_ids: list[UUID] = []
    # direct contact ids, used e.g. for the virtual "All" bubble which
    # is not a real group in the database
    contact_ids: list[UUID] = []

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
    recipients_count: int = 0


    class Config:
        from_attributes = True