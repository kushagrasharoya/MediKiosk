import enum


class CaseStatus(str, enum.Enum):
    draft = "draft"
    submitted = "submitted"
    verified = "verified"


class Sex(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"


class ConsentMethod(str, enum.Enum):
    digital = "digital"
    verbal = "verbal"
    written = "written"


class DoctorRole(str, enum.Enum):
    doctor = "doctor"
    admin = "admin"
