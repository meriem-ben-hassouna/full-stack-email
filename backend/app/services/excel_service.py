import openpyxl

from sqlalchemy.orm import Session

from app.models.contact_file import ContactFile
from app.models.contact import Contact



def import_contacts_from_excel(
    db: Session,
    file,
    company_id: str,
    filename: str
):

    workbook = openpyxl.load_workbook(file)

    sheet = workbook.active


    # Create file record

    contact_file = ContactFile(
        company_id=company_id,
        filename=filename
    )


    db.add(contact_file)
    db.flush()



    # Skip header row

    for row in sheet.iter_rows(
        min_row=2,
        values_only=True
    ):

        name = row[0]
        email = row[1]
        department = row[2]
        category = row[3]


        if not email:
            continue



        contact = Contact(

            company_id=company_id,

            file_id=contact_file.id_file,

            name=name,

            email=email,

            department=department,

            category=category
        )


        db.add(contact)


    db.commit()

    db.refresh(contact_file)


    return contact_file