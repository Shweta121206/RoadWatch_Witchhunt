from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Pothole, VerificationEvent


SEED_POTHOLES = [
    {
        "id": "PH-1024",
        "title": "T. Nagar Main Road / Anna Salai",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "status": "detected",
        "severity": "critical",
        "confidence": 0.92,
        "mask_area_ratio": 0.34,
        "image": "/pothole-images/Tnagar (1).png",
        "detected_at": datetime(2026, 5, 1, 9, 22),
    },
    {
        "id": "PH-1031",
        "title": "Mount Road / Nungambakkam",
        "latitude": 13.085,
        "longitude": 80.278,
        "status": "reopened",
        "severity": "high",
        "confidence": 0.84,
        "mask_area_ratio": 0.21,
        "image": "/pothole-images/TMountroad (1).png",
        "detected_at": datetime(2026, 5, 1, 10, 10),
    },
    {
        "id": "PH-1046",
        "title": "Adyar Bridge / Gandhi Nagar",
        "latitude": 13.0011,
        "longitude": 80.2565,
        "status": "in_progress",
        "severity": "medium",
        "confidence": 0.77,
        "mask_area_ratio": 0.12,
        "image": "/pothole-images/TAdyar (1).png",
        "detected_at": datetime(2026, 5, 1, 11, 40),
    },
    {
        "id": "PH-1052",
        "title": "Velachery Main Road / Taramani",
        "latitude": 12.9791,
        "longitude": 80.2442,
        "status": "fixed",
        "severity": "low",
        "confidence": 0.61,
        "mask_area_ratio": 0.04,
        "image": "/pothole-images/TVelachery (1).png",
        "detected_at": datetime(2026, 4, 30, 16, 20),
    },
]


def seed_database(db: Session) -> None:
    has_potholes = db.scalar(select(Pothole.id).limit(1))
    if has_potholes:
        return

    for item in SEED_POTHOLES:
        pothole = Pothole(
            **item,
            location=f"{item['latitude']:.4f}, {item['longitude']:.4f}",
            verification=1,
            events=[
                VerificationEvent(
                    actor="RoadWatch seed data",
                    action="Detection created",
                    note=f"Seeded {item['severity']} pothole for local demo.",
                    timestamp=item["detected_at"],
                )
            ],
        )
        db.add(pothole)

    db.commit()

