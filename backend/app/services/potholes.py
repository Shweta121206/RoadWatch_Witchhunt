from datetime import datetime
from math import asin, cos, radians, sin, sqrt

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..models import Pothole, VerificationEvent
from ..schemas import DetectionCreate, PotholeOut, VerificationEventOut, format_datetime


DEDUPLICATION_RADIUS_METERS = 15


def calculate_severity(mask_area_ratio: float, confidence: float) -> str:
    score = max(mask_area_ratio, confidence * 0.35)
    if score >= 0.3:
        return "critical"
    if score >= 0.18:
        return "high"
    if score >= 0.08:
        return "medium"
    return "low"


def distance_meters(lat_a: float, lng_a: float, lat_b: float, lng_b: float) -> float:
    earth_radius = 6_371_000
    delta_lat = radians(lat_b - lat_a)
    delta_lng = radians(lng_b - lng_a)
    a = (
        sin(delta_lat / 2) ** 2
        + cos(radians(lat_a)) * cos(radians(lat_b)) * sin(delta_lng / 2) ** 2
    )
    return 2 * earth_radius * asin(sqrt(a))


def pothole_to_out(pothole: Pothole) -> PotholeOut:
    events = [
        VerificationEventOut(
            id=f"VH-{event.id}",
            actor=event.actor,
            action=event.action,
            timestamp=format_datetime(event.timestamp),
            note=event.note,
        )
        for event in pothole.events
    ]

    return PotholeOut(
        id=pothole.id,
        title=pothole.title,
        location=pothole.location,
        latitude=pothole.latitude,
        longitude=pothole.longitude,
        status=pothole.status,  # type: ignore[arg-type]
        severity=pothole.severity,  # type: ignore[arg-type]
        confidence=pothole.confidence,
        detectedAt=format_datetime(pothole.detected_at),
        verification=pothole.verification,
        image=pothole.image,
        gallery=[pothole.image],
        verificationHistory=events,
    )


def list_potholes(db: Session) -> list[PotholeOut]:
    potholes = db.scalars(
        select(Pothole)
        .options(selectinload(Pothole.events))
        .order_by(Pothole.detected_at.desc())
    ).all()
    return [pothole_to_out(pothole) for pothole in potholes]


def get_pothole(db: Session, pothole_id: str) -> Pothole | None:
    return db.scalars(
        select(Pothole)
        .options(selectinload(Pothole.events))
        .where(Pothole.id == pothole_id)
    ).first()


def find_nearby_open_pothole(db: Session, latitude: float, longitude: float) -> Pothole | None:
    potholes = db.scalars(
        select(Pothole)
        .options(selectinload(Pothole.events))
        .where(Pothole.status != "fixed")
        .where(Pothole.status != "false_positive")
    ).all()

    for pothole in potholes:
        if distance_meters(latitude, longitude, pothole.latitude, pothole.longitude) <= DEDUPLICATION_RADIUS_METERS:
            return pothole
    return None


def create_or_update_detection(db: Session, payload: DetectionCreate) -> Pothole:
    now = datetime.utcnow()
    severity = calculate_severity(payload.maskAreaRatio, payload.confidence)
    existing = find_nearby_open_pothole(db, payload.latitude, payload.longitude)

    if existing:
        existing.confidence = max(existing.confidence, payload.confidence)
        existing.mask_area_ratio = max(existing.mask_area_ratio, payload.maskAreaRatio)
        existing.severity = max_severity(existing.severity, severity)
        existing.verification += 1
        existing.detected_at = now
        if payload.image:
            existing.image = payload.image
        if existing.status == "fixed":
            existing.status = "reopened"
        existing.events.append(
            VerificationEvent(
                actor="RoadWatch AI",
                action="Duplicate detection merged",
                note=f"New detection within {DEDUPLICATION_RADIUS_METERS}m radius.",
                timestamp=now,
            )
        )
        db.commit()
        db.refresh(existing)
        return existing

    pothole_id = next_pothole_id(db)
    pothole = Pothole(
        id=pothole_id,
        title=payload.title or f"Pothole near {payload.latitude:.5f}, {payload.longitude:.5f}",
        location=f"{payload.latitude:.4f}, {payload.longitude:.4f}",
        latitude=payload.latitude,
        longitude=payload.longitude,
        status="detected",
        severity=severity,
        confidence=payload.confidence,
        mask_area_ratio=payload.maskAreaRatio,
        image=payload.image or "/pothole-images/Tnagar (1).png",
        detected_at=now,
        verification=1,
        events=[
            VerificationEvent(
                actor="RoadWatch AI",
                action="Detection created",
                note=f"YOLO confidence {payload.confidence:.0%}, severity {severity}.",
                timestamp=now,
            )
        ],
    )
    db.add(pothole)
    db.commit()
    db.refresh(pothole)
    return get_pothole(db, pothole.id) or pothole


def max_severity(current: str, incoming: str) -> str:
    rank = {"low": 0, "medium": 1, "high": 2, "critical": 3}
    return current if rank[current] >= rank[incoming] else incoming


def next_pothole_id(db: Session) -> str:
    count = db.scalar(select(Pothole).order_by(Pothole.id.desc()).limit(1))
    if not count:
        return "PH-1001"

    try:
        number = int(count.id.split("-")[-1])
    except ValueError:
        number = 1000
    return f"PH-{number + 1}"

