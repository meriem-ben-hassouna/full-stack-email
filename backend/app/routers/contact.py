from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.contact import Contact
from app.models.group import GroupMember
from app.models.email import EmailRecipient
from app.schemas.contact import ContactResponse, ContactImportResponse
from app.services.excel_service import import_contacts_from_excel

router = APIRouter(
    prefix="/contacts",
    tags=["Contacts"]
)


# ==========================
# GET CONTACTS FOR A COMPANY
# ("All" bubble in the UI is simply every contact of the company)
# ==========================

@router.get(
    "",
    response_model=list[ContactResponse]
)
def get_contacts(
    company_id: str,
    db: Session = Depends(get_db)
):

    contacts = (
        db.query(Contact)
        .filter(Contact.company_id == company_id)
        .order_by(Contact.name.asc())
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
# Expected columns (in order): name | email | department
# Manager only (enforced on the frontend + could be re-checked here
# with a real auth token in a production setup).
# ==========================

@router.post("/import", response_model=ContactImportResponse)
def import_contacts(
    company_id: str,
    imported_by: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    if not file.filename.lower().endswith((".xlsx", ".xlsm", ".xls")):
        raise HTTPException(
            status_code=400,
            detail="Only .xlsx/.xls files are supported"
        )

    try:
        contact_file, imported, skipped = import_contacts_from_excel(
            db=db,
            file=file.file,
            company_id=company_id,
            imported_by=imported_by,
            filename=file.filename
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return {
        "message": "Contacts imported successfully",
        "file_id": contact_file.id_file,
        "filename": contact_file.filename,
        "imported": imported,
        "skipped_duplicates": skipped,
    }

# ==========================
# DELETE CONTACT
# Removes the contact everywhere: the contacts table AND every
# group it belonged to.
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

    # Remove from every group first (no DB-level cascade is configured)
    (
        db.query(GroupMember)
        .filter(GroupMember.contact_id == contact_id)
        .delete(synchronize_session=False)
    )

    # Also drop any email-recipient history rows pointing to this
    # contact (the emails themselves are kept, only this recipient
    # entry is removed since the contact no longer exists).
    (
        db.query(EmailRecipient)
        .filter(EmailRecipient.contact_id == contact_id)
        .delete(synchronize_session=False)
    )

    db.delete(contact)
    db.commit()

    return {
        "message": "Contact deleted successfully"
    }