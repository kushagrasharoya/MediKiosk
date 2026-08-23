import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import CaseStatus
from app.schemas.case_taking import CaseTakingRead
from app.schemas.consent import ConsentRead
from app.schemas.document import DocumentRead
from app.schemas.patient import PatientIdentification, PatientRead


class CaseCreate(BaseModel):
    language: str = "en"
    patient: PatientIdentification | None = None


class CaseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    patient_id: int
    language: str
    status: CaseStatus
    created_at: datetime
    submitted_at: datetime | None


class CaseSummary(BaseModel):
    id: uuid.UUID
    language: str
    status: CaseStatus
    created_at: datetime
    submitted_at: datetime | None
    patient: PatientRead
    consents: list[ConsentRead]
    case_taking: CaseTakingRead | None
    documents: list[DocumentRead]