import uuid
from typing import Any

from sqlalchemy import ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class CaseTaking(Base, TimestampMixin):
    __tablename__ = "case_takings"

    id: Mapped[int] = mapped_column(primary_key=True)
    case_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("cases.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    chief_complaint: Mapped[str | None] = mapped_column(Text)
    history: Mapped[str | None] = mapped_column(Text)
    symptoms: Mapped[dict[str, Any] | None] = mapped_column(JSONB)
    vitals: Mapped[dict[str, Any] | None] = mapped_column(JSONB)

    case: Mapped["Case"] = relationship(back_populates="case_taking")
