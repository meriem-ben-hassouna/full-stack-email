from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

from app.models.enums import Role



# =========================
# MANAGER REGISTRATION
# =========================

class ManagerRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

    company_name: str
    company_code: str



# =========================
# EMPLOYEE REGISTRATION
# =========================

class EmployeeRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

    company_name: str
    company_code: str

# =========================
# LOGIN
# =========================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# =========================
# USER RESPONSE
# =========================

class UserResponse(BaseModel):
    id_user: UUID
    username: str
    email: EmailStr
    role: Role
    company_id: UUID
    created_at: datetime


    class Config:
        from_attributes = True



# =========================
# USER RESPONSE WITH COMPANY INFO
# (returned on login / register so the frontend can display
# company name + code without an extra request)
# =========================

class UserWithCompanyResponse(UserResponse):
    company_name: str
    company_code: str