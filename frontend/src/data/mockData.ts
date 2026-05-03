import type { Pothole, Trip, Vehicle } from "../types";

export const credentials = {
  email: "admin@roadwatch.com",
  password: "RoadWatch123",
};

export const summaryCards = [
  { title: "Total Detections", value: "12,450", caption: "15.8% ↑", color: "#81E6D9" },
  { title: "Active Potholes", value: "363", caption: "34.0% ↓", color: "#F6AD55" },
  { title: "Fixed This Month", value: "9,257", caption: "15.8% ↑ + 143 fixed", color: "#90CDF4" },
  { title: "Open Potholes", value: "24,120", caption: "8.3% ↑", color: "#B794F4" },
];

export const severityDistribution = [
  { label: "Critical", value: 28, color: "#F56565" },
  { label: "High", value: 34, color: "#ED8936" },
  { label: "Medium", value: 22, color: "#ECC94B" },
  { label: "Low", value: 16, color: "#48BB78" },
];

export const timelineData = [
  { date: "Mon", value: 24 },
  { date: "Tue", value: 32 },
  { date: "Wed", value: 28 },
  { date: "Thu", value: 35 },
  { date: "Fri", value: 31 },
  { date: "Sat", value: 38 },
  { date: "Sun", value: 44 },
];

export const potholesData: Pothole[] = [
  {
    id: "PH-1024",
    title: "T. Nagar Main Road / Anna Salai",
    location: "13.0827, 80.2707",
    latitude: 13.0827,
    longitude: 80.2707,
    status: "detected",
    severity: "critical",
    confidence: 0.92,
    detectedAt: "2026-05-01 09:22",
    verification: 1,
    image: "/pothole-images/Tnagar (1).png",
    gallery: [
      "/pothole-images/Tnagar (2).png",
      "/pothole-images/Tnagar (3).png",
    ],
    verificationHistory: [
      { id: "VH-1", actor: "AI Camera CAM-MAA-001", action: "Detection created", timestamp: "2026-05-01 09:22", note: "Critical road-surface damage detected." },
      { id: "VH-2", actor: "Field verifier", action: "Image reviewed", timestamp: "2026-05-01 09:41", note: "Repair crew dispatch recommended." },
    ],
  },
  {
    id: "PH-1031",
    title: "Mount Road / Nungambakkam",
    location: "13.0850, 80.2780",
    latitude: 13.085,
    longitude: 80.278,
    status: "reopened",
    severity: "high",
    confidence: 0.84,
    detectedAt: "2026-05-01 10:10",
    verification: 2,
    image: "/pothole-images/TMountroad (1).png",
    gallery: [
      "/pothole-images/TMountroad (2).png",
      "/pothole-images/TMountroad (3).png",
    ],
    verificationHistory: [
      { id: "VH-3", actor: "AI Camera CAM-MAA-002", action: "Detection created", timestamp: "2026-05-01 10:10", note: "High severity confidence above threshold." },
      { id: "VH-4", actor: "Road repair team", action: "Case reopened", timestamp: "2026-05-01 12:05", note: "Surface failed after temporary patch." },
    ],
  },
  {
    id: "PH-1046",
    title: "Adyar Bridge / Gandhi Nagar",
    location: "13.0011, 80.2565",
    latitude: 13.0011,
    longitude: 80.2565,
    status: "in_progress",
    severity: "medium",
    confidence: 0.77,
    detectedAt: "2026-05-01 11:40",
    verification: 1,
    image: "/pothole-images/TAdyar (1).png",
    gallery: [
      "/pothole-images/TAdyar (2).png",
      "/pothole-images/TAdyar (3).png",
    ],
    verificationHistory: [
      { id: "VH-5", actor: "AI Camera CAM-MAA-003", action: "Detection created", timestamp: "2026-05-01 11:40", note: "Repair job linked to Adyar sector crew." },
    ],
  },
  {
    id: "PH-1052",
    title: "Velachery Main Road / Taramani",
    location: "12.9791, 80.2442",
    latitude: 12.9791,
    longitude: 80.2442,
    status: "fixed",
    severity: "low",
    confidence: 0.61,
    detectedAt: "2026-04-30 16:20",
    verification: 3,
    image: "/pothole-images/TVelachery (1).png",
    gallery: [
      "/pothole-images/TVelachery (2).png",
      "/pothole-images/TVelachery (3).png",
    ],
    verificationHistory: [
      { id: "VH-6", actor: "AI Camera CAM-MAA-003", action: "Detection created", timestamp: "2026-04-30 16:20", note: "Low severity shoulder-side defect." },
      { id: "VH-7", actor: "Supervisor", action: "Marked fixed", timestamp: "2026-05-01 15:25", note: "Repair photo accepted." },
    ],
  },
];

export const tripsData: Trip[] = [
  {
    id: "TR-4801",
    name: "T. Nagar Route",
    status: "active",
    startedAt: "2026-05-02 07:05",
    endedAt: null,
    route: "5.2 km, 18 stops",
    detections: 7,
    coordinates: [
      [13.0418, 80.2341],
      [13.0508, 80.2415],
      [13.0611, 80.2487],
      [13.0712, 80.261],
      [13.0827, 80.2707],
    ],
  },
  {
    id: "TR-4798",
    name: "Adyar Sector",
    status: "completed",
    startedAt: "2026-05-01 08:10",
    endedAt: "2026-05-01 11:55",
    route: "6.8 km, 12 stops",
    detections: 10,
    coordinates: [
      [13.0067, 80.2508],
      [13.0011, 80.2565],
      [12.9954, 80.2613],
      [12.9895, 80.2493],
      [12.9791, 80.2442],
    ],
  },
];

export const vehiclesData: Vehicle[] = [
  {
    name: "MAA Patrol 01",
    area: "T. Nagar",
    registrationNumber: "TN 01 A 2378",
    cameraId: "CAM-MAA-001",
    routeCovered: "T. Nagar Main Road to Anna Salai",
  },
  {
    name: "MAA Patrol 02",
    area: "Adyar",
    registrationNumber: "TN 07 AB 1482",
    cameraId: "CAM-MAA-002",
    routeCovered: "Adyar Bridge to Gandhi Nagar",
  },
  {
    name: "MAA Patrol 03",
    area: "Velachery",
    registrationNumber: "TN 09 ABC 6204",
    cameraId: "CAM-MAA-003",
    routeCovered: "Velachery Main Road to Taramani",
  },
];
