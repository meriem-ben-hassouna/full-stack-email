# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
# NoxInbox — Group Email Sender for Companies

A full-stack app (FastAPI + PostgreSQL backend, React + Vite frontend) for
companies to manage employee/contact groups and send personalized group
emails.

## How it works

- **Register**: pick Manager (creates a new company + becomes its manager)
  or Employee (joins an existing company using its exact name + code).
- **Login**: wrong password → error. Role from the database decides which
  interface (Manager or Employee) you land on.
- **Upload Contacts** (manager only): import an `.xlsx` file with columns
  `name | email | department`. Duplicate contacts (same name + email) are
  skipped automatically. Every import creates a "file" that shows up in the
  Group Builder as `File N – filename`.
- **Contacts page**: an "All" bubble always shows every contact; a bubble is
  added automatically for every group you create. Managers can delete
  contacts (removes them everywhere, including from every group).
- **Group Builder** (manager only): drag a contact or a whole file onto a
  group card to add its members; click × to remove.
- **Compose Email** (everyone): pick "All Contacts" or a specific group,
  write your message using `[contact name]` anywhere — each recipient gets
  a personal copy with their own name substituted in. Every send is logged
  to Email History.

## Project layout

```
NoxInbox/
├── backend/          FastAPI app (SQLAlchemy models, routers, services)
│   ├── app/
│   └── requirements.txt
└── src/               React app (Vite)
    ├── services/       axios API layer
    ├── context/         AuthContext (session, role)
    └── features/        pages (auth, dashboard, contacts, groups, email, ...)
```

## Running it locally

### 1. Backend

Requires a PostgreSQL server. Update `backend/.env` with your connection
string:

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
```

Then:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Tables are created automatically on startup. The API is served at
`http://localhost:8000` (interactive docs at `/docs`).

Optional — to actually send SMTP emails instead of simulating delivery, set
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` in `backend/.env`.

### 2. Frontend

```bash
npm install
npm run dev
```

The frontend reads the backend URL from `VITE_API_BASE_URL` in `.env`
(defaults to `http://localhost:8000`). Open the printed local URL (usually
`http://localhost:5173`).

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
