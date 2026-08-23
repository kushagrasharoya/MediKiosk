from datetime import date

from sqlalchemy import Date, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin
from app.models.enums import Sex


class Patient(Base, TimestampMixin):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str | None] = mapped_column(String(255))
    dob: Mapped[date | None] = mapped_column(Date)
    sex: Mapped[Sex | None] = mapped_column()
    phone: Mapped[str | None] = mapped_column(String(20), index=True)
    gov_id_type: Mapped[str | None] = mapped_column(String(50))
    gov_id_ref: Mapped[str | None] = mapped_column(String(255))

    cases: Mapped[list["Case"]] = relationship(
        back_populates="patient", cascade="all, delete-orphan"
    )