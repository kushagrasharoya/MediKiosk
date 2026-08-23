from collections.abc import Generator

from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.case_service import CaseService
from app.services.document_service import DocumentService


def db_session() -> Generator[Session, None, None]:
    yield from get_db()


def get_case_service(
    db: Session = Depends(db_session),
) -> CaseService:
    return CaseService(db)


def get_document_service(
    db: Session = Depends(db_session),
) -> DocumentService:
    return DocumentService(db)