from typing import Any

from pydantic import BaseModel, ConfigDict


class CaseTakingUpdate(BaseModel):
    chief_complaint: str | None = None
    history: str | None = None
    symptoms: dict[str, Any] | None = None
    vitals: dict[str, Any] | None = None


class CaseTakingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    chief_complaint: str | None
    history: str | None
    symptoms: dict[str, Any] | None
    vitals: dict[str, Any] | None