import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.case import Case
from app.models.enums import CaseStatus
from app.repositories.case_repository import CaseRepository
from app.repositories.case_taking_repository import CaseTakingRepository
from app.repositories.consent_repository import ConsentRepository
from app.repositories.patient_repository import PatientRepository
from app.schemas.case import CaseCreate
from app.schemas.case_taking import CaseTakingUpdate
from app.schemas.consent import ConsentUpdate
from app.schemas.patient import PatientIdentification
from app.services.errors import (
    CaseNotFoundError,
    ConsentRequiredError,
    IdentificationRequiredError,
    InvalidCaseStateError,
)


class CaseService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.cases = CaseRepository(db)
        self.patients = PatientRepository(db)
        self.consents = ConsentRepository(db)
        self.case_taking = CaseTakingRepository(db)

    def _get_draft(self, case_id: uuid.UUID) -> Case:
        case = self.cases.get(case_id)
        if case is None:
            raise CaseNotFoundError()
        if case.status != CaseStatus.draft:
            raise InvalidCaseStateError()
        return case

    def create_case(self, data: CaseCreate) -> Case:
        if data.patient is not None:
            patient = self.patients.create(data.patient)
        else:
            patient = self.patients.create_placeholder()
        case = self.cases.create(patient_id=patient.id, language=data.language)
        self.db.commit()
        return case

    def update_consent(self, case_id: uuid.UUID, data: ConsentUpdate) -> Case:
        self._get_draft(case_id)
        granted_at = datetime.now(timezone.utc) if data.granted else None
        self.consents.upsert(case_id, data, granted_at)
        self.db.commit()
        return self.cases.get(case_id)

    def update_identification(
        self, case_id: uuid.UUID, data: PatientIdentification
    ) -> Case:
        case = self._get_draft(case_id)
        patient = self.patients.get(case.patient_id)
        self.patients.update_identification(patient, data)
        self.db.commit()
        return case

    def update_case_taking(
        self, case_id: uuid.UUID, data: CaseTakingUpdate
    ) -> Case:
        self._get_draft(case_id)
        self.case_taking.upsert(case_id, data)
        self.db.commit()
        return self.cases.get(case_id)

    def submit_case(self, case_id: uuid.UUID) -> Case:
        case = self._get_draft(case_id)

        patient = self.patients.get(case.patient_id)
        if patient.full_name is None or patient.dob is None or patient.sex is None:
            raise IdentificationRequiredError()

        granted = [c for c in self.consents.list_for_case(case_id) if c.granted]
        if not granted:
            raise ConsentRequiredError()

        case.status = CaseStatus.submitted
        case.submitted_at = datetime.now(timezone.utc)
        self.db.commit()
        return case

    def get_summary_case(self, case_id: uuid.UUID) -> Case:
        case = self.cases.get_with_relations(case_id)
        if case is None:
            raise CaseNotFoundError()
        return case
