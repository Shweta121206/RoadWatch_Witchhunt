import time
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

from fastapi import HTTPException, status


@dataclass
class DetectionResult:
    confidence: float
    mask_area_ratio: float


@lru_cache(maxsize=1)
def load_model(model_path: str) -> Any:
    path = Path(model_path)
    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"YOLO model not found at {path}. Set ROADWATCH_MODEL_PATH or place best.pt there.",
        )

    try:
        from ultralytics import YOLO
    except ImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ultralytics is not installed. Run pip install -r backend/requirements.txt.",
        ) from exc

    return YOLO(str(path))


def analyze_image(image_path: Path, model_path: Path) -> tuple[list[DetectionResult], int]:
    started = time.perf_counter()
    model = load_model(str(model_path))
    results = model(str(image_path), conf=0.3, imgsz=640, verbose=False)
    inference_ms = int((time.perf_counter() - started) * 1000)

    detections: list[DetectionResult] = []
    if not results:
        return detections, inference_ms

    result = results[0]
    boxes = getattr(result, "boxes", None)
    masks = getattr(result, "masks", None)

    if boxes is None:
        return detections, inference_ms

    confidences = boxes.conf.tolist() if boxes.conf is not None else []
    image_area = max(1, result.orig_shape[0] * result.orig_shape[1])

    for index, confidence in enumerate(confidences):
        mask_area_ratio = 0.0
        if masks is not None and masks.data is not None and index < len(masks.data):
            mask_area_ratio = float(masks.data[index].sum().item()) / image_area
        elif boxes.xyxy is not None and index < len(boxes.xyxy):
            x1, y1, x2, y2 = boxes.xyxy[index].tolist()
            mask_area_ratio = max(0.0, ((x2 - x1) * (y2 - y1)) / image_area)

        detections.append(
            DetectionResult(
                confidence=float(confidence),
                mask_area_ratio=min(mask_area_ratio, 1.0),
            )
        )

    return detections, inference_ms

