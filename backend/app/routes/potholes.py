from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import VerificationEvent
from ..schemas import PotholeOut, PotholeStatusUpdate
from ..services.potholes import get_pothole, list_potholes, pothole_to_out


router = APIRouter(prefix="/api/v1/potholes", tags=["potholes"])


@router.get("", response_model=list[PotholeOut])
def get_all_potholes(db: Session = Depends(get_db)) -> list[PotholeOut]:
    return list_potholes(db)


@router.get("/{pothole_id}", response_model=PotholeOut)
def get_single_pothole(pothole_id: str, db: Session = Depends(get_db)) -> PotholeOut:
    pothole = get_pothole(db, pothole_id)
    if not pothole:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pothole not found")
    return pothole_to_out(pothole)


@router.patch("/{pothole_id}", response_model=PotholeOut)
def update_pothole_status(
    pothole_id: str,
    payload: PotholeStatusUpdate,
    db: Session = Depends(get_db),
) -> PotholeOut:
    pothole = get_pothole(db, pothole_id)
    if not pothole:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pothole not found")

    pothole.status = payload.status
    pothole.events.append(
        VerificationEvent(
            actor="Dashboard operator",
            action="Status updated",
            note=f"Status changed to {payload.status}.",
        )
    )
    db.commit()
    db.refresh(pothole)
    return pothole_to_out(get_pothole(db, pothole_id) or pothole)

