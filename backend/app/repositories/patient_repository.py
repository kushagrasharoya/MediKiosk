from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.schemas.patient import PatientIdentification


class PatientRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_placeholder(self) -> Patient:
        patient = Patient(
            full_name=None,
            dob=None,
            sex=None,
        )
        self.db.add(patient)
        self.db.flush()
        return patient

    def create(self, data: PatientIdentification) -> Patient:
        patient = Patient(
            full_name=data.full_name,
            dob=data.dob,
            sex=data.sex,
            phone=data.phone,
            gov_id_type=data.gov_id_type,
            gov_id_ref=data.gov_id_ref,
        )
        self.db.add(patient)
        self.db.flush()
        return patient

    def get(self, patient_id: int) -> Patient | None:
        return self.db.get(Patient, patient_id)

    def update_identification(
        self,
        patient: Patient,
        data: PatientIdentification,
    ) -> Patient:
        patient.full_name = data.full_name
        patient.dob = data.dob
        patient.sex = data.sex
        patient.phone = data.phone
        patient.gov_id_type = data.gov_id_type
        patient.gov_id_ref = data.gov_id_ref
        self.db.flush()
        return patient