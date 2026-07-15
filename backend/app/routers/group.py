from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import UUID

from app.database import get_db

from app.models.group import Group, GroupMember
from app.models.contact import Contact

from app.schemas.group import (
    GroupCreate,
    GroupUpdate,
    GroupResponse,
    GroupWithMembers
)


router = APIRouter(
    prefix="/groups",
    tags=["Groups"]
)


class BulkContactIds(BaseModel):
    contact_ids: list[UUID]


# ==========================
# CREATE GROUP
# ==========================

@router.post(
    "",
    response_model=GroupResponse
)
def create_group(
    data: GroupCreate,
    db: Session = Depends(get_db)
):

    existing = (
        db.query(Group)
        .filter(
            Group.company_id == data.company_id,
            Group.name == data.name
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="A group with this name already exists"
        )

    group = Group(
        name=data.name,
        company_id=data.company_id,
        created_by=data.created_by
    )

    db.add(group)
    db.commit()
    db.refresh(group)

    return group


# ==========================
# GET GROUPS (bubble list, no member detail)
# ==========================

@router.get(
    "",
    response_model=list[GroupResponse]
)
def get_groups(
    company_id: str,
    db: Session = Depends(get_db)
):

    groups = (
        db.query(Group)
        .filter(
            Group.company_id == company_id
        )
        .order_by(Group.created_at.asc())
        .all()
    )

    return groups


# ==========================
# GET ONE GROUP WITH FULL MEMBER DETAILS
# (used when clicking a bubble in Contacts, and by Group Builder)
# ==========================

@router.get(
    "/{group_id}",
    response_model=GroupWithMembers
)
def get_group(
    group_id: str,
    db: Session = Depends(get_db)
):

    group = (
        db.query(Group)
        .filter(Group.id_group == group_id)
        .first()
    )

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    contact_ids = [m.contact_id for m in group.members]

    contacts = (
        db.query(Contact)
        .filter(Contact.id_contact.in_(contact_ids))
        .all()
    ) if contact_ids else []

    response = GroupWithMembers(
        id_group=group.id_group,
        name=group.name,
        company_id=group.company_id,
        created_by=group.created_by,
        created_at=group.created_at,
        members=contacts,
    )

    return response


# ==========================
# RENAME GROUP
# ==========================

@router.put(
    "/{group_id}",
    response_model=GroupResponse
)
def update_group(
    group_id: str,
    data: GroupUpdate,
    db: Session = Depends(get_db)
):

    group = (
        db.query(Group)
        .filter(
            Group.id_group == group_id
        )
        .first()
    )

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    group.name = data.name

    db.commit()
    db.refresh(group)

    return group


# ==========================
# DELETE GROUP
# ==========================

@router.delete("/{group_id}")
def delete_group(
    group_id: str,
    db: Session = Depends(get_db)
):

    group = (
        db.query(Group)
        .filter(
            Group.id_group == group_id
        )
        .first()
    )

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    (
        db.query(GroupMember)
        .filter(GroupMember.group_id == group_id)
        .delete(synchronize_session=False)
    )

    db.delete(group)
    db.commit()

    return {
        "message": "Group deleted"
    }


# ==========================
# ADD CONTACT TO GROUP
# ==========================

@router.post(
    "/{group_id}/contacts/{contact_id}"
)
def add_contact(
    group_id: str,
    contact_id: str,
    db: Session = Depends(get_db)
):

    existing = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group_id,
            GroupMember.contact_id == contact_id
        )
        .first()
    )

    if existing:
        return {
            "message": "Contact already in group"
        }

    member = GroupMember(
        group_id=group_id,
        contact_id=contact_id
    )

    db.add(member)
    db.commit()

    return {
        "message": "Contact added to group"
    }


# ==========================
# BULK ADD CONTACTS TO GROUP
# (used when dropping a whole contact file onto a group)
# ==========================

@router.post(
    "/{group_id}/contacts"
)
def add_contacts_bulk(
    group_id: str,
    data: BulkContactIds,
    db: Session = Depends(get_db)
):

    existing_ids = {
        str(m.contact_id)
        for m in (
            db.query(GroupMember)
            .filter(GroupMember.group_id == group_id)
            .all()
        )
    }

    added = 0

    for contact_id in data.contact_ids:
        if str(contact_id) in existing_ids:
            continue

        db.add(GroupMember(group_id=group_id, contact_id=contact_id))
        existing_ids.add(str(contact_id))
        added += 1

    db.commit()

    return {
        "message": f"{added} contact(s) added to group"
    }


# ==========================
# REMOVE CONTACT
# ==========================

@router.delete(
    "/{group_id}/contacts/{contact_id}"
)
def remove_contact(
    group_id: str,
    contact_id: str,
    db: Session = Depends(get_db)
):

    member = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group_id,
            GroupMember.contact_id == contact_id
        )
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Contact not in group"
        )

    db.delete(member)
    db.commit()

    return {
        "message": "Contact removed"
    }
