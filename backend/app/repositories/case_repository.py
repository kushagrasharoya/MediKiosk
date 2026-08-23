import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.case import Case


class CaseRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, patient_id: int, language: str) -> Case:
        case = Case(patient_id=patient_id, language=language)
        self.db.add(case)
        self.db.flush()
        return case

    def get(self, case_id: uuid.UUID) -> Case | None:
        return self.db.get(Case, case_id)

    def get_with_relations(self, case_id: uuid.UUID) -> Case | None:
        stmt = (
            select(Case)
            .where(Case.id == case_id)
            .options(
                selectinload(Case.patient),
                selectinload(Case.consents),
                selectinload(Case.case_taking),
                selectinload(Case.documents),
            )
        )
        return self.db.execute(stmt).scalar_one_or_none()
