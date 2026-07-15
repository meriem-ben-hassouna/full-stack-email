from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import bcrypt

from app.database import get_db

from app.models.user import User
from app.models.company import Company
from app.models.enums import Role

from app.schemas.user import (
    ManagerRegister,
    EmployeeRegister,
    LoginRequest,
    UserResponse,
    UserWithCompanyResponse
)


def _with_company(user: User, company: Company) -> dict:
    return {
        "id_user": user.id_user,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "company_id": user.company_id,
        "created_at": user.created_at,
        "company_name": company.name,
        "company_code": company.code,
    }


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# ==========================
# PASSWORD HANDLING
# ==========================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )



# ==========================
# MANAGER REGISTER
# ==========================

@router.post(
    "/register/manager",
    response_model=UserWithCompanyResponse
)
def register_manager(
    data: ManagerRegister,
    db: Session = Depends(get_db)
):

    # Check if company already exists

    existing_company = (
        db.query(Company)
        .filter(
            (Company.name == data.company_name)
            |
            (Company.code == data.company_code)
        )
        .first()
    )


    if existing_company:
        raise HTTPException(
            status_code=400,
            detail="Company name or code already exists"
        )


    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists"
        )


    # Create company

    company = Company(
        name=data.company_name,
        code=data.company_code
    )


    db.add(company)
    db.flush()


    # Create manager

    manager = User(
        company_id=company.id_company,
        username=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=Role.MANAGER
    )


    db.add(manager)
    db.commit()
    db.refresh(manager)


    return _with_company(manager, company)




# ==========================
# EMPLOYEE REGISTER
# ==========================

@router.post(
    "/register/employee",
    response_model=UserWithCompanyResponse
)
def register_employee(
    data: EmployeeRegister,
    db: Session = Depends(get_db)
):


    # Find company

    company = (
        db.query(Company)
        .filter(
            Company.name == data.company_name,
            Company.code == data.company_code
        )
        .first()
    )


    if not company:
        raise HTTPException(
            status_code=404,
            detail="Incorrect company information"
        )


    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists"
        )


    # Create employee

    employee = User(
        company_id=company.id_company,
        username=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=Role.EMPLOYEE
    )


    db.add(employee)
    db.commit()
    db.refresh(employee)


    return _with_company(employee, company)




# ==========================
# LOGIN
# ==========================

@router.post(
    "/login",
    response_model=UserWithCompanyResponse
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):


    user = (
        db.query(User)
        .filter(
            User.email == data.email
        )
        .first()
    )


    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )



    if not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )


    company = (
        db.query(Company)
        .filter(Company.id_company == user.company_id)
        .first()
    )

    return _with_company(user, company)