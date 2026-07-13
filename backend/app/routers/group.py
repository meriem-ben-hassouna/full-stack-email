from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.group import Group, GroupMember
from app.models.contact import Contact

from app.schemas.group import (
    GroupCreate,
    GroupUpdate,
    GroupResponse
)


router = APIRouter(
    prefix="/groups",
    tags=["Groups"]
)



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
# GET GROUPS
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
        .all()
    )


    return groups



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
        raise HTTPException(
            status_code=400,
            detail="Contact already in group"
        )


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