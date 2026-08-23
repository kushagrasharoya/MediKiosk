import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.case_taking import CaseTaking
from app.schemas.case_taking import CaseTakingUpdate


class CaseTakingRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_case(self, case_id: uuid.UUID) -> CaseTaking | None:
        stmt = select(CaseTaking).where(CaseTaking.case_id == case_id)
        return self.db.execute(stmt).scalar_one_or_none()

    def upsert(self, case_id: uuid.UUID, data: CaseTakingUpdate) -> CaseTaking:
        record = self.get_by_case(case_id)
        if record is None:
            record = CaseTaking(case_id=case_id)
            self.db.add(record)
        record.chief_complaint = data.chief_complaint
        record.history = data.history
        record.symptoms = data.symptoms
        record.vitals = data.vitals
        self.db.flush()
        return record
