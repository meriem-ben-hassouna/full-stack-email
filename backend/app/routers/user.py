from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from passlib.context import CryptContext

from app.database import get_db

from app.models.user import User
from app.models.company import Company
from app.models.enums import Role

from app.schemas.user import (
    ManagerRegister,
    EmployeeRegister,
    LoginRequest,
    UserResponse
)


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# ==========================
# PASSWORD HANDLING
# ==========================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )



# ==========================
# MANAGER REGISTER
# ==========================

@router.post(
    "/register/manager",
    response_model=UserResponse
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


    return manager




# ==========================
# EMPLOYEE REGISTER
# ==========================

@router.post(
    "/register/employee",
    response_model=UserResponse
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


    return employee




# ==========================
# LOGIN
# ==========================

@router.post(
    "/login",
    response_model=UserResponse
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


    return user