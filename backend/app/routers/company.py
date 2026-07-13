from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.company import Company
from app.schemas.company import (
    CompanyCreate,
    CompanyResponse,
    CompanyUpdate
)


router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)



# ==========================
# GET COMPANY
# ==========================

@router.get(
    "/{company_id}",
    response_model=CompanyResponse
)
def get_company(
    company_id: str,
    db: Session = Depends(get_db)
):

    company = (
        db.query(Company)
        .filter(
            Company.id_company == company_id
        )
        .first()
    )


    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )


    return company



# ==========================
# UPDATE COMPANY
# ==========================

@router.put(
    "/{company_id}",
    response_model=CompanyResponse
)
def update_company(
    company_id: str,
    data: CompanyUpdate,
    db: Session = Depends(get_db)
):

    company = (
        db.query(Company)
        .filter(
            Company.id_company == company_id
        )
        .first()
    )


    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )


    if data.name:
        company.name = data.name


    if data.code:
        company.code = data.code


    db.commit()
    db.refresh(company)


    return company



# ==========================
# DELETE COMPANY
# ==========================

@router.delete(
    "/{company_id}"
)
def delete_company(
    company_id: str,
    db: Session = Depends(get_db)
):

    company = (
        db.query(Company)
        .filter(
            Company.id_company == company_id
        )
        .first()
    )


    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )


    db.delete(company)
    db.commit()


    return {
        "message": "Company deleted successfully"
    }