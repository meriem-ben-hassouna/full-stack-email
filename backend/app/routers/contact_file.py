from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.contact_file import ContactFile
from app.models.contact import Contact
from app.schemas.contact_file import ContactFileResponse
from app.schemas.contact import ContactResponse


router = APIRouter(
    prefix="/contact-files",
    tags=["Contact Files"]
)



@router.get(
    "",
    response_model=list[ContactFileResponse]
)
def get_files(
    company_id: str,
    db: Session = Depends(get_db)
):

    files = (
        db.query(ContactFile)
        .filter(
            ContactFile.company_id == company_id
        )
        .order_by(ContactFile.uploaded_at.asc())
        .all()
    )


    return files


# ==========================
# GET CONTACTS OF ONE FILE
# (used by Group Builder when a file is opened / dragged)
# ==========================

@router.get(
    "/{file_id}/contacts",
    response_model=list[ContactResponse]
)
def get_file_contacts(
    file_id: str,
    db: Session = Depends(get_db)
):

    contact_file = (
        db.query(ContactFile)
        .filter(ContactFile.id_file == file_id)
        .first()
    )

    if not contact_file:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    contacts = (
        db.query(Contact)
        .filter(Contact.file_id == file_id)
        .order_by(Contact.name.asc())
        .all()
    )

    return contacts