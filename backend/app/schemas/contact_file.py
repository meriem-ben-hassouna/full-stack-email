from pydantic import BaseModel
from uuid import UUID
from datetime import datetime



class ContactFileResponse(BaseModel):

    id_file: UUID
    filename: str
    category: str | None
    uploaded_at: datetime


    class Config:
        from_attributes = True