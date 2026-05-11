from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from ..config import Settings, get_settings
from ..database import get_db
from ..schemas import DetectionAnalyzeOut, DetectionCreate, PotholeOut
from ..services.detector import analyze_image
from ..services.potholes import create_or_update_detection, pothole_to_out


router = APIRouter(prefix="/api/v1/detections", tags=["detections"])


@router.post("", response_model=PotholeOut)
def create_detection(payload: DetectionCreate, db: Session = Depends(get_db)) -> PotholeOut:
    pothole = create_or_update_detection(db, payload)
    return pothole_to_out(pothole)


@router.post("/analyze", response_model=DetectionAnalyzeOut)
async def analyze_detection(
    image: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    title: str | None = Form(None),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> DetectionAnalyzeOut:
    image_path = await save_upload(image, settings.upload_dir)
    detections, inference_ms = analyze_image(image_path, settings.model_path)

    potholes = []
    for detection in detections:
        payload = DetectionCreate(
            latitude=latitude,
            longitude=longitude,
            confidence=detection.confidence,
            maskAreaRatio=detection.mask_area_ratio,
            image=f"/uploads/{image_path.name}",
            title=title,
        )
        potholes.append(pothole_to_out(create_or_update_detection(db, payload)))

    return DetectionAnalyzeOut(
        potholes=potholes,
        inferenceMs=inference_ms,
        modelPath=str(settings.model_path),
    )


async def save_upload(upload: UploadFile, upload_dir: Path) -> Path:
    suffix = Path(upload.filename or "").suffix.lower() or ".jpg"
    destination = upload_dir / f"{uuid4().hex}{suffix}"
    content = await upload.read()
    destination.write_bytes(content)
    return destination

