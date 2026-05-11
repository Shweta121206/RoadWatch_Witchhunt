from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Pothole
from ..schemas import AnalyticsSummary


router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def get_summary(db: Session = Depends(get_db)) -> AnalyticsSummary:
    total = db.scalar(select(func.count()).select_from(Pothole)) or 0
    fixed = db.scalar(select(func.count()).select_from(Pothole).where(Pothole.status == "fixed")) or 0
    critical = db.scalar(select(func.count()).select_from(Pothole).where(Pothole.severity == "critical")) or 0

    return AnalyticsSummary(
        totalPotholes=total,
        openPotholes=total - fixed,
        fixedPotholes=fixed,
        criticalPotholes=critical,
    )

