from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.contact import Contact
from app.schemas.contact import ContactResponse
from app.services.excel_service import import_contacts_from_excel

router = APIRouter(
    prefix="/contacts",
    tags=["Contacts"]
)



# ==========================
# GET ALL CONTACTS
# ==========================

@router.get(
    "",
    response_model=list[ContactResponse]
)
def get_contacts(
    db: Session = Depends(get_db)
):

    contacts = (
        db.query(Contact)
        .all()
    )

    return contacts



# ==========================
# GET ONE CONTACT
# ==========================

@router.get(
    "/{contact_id}",
    response_model=ContactResponse
)
def get_contact(
    contact_id: str,
    db: Session = Depends(get_db)
):

    contact = (
        db.query(Contact)
        .filter(
            Contact.id_contact == contact_id
        )
        .first()
    )


    if not contact:
        raise HTTPException(
            status_code=404,
            detail="Contact not found"
        )


    return contact




# ==========================
# IMPORT CONTACTS FROM EXCEL
# ==========================


@router.post("/import")
def import_contacts(
    company_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    contact_file = import_contacts_from_excel(
        db=db,
        file=file.file,
        company_id=company_id,
        filename=file.filename
    )


    return {
        "message": "Contacts imported successfully",
        "file_id": str(contact_file.id_file),
        "filename": contact_file.filename
    }





# ==========================
# DELETE CONTACT
# ==========================

@router.delete(
    "/{contact_id}"
)
def delete_contact(
    contact_id: str,
    db: Session = Depends(get_db)
):

    contact = (
        db.query(Contact)
        .filter(
            Contact.id_contact == contact_id
        )
        .first()
    )


    if not contact:
        raise HTTPException(
            status_code=404,
            detail="Contact not found"
        )


    db.delete(contact)
    db.commit()


    return {
        "message": "Contact deleted successfully"
    }