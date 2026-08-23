MediKiosk

MediKiosk is a full-stack patient case-taking application for managing
patient identification, consent, case-taking information, supporting
documents, case summaries, and case submission through a structured
workflow.

The repository is organized as a monorepo with a React/Vite frontend and
a FastAPI/Python backend backed by PostgreSQL.

Project Structure

MediKiosk/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   └── deps.py
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── services/
│   ├── alembic/
│   │   └── versions/
│   ├── alembic.ini
│   ├── pyproject.toml
│   └── .env.example
├── frontend/
│   └── ...
├── docker-compose.yml
└── README.md

Technology Stack

Layer                 Technology

Frontend              React, TypeScript, Vite, Tailwind CSS
Backend               Python 3.11+, FastAPI, Uvicorn
ORM                   SQLAlchemy
Validation            Pydantic, Pydantic Settings
Database              PostgreSQL
Database Migrations   Alembic
PostgreSQL Driver     Psycopg

Prerequisites

Install:

Git

Python 3.11 or newer

Node.js and npm

PostgreSQL

pgAdmin 4 (optional)

Verify:

git --version
python --version
node --version
npm --version
psql --version

1. Clone the Repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd MediKiosk

Replace the placeholder with the actual GitHub repository URL.

2. Configure PostgreSQL

Make sure PostgreSQL is running.

Using pgAdmin 4 or psql, create the application role:

CREATE ROLE medikiosk WITH LOGIN PASSWORD 'medikiosk';

Create the database:

CREATE DATABASE medikiosk OWNER medikiosk;

The development connection string is:

postgresql+psycopg://medikiosk:medikiosk@localhost:5432/medikiosk

If you use different credentials, update DATABASE_URL in the backend
.env.

Optional Docker PostgreSQL

docker run --name medikiosk-db   -e POSTGRES_USER=medikiosk   -e POSTGRES_PASSWORD=medikiosk   -e POSTGRES_DB=medikiosk   -p 5432:5432   -d postgres:16

Verify:

docker ps

3. Backend Setup

Open a terminal in the project root:

cd backend

Windows PowerShell

python -m venv .venv
.venv\Scripts\Activate.ps1

Windows Command Prompt

python -m venv .venv
.venv\Scriptsctivate

macOS/Linux

python3 -m venv .venv
source .venv/bin/activate

Install dependencies:

python -m pip install --upgrade pip
pip install -e ".[dev]"

4. Configure Environment Variables

Copy the example file.

PowerShell:

Copy-Item .env.example .env

Command Prompt:

copy .env.example .env

macOS/Linux:

cp .env.example .env

Edit backend/.env:

DATABASE_URL=postgresql+psycopg://medikiosk:medikiosk@localhost:5432/medikiosk
SECRET_KEY=change-this-to-a-long-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173
UPLOAD_DIR=./uploads
ENVIRONMENT=development

Do not commit .env to GitHub.

5. Run Database Migrations

From the backend directory:

alembic upgrade head

This creates/updates the PostgreSQL schema using the version-controlled
Alembic migrations.

The database contains tables such as:

patients
cases
consents
case_takings
documents
doctors
verifications
alembic_version

For future schema changes:

alembic revision --autogenerate -m "describe the change"
alembic upgrade head

6. Start the Backend

From backend/:

uvicorn app.main:app --reload --port 8000

Backend:

http://localhost:8000

Health check:

http://localhost:8000/health

Expected response:

{
  "status": "ok",
  "service": "MediKiosk",
  "environment": "development",
  "database": "ok"
}

Swagger API documentation:

http://localhost:8000/docs

OpenAPI specification:

http://localhost:8000/openapi.json

7. Backend API Workflow

The implemented case workflow is:

Create Case
    |
    v
Patient Draft
    |
    v
Consent
    |
    v
Patient Identification
    |
    v
Case Taking
    |
    v
Document Upload
    |
    v
Case Summary
    |
    v
Submit Case

API Endpoints

Method                  Endpoint                                   Purpose

GET                     /health                                  Backend/database health

POST                    /api/v1/cases                            Create a case

PATCH                   /api/v1/cases/{case_id}/consent          Update consent

PATCH                   /api/v1/cases/{case_id}/identification   Update patient
identification

PUT                     /api/v1/cases/{case_id}/case-taking      Update case-taking data

POST                    /api/v1/cases/{case_id}/documents        Upload a document

GET                     /api/v1/cases/{case_id}/summary          Retrieve case summary

POST                    /api/v1/cases/{case_id}/submit           Submit a case

All endpoints can be tested through:

http://localhost:8000/docs

8. Document Upload

The document endpoint accepts multipart/form-data.

Supported MIME types:

image/jpeg
image/png
application/pdf

The default maximum upload size is 10 MB.

Uploaded files are stored under:

backend/uploads/

Each case receives its own storage directory:

backend/
└── uploads/
    └── <case-uuid>/
        └── <generated-file-name>

Document metadata is stored in PostgreSQL.

9. Frontend Setup

Keep the backend running and open a second terminal.

From the repository root:

cd frontend

Install dependencies:

npm install

If the frontend contains .env.example, copy it to .env.

Configure the backend URL:

VITE_API_BASE_URL=http://localhost:8000

Start the frontend:

npm run dev

Vite will display the frontend URL in the terminal, normally:

http://localhost:5173

10. Run the Complete Application

Two terminals should remain running.

Terminal 1: Backend

cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000

Terminal 2: Frontend

cd frontend
npm run dev

Then open the frontend URL displayed by Vite.

The frontend communicates with the FastAPI backend, while the backend
communicates with PostgreSQL.

11. Verify the Database

Using pgAdmin 4 or psql:

SELECT
    id AS case_uuid,
    patient_id,
    status,
    created_at,
    submitted_at
FROM cases
ORDER BY created_at DESC;

A successfully submitted case should contain:

status = submitted

and a non-null:

submitted_at

12. Environment and Git Rules

Do not commit:

.env
.venv/
uploads/
node_modules/
dist/
__pycache__/

The repository should contain .env.example, not the real .env.

Never commit:

Database passwords

Secret keys

Access tokens

Patient information

Real medical documents

Virtual environments

node_modules

13. Troubleshooting

PostgreSQL authentication error

If you see:

password authentication failed for user "medikiosk"

check that PostgreSQL is running and that the credentials in
DATABASE_URL match the PostgreSQL role.

Example:

DATABASE_URL=postgresql+psycopg://medikiosk:medikiosk@localhost:5432/medikiosk

Alembic connection error

Verify PostgreSQL and DATABASE_URL, then run:

alembic upgrade head

from backend/.

Backend port already in use

Use another port:

uvicorn app.main:app --reload --port 8001

If the port changes, update VITE_API_BASE_URL.

Frontend port already in use

Use the URL printed by Vite. Vite will normally select another available
port.

Document upload error

Check:

The file type is supported.

The file is not empty.

The file is below the configured size limit.

UPLOAD_DIR is writable.

The case exists.

The case is still in draft status.

14. Architecture

The backend follows a layered structure:

API Routes
     |
     v
Services
     |
     v
Repositories
     |
     v
SQLAlchemy Models
     |
     v
PostgreSQL

API schemas are separated from database models.

Alembic provides version-controlled database migrations.

Document uploads are handled by the document service and persisted to
local storage, while document metadata is stored in PostgreSQL.

15. Current Implementation Status

The following backend workflow has been implemented and locally
verified:

Component                 Status

Case creation             Complete
Draft patient creation    Complete
Consent                   Complete
Patient identification    Complete
Case taking               Complete
Document upload           Complete
File storage              Complete
Case summary              Complete
Case submission           Complete
PostgreSQL verification   Complete
Alembic migrations        Complete
Swagger/API testing       Complete

The verified submission flow reaches:

status = submitted

with:

submitted_at

populated in PostgreSQL.

16. Useful Commands

Backend

cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000

Database migration

cd backend
alembic upgrade head

Create a migration

cd backend
alembic revision --autogenerate -m "describe the change"

Frontend

cd frontend
npm install
npm run dev

17. License

Add the project's chosen license here before publishing the repository
publicly.

18. Contributors

MediKiosk is developed collaboratively.

Contributors should use feature branches, keep secrets out of version
control, document database changes through Alembic migrations, and
verify the complete application workflow before opening a pull request.