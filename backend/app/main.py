from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
from app.routers import contact



app = FastAPI(
    title="NoxInbox API"
)

# Allow the Vite dev server (and any local frontend) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(company.router)
app.include_router(user.router)
app.include_router(group.router)
app.include_router(email.router)
app.include_router(contact_file.router)
app.include_router(contact.router)

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "NoxInbox backend running"
    }