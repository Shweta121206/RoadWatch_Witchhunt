# RoadWatch Backend

FastAPI backend for the local hackathon demo. It stores potholes in SQLite and can run a local YOLO model from the analyze endpoint.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Place the trained model at:

```text
backend/model/best.pt
```

Or point to another local file:

```bash
ROADWATCH_MODEL_PATH=/absolute/path/to/best.pt uvicorn app.main:app --reload
```

Install YOLO runtime dependencies only when you are ready to run local model inference:

```bash
pip install -r requirements-yolo.txt
```

## Run

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

The API runs on `http://localhost:8000`.

## Demo Endpoints

- `GET /health`
- `GET /api/v1/potholes`
- `GET /api/v1/potholes/{id}`
- `PATCH /api/v1/potholes/{id}`
- `POST /api/v1/detections`
- `POST /api/v1/detections/analyze`
- `GET /api/v1/analytics/summary`
