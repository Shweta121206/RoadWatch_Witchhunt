# RoadWatch - Implementation Plan

**Hackathon**: Witch Hunt
**Topic**: Smart City
**Project**: AI-Powered Pothole Detection & Municipal Accountability System

---

## Project Summary

Mount pothole detection AI on garbage trucks to automatically detect, report, and verify road repairs. The system creates municipal accountability by re-verifying if potholes were actually fixed on return trips.

---

## Phase 1: Model Finalization & Validation

### 1.1 Complete Model Training
- [ ] Finish YOLO26l-seg training (150 epochs)
- [ ] Run comparison script to evaluate YOLOv8n vs YOLO26l
- [ ] Select best model based on accuracy vs speed tradeoff
- [ ] Export final model to ONNX for edge deployment
- [ ] Test inference speed on target hardware (laptop/phone)

### 1.2 Model Validation
- [ ] Test model on sample pothole images
- [ ] Verify segmentation mask quality
- [ ] Calculate severity estimation from mask area ratios
- [ ] Test confidence thresholds (target: 0.30-0.35)
- [ ] Validate blur detection (Laplacian variance)

**Deliverable**: `best.pt` and `best.onnx` model files with performance metrics

---

## Phase 2: Backend API Development

### 2.1 Project Setup
- [ ] Create `backend/` directory structure
- [ ] Initialize FastAPI project with Poetry/pip
- [ ] Set up PostgreSQL + PostGIS OR SQLite for demo
- [ ] Configure SQLAlchemy 2.0 with async support
- [ ] Create database models (Pothole, Trip, Vehicle)
- [ ] Set up Alembic for migrations

### 2.2 Core API Endpoints

**Detection API**:
- [ ] `POST /api/v1/detections` - Submit new pothole detection
  - Accept: image, GPS coords, confidence, mask area
  - Return: pothole_id, status, severity
- [ ] Implement GPS-based deduplication (15m radius)
- [ ] Calculate severity from mask area ratio
- [ ] Store pothole with GPS point (PostGIS geometry)

**Pothole Management**:
- [ ] `GET /api/v1/potholes` - List all potholes (with filters)
- [ ] `GET /api/v1/potholes/{id}` - Get pothole details
- [ ] `PATCH /api/v1/potholes/{id}` - Update status/severity
- [ ] `DELETE /api/v1/potholes/{id}` - Mark as false positive

**Re-verification**:
- [ ] `GET /api/v1/verification-zones` - Get nearby open potholes
- [ ] `POST /api/v1/verify` - Submit verification result
- [ ] Implement 2-pass rule before marking as fixed
- [ ] Re-open potholes if detected after "fixed"

**Trip Management**:
- [ ] `POST /api/v1/trips/start` - Start new trip
- [ ] `POST /api/v1/trips/end` - End trip
- [ ] `GET /api/v1/trips` - List trips
- [ ] Track vehicle routes and detection counts

**Analytics**:
- [ ] `GET /api/v1/analytics/summary` - Overall stats
- [ ] `GET /api/v1/analytics/heatmap` - GPS heatmap data
- [ ] `GET /api/v1/analytics/severity-distribution`
- [ ] `GET /api/v1/analytics/timeline` - Detections over time

### 2.3 Database Schema
```sql
Potholes:
  - id, lat, lng (PostGIS Point)
  - status (detected, reported, in_progress, fixed)
  - severity (low, medium, high, critical)
  - confidence, mask_area_ratio
  - image_path, detected_at
  - verification_count, last_verified_at

Trips:
  - id, vehicle_id, started_at, ended_at
  - route (LineString), detection_count

Vehicles:
  - id, name, type (garbage_truck)
```

### 2.4 Testing
- [ ] Unit tests for deduplication logic
- [ ] Test GPS proximity matching (15m radius)
- [ ] Test re-verification state machine
- [ ] API integration tests with pytest

**Deliverable**: Working FastAPI backend with all endpoints

---

## Phase 3: Edge Detection System

### 3.1 Detection Script Setup
- [ ] Create `edge/detector.py`
- [ ] Load YOLO model (ONNX or PyTorch)
- [ ] Set up OpenCV camera capture (webcam/IP camera)
- [ ] Implement GPS simulation OR integrate real GPS
- [ ] Configure inference parameters (conf=0.30, imgsz=640)

### 3.2 Core Detection Logic
- [ ] Frame capture loop (process every Nth frame)
- [ ] Blur detection (Laplacian variance check)
- [ ] Run YOLO inference on frame
- [ ] Calculate mask area ratio for severity
- [ ] Extract bounding box and confidence

### 3.3 GPS & Reporting
- [ ] Get current GPS coordinates (simulated or real)
- [ ] Implement 30-second GPS cooldown
- [ ] Send detection to backend API (`POST /detections`)
- [ ] Handle offline queue (retry on reconnect)
- [ ] Save detection images locally

### 3.4 Re-verification Mode
- [ ] Fetch nearby verification zones from API
- [ ] Check if previously detected potholes are still present
- [ ] Submit verification results to backend
- [ ] Display verification status on screen

### 3.5 Configuration
- [ ] Config file for API endpoint, GPS source, thresholds
- [ ] Command-line args for demo vs production mode
- [ ] Logging setup for debugging

**Deliverable**: `edge/detector.py` running on laptop with webcam

---

## Phase 4: Frontend Dashboard

### 4.1 Project Setup
- [ ] Create `frontend/` directory
- [ ] Initialize React + Vite + TypeScript
- [ ] Install dependencies (Tailwind, Leaflet, Recharts, axios)
- [ ] Set up routing (React Router)
- [ ] Configure API client with axios

### 4.2 Map Dashboard (Priority P0)
- [ ] Create interactive Leaflet map component
- [ ] Display pothole markers with color-coded severity:
  - Red: critical
  - Orange: high
  - Yellow: medium
  - Green: low (or fixed)
- [ ] Cluster markers for better performance
- [ ] Marker click shows pothole details popup:
  - Image, GPS coords, confidence, severity
  - Status, detected date, verification count
- [ ] Filter controls:
  - By severity (low/medium/high/critical)
  - By status (detected/reported/in_progress/fixed)
  - By date range
- [ ] Auto-refresh every 5 seconds

### 4.3 Analytics Dashboard (Priority P1)
- [ ] Summary cards:
  - Total potholes detected
  - Open potholes
  - Fixed potholes
  - Critical severity count
- [ ] Heatmap overlay on map (leaflet.heat)
- [ ] Severity distribution pie chart (Recharts)
- [ ] Detections timeline chart (last 7 days)
- [ ] Ward-wise statistics table

### 4.4 Trip Management (Priority P1)
- [ ] Start/End trip buttons
- [ ] Current trip status display
- [ ] Trip history list
- [ ] Trip route visualization on map

### 4.5 Pothole Management
- [ ] Pothole list view (table with sorting/filtering)
- [ ] Pothole detail page
- [ ] Manual status update controls
- [ ] "Mark as False Positive" button
- [ ] Image gallery view

**Deliverable**: React dashboard accessible at `http://localhost:5173`

---

## Phase 5: Integration & Testing

### 5.1 End-to-End Testing
- [ ] Test full flow: Detection → API → Dashboard display
- [ ] Test deduplication with multiple detections in same area
- [ ] Test re-verification workflow (2 passes)
- [ ] Test offline queue and reconnection
- [ ] Test dashboard auto-refresh

### 5.2 Demo Data Preparation
- [ ] Seed database with 30-50 sample potholes
- [ ] Create varied severity levels and statuses
- [ ] Prepare pothole images for live demo
- [ ] Set up simulated GPS route for demo

### 5.3 Performance Optimization
- [ ] Optimize model inference speed (target <200ms)
- [ ] Test API response times (<500ms)
- [ ] Optimize database queries (add indexes)
- [ ] Reduce frontend bundle size

**Deliverable**: Fully working end-to-end system

---

## Phase 6: Docker & Deployment (Optional)

### 6.1 Containerization
- [ ] Create `docker-compose.yml`
- [ ] Dockerfile for backend (FastAPI)
- [ ] Dockerfile for frontend (Nginx)
- [ ] PostgreSQL service in docker-compose
- [ ] Volume mounts for data persistence

### 6.2 Deployment
- [ ] Deploy to cloud (Render/Railway/Fly.io) OR run locally
- [ ] Set up environment variables
- [ ] Test deployed version

**Deliverable**: Dockerized application (if time permits)

---

## Phase 7: Demo Preparation

### 7.1 Demo Script
- [ ] Prepare 3-minute demo walkthrough
- [ ] Script narrative:
  1. Problem statement (bad roads, no accountability)
  2. Solution (garbage truck-mounted AI)
  3. Live detection demo (webcam + pothole image)
  4. Dashboard visualization
  5. Re-verification demo (show lifecycle)
  6. Impact (accountability + cost savings)

### 7.2 Demo Assets
- [ ] Print/display pothole images for webcam detection
- [ ] Prepare slide deck (optional) with architecture diagram
- [ ] Record video demo (backup if live demo fails)
- [ ] Prepare metrics slide (mAP, inference speed, coverage)

### 7.3 Presentation Points
- [ ] Why garbage trucks? (existing infrastructure, regular routes)
- [ ] Unique feature: Re-verification (accountability loop)
- [ ] Tech: YOLO segmentation, GPS dedup, FastAPI
- [ ] Real-world impact: Save municipal budget, citizen safety

**Deliverable**: Polished demo ready for judges

---

## Technical Stack Summary

| Component | Technology |
|-----------|-----------|
| Model | YOLO26l-seg or YOLOv8n-seg (TBD after comparison) |
| Edge | Python + OpenCV + ultralytics |
| Backend | FastAPI + SQLAlchemy + asyncpg |
| Database | PostgreSQL + PostGIS (or SQLite for demo) |
| Frontend | React + Vite + TypeScript + Tailwind |
| Maps | react-leaflet + leaflet.heat |
| Charts | Recharts |
| Deployment | Docker Compose (optional) |

---

## Critical Path (Minimum Viable Demo)

**Must-Have for Demo** (Priority P0):
1. Trained YOLO model (✓ in progress)
2. Edge detector script running on webcam
3. Backend API with detection endpoint
4. Database storing potholes
5. Map dashboard showing detections
6. Live demo: Point webcam at pothole image → shows on dashboard

**Nice-to-Have** (Priority P1):
- Re-verification workflow
- Analytics dashboard
- Trip management
- Multiple status lifecycle

**Optional** (Priority P2):
- Docker deployment
- Offline queue
- Advanced analytics

---

## Timeline Estimation (Adjust to Hackathon Duration)

Assuming 3-day hackathon:

**Day 1**:
- Morning: Finalize model training & selection
- Afternoon: Backend API core endpoints
- Evening: Database setup + detection endpoint working

**Day 2**:
- Morning: Edge detector script (webcam integration)
- Afternoon: Frontend map dashboard
- Evening: End-to-end integration testing

**Day 3**:
- Morning: Analytics dashboard + re-verification
- Afternoon: Demo prep + bug fixes
- Evening: Final testing + presentation prep

---

## Success Metrics

- Model accuracy: >85% mAP@50
- Inference speed: <200ms on laptop
- API response: <500ms
- Dashboard loads in <2s
- Live demo works smoothly

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Model training takes too long | Use pre-trained YOLOv8n from Roboflow |
| GPS hardware unavailable | Use simulated GPS coordinates |
| Database setup issues | Use SQLite instead of PostgreSQL |
| Frontend complexity | Focus on map view only, skip analytics |
| Live demo fails | Have backup video recording |

---

## Next Steps

1. Run `compare_models.py` to select best model
2. Create backend project structure
3. Implement core detection API endpoint
4. Build edge detector script
5. Create basic map dashboard
6. Test end-to-end flow
7. Prepare demo script

---

**Let's build this! 🚀**
