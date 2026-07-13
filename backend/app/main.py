from fastapi import FastAPI

from app.models import (
    Company,
    User,
    Contact,
    Group,
    GroupMember,
    Email,
    EmailRecipient
)

from app.database import engine
from app.models.base import Base
from app.routers import user
from app.routers import company
from app.routers import group
from app.routers import email
from app.routers import contact_file



app = FastAPI(
    title="NoxInbox API"
)

app.include_router(company.router)
app.include_router(user.router)
app.include_router(group.router)
app.include_router(email.router)
app.include_router(contact_file.router)

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "NoxInbox backend running"
    }