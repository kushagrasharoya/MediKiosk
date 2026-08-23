import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.document import Document


class DocumentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        case_id: uuid.UUID,
        filename: str,
        mime_type: str,
        storage_path: str,
    ) -> Document:
        document = Document(
            case_id=case_id,
            filename=filename,
            mime_type=mime_type,
            storage_path=storage_path,
        )
        self.db.add(document)
        self.db.flush()
        return document

    def list_for_case(self, case_id: uuid.UUID) -> list[Document]:
        stmt = select(Document).where(Document.case_id == case_id)
        return list(self.db.execute(stmt).scalars().all())
