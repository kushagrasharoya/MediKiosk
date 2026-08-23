from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import ConsentMethod


class ConsentUpdate(BaseModel):
    consent_type: str
    granted: bool
    method: ConsentMethod


class ConsentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    consent_type: str
    granted: bool
    granted_at: datetime | None
    method: ConsentMethod