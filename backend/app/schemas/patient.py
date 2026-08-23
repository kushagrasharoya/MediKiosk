from datetime import date

from pydantic import BaseModel, ConfigDict

from app.models.enums import Sex


class PatientIdentification(BaseModel):
    full_name: str
    dob: date
    sex: Sex
    phone: str | None = None
    gov_id_type: str | None = None
    gov_id_ref: str | None = None


class PatientRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    dob: date
    sex: Sex
    phone: str | None
    gov_id_type: str | None
    gov_id_ref: str | None