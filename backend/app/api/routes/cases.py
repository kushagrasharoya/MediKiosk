import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.api.deps import get_case_service, get_document_service
from app.schemas.case import CaseCreate, CaseRead, CaseSummary
from app.schemas.case_taking import CaseTakingUpdate
from app.schemas.consent import ConsentUpdate
from app.schemas.document import DocumentRead
from app.schemas.patient import PatientIdentification
from app.services.case_service import CaseService
from app.services.document_service import DocumentService
from app.services.errors import (
    CaseNotFoundError,
    ConsentRequiredError,
    IdentificationRequiredError,
    InvalidCaseStateError,
    InvalidUploadError,
)

router = APIRouter(prefix="/cases", tags=["cases"])


@router.post("", response_model=CaseRead, status_code=status.HTTP_201_CREATED)
def create_case(
    payload: CaseCreate,
    service: CaseService = Depends(get_case_service),
) -> CaseRead:
    case = service.create_case(payload)
    return CaseRead.model_validate(case)


@router.patch("/{case_id}/consent", response_model=CaseRead)
def update_consent(
    case_id: uuid.UUID,
    payload: ConsentUpdate,
    service: CaseService = Depends(get_case_service),
) -> CaseRead:
    try:
        case = service.update_consent(case_id, payload)
    except CaseNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Case not found.")
    except InvalidCaseStateError:
        raise HTTPException(status.HTTP_409_CONFLICT, "Case is not editable.")
    return CaseRead.model_validate(case)


@router.patch("/{case_id}/identification", response_model=CaseRead)
def update_identification(
    case_id: uuid.UUID,
    payload: PatientIdentification,
    service: CaseService = Depends(get_case_service),
) -> CaseRead:
    try:
        case = service.update_identification(case_id, payload)
    except CaseNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Case not found.")
    except InvalidCaseStateError:
        raise HTTPException(status.HTTP_409_CONFLICT, "Case is not editable.")
    return CaseRead.model_validate(case)


@router.put("/{case_id}/case-taking", response_model=CaseRead)
def update_case_taking(
    case_id: uuid.UUID,
    payload: CaseTakingUpdate,
    service: CaseService = Depends(get_case_service),
) -> CaseRead:
    try:
        case = service.update_case_taking(case_id, payload)
    except CaseNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Case not found.")
    except InvalidCaseStateError:
        raise HTTPException(status.HTTP_409_CONFLICT, "Case is not editable.")
    return CaseRead.model_validate(case)


@router.post(
    "/{case_id}/documents",
    response_model=DocumentRead,
    status_code=status.HTTP_201_CREATED,
)
def upload_document(
    case_id: uuid.UUID,
    file: UploadFile = File(...),
    service: DocumentService = Depends(get_document_service),
) -> DocumentRead:
    content = file.file.read()
    try:
        document = service.upload(
            case_id=case_id,
            filename=file.filename or "upload",
            mime_type=file.content_type or "application/octet-stream",
            content=content,
        )
    except CaseNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Case not found.")
    except InvalidCaseStateError:
        raise HTTPException(status.HTTP_409_CONFLICT, "Case is not editable.")
    except InvalidUploadError as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, str(exc))
    return DocumentRead.model_validate(document)


@router.get("/{case_id}/summary", response_model=CaseSummary)
def get_summary(
    case_id: uuid.UUID,
    service: CaseService = Depends(get_case_service),
) -> CaseSummary:
    try:
        case = service.get_summary_case(case_id)
    except CaseNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Case not found.")
    return CaseSummary(
        id=case.id,
        language=case.language,
        status=case.status,
        created_at=case.created_at,
        submitted_at=case.submitted_at,
        patient=case.patient,
        consents=case.consents,
        case_taking=case.case_taking,
        documents=case.documents,
    )


@router.post("/{case_id}/submit", response_model=CaseRead)
def submit_case(
    case_id: uuid.UUID,
    service: CaseService = Depends(get_case_service),
) -> CaseRead:
    try:
        case = service.submit_case(case_id)
    except CaseNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Case not found.")
    except InvalidCaseStateError:
        raise HTTPException(status.HTTP_409_CONFLICT, "Case is not editable.")
    except IdentificationRequiredError:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Patient identification is required before submission.",
        )
    except ConsentRequiredError:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Consent must be granted before submission.",
        )
    return CaseRead.model_validate(case)
