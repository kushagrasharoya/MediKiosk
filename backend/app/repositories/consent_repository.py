import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.consent import Consent
from app.schemas.consent import ConsentUpdate


class ConsentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_case_and_type(
        self, case_id: uuid.UUID, consent_type: str
    ) -> Consent | None:
        stmt = select(Consent).where(
            Consent.case_id == case_id, Consent.consent_type == consent_type
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def list_for_case(self, case_id: uuid.UUID) -> list[Consent]:
        stmt = select(Consent).where(Consent.case_id == case_id)
        return list(self.db.execute(stmt).scalars().all())

    def upsert(
        self, case_id: uuid.UUID, data: ConsentUpdate, granted_at
    ) -> Consent:
        consent = self.get_by_case_and_type(case_id, data.consent_type)
        if consent is None:
            consent = Consent(case_id=case_id, consent_type=data.consent_type)
            self.db.add(consent)
        consent.granted = data.granted
        consent.method = data.method
        consent.granted_at = granted_at
        self.db.flush()
        return consent
