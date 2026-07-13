from pydantic import BaseModel
from uuid import UUID
from datetime import datetime



# =========================
# COMPANY RESPONSE
# =========================

class CompanyResponse(BaseModel):
    id_company: UUID
    name: str
    code: str
    created_at: datetime


    class Config:
        from_attributes = True



# =========================
# COMPANY UPDATE
# =========================

class CompanyUpdate(BaseModel):
    name: str | None = None
    code: str | None = None