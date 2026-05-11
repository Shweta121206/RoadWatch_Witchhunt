from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


Severity = Literal["low", "medium", "high", "critical"]
Status = Literal["detected", "in_progress", "fixed", "reopened", "false_positive"]


class VerificationEventOut(BaseModel):
    id: str
    actor: str
    action: str
    timestamp: str
    note: str


class PotholeOut(BaseModel):
    id: str
    title: str
    location: str
    latitude: float
    longitude: float
    status: Status
    severity: Severity
    confidence: float
    detectedAt: str
    verification: int
    image: str
    gallery: list[str] = Field(default_factory=list)
    verificationHistory: list[VerificationEventOut] = Field(default_factory=list)


class DetectionCreate(BaseModel):
    latitude: float
    longitude: float
    confidence: float = Field(ge=0, le=1)
    maskAreaRatio: float = Field(default=0, ge=0, le=1)
    image: str | None = None
    title: str | None = None


class DetectionAnalyzeOut(BaseModel):
    potholes: list[PotholeOut]
    inferenceMs: int
    modelPath: str


class AnalyticsSummary(BaseModel):
    totalPotholes: int
    openPotholes: int
    fixedPotholes: int
    criticalPotholes: int


class PotholeStatusUpdate(BaseModel):
    status: Status


def format_datetime(value: datetime) -> str:
    return value.strftime("%Y-%m-%d %H:%M")

