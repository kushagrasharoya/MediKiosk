import uuid

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document
from app.models.enums import CaseStatus
from app.repositories.case_repository import CaseRepository
from app.repositories.document_repository import DocumentRepository
from app.services.errors import (
    CaseNotFoundError,
    InvalidCaseStateError,
    InvalidUploadError,
)
from app.services.storage import FileStorage


class DocumentService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.cases = CaseRepository(db)
        self.documents = DocumentRepository(db)
        self.storage = FileStorage()

    def upload(
        self,
        case_id: uuid.UUID,
        filename: str,
        mime_type: str,
        content: bytes,
    ) -> Document:
        case = self.cases.get(case_id)
        if case is None:
            raise CaseNotFoundError()
        if case.status != CaseStatus.draft:
            raise InvalidCaseStateError()

        if mime_type not in settings.allowed_upload_mime_types:
            raise InvalidUploadError("Unsupported file type.")
        if len(content) == 0:
            raise InvalidUploadError("Empty file.")
        if len(content) > settings.max_upload_size:
            raise InvalidUploadError("File exceeds maximum allowed size.")

        storage_path = self.storage.save(case_id, filename, content)
        document = self.documents.create(
            case_id=case_id,
            filename=filename,
            mime_type=mime_type,
            storage_path=storage_path,
        )
        self.db.commit()
        return document
