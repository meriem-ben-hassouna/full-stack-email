from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.contact_file import ContactFile
from app.schemas.contact_file import ContactFileResponse


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
        .all()
    )


    return files