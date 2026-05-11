from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Pothole(Base):
    __tablename__ = "potholes"

    id: Mapped[str] = mapped_column(String(24), primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    location: Mapped[str] = mapped_column(String(80))
    latitude: Mapped[float] = mapped_column(Float, index=True)
    longitude: Mapped[float] = mapped_column(Float, index=True)
    status: Mapped[str] = mapped_column(String(32), default="detected", index=True)
    severity: Mapped[str] = mapped_column(String(32), default="medium", index=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    mask_area_ratio: Mapped[float] = mapped_column(Float, default=0.0)
    image: Mapped[str] = mapped_column(String(500))
    detected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    verification: Mapped[int] = mapped_column(Integer, default=1)

    events: Mapped[list["VerificationEvent"]] = relationship(
        back_populates="pothole",
        cascade="all, delete-orphan",
        order_by="VerificationEvent.timestamp",
    )


class VerificationEvent(Base):
    __tablename__ = "verification_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pothole_id: Mapped[str] = mapped_column(ForeignKey("potholes.id"), index=True)
    actor: Mapped[str] = mapped_column(String(120))
    action: Mapped[str] = mapped_column(String(120))
    note: Mapped[str] = mapped_column(Text)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    pothole: Mapped[Pothole] = relationship(back_populates="events")

