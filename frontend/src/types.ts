export type Severity = "low" | "medium" | "high" | "critical";
export type Status = "detected" | "in_progress" | "fixed" | "reopened" | "false_positive";

export interface Pothole {
  id: string;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  status: Status;
  severity: Severity;
  confidence: number;
  detectedAt: string;
  verification: number;
  image: string;
  gallery?: string[];
  verificationHistory?: VerificationEvent[];
}

export interface VerificationEvent {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  note: string;
}

export interface AnalyticsSummary {
  totalPotholes: number;
  openPotholes: number;
  fixedPotholes: number;
  criticalPotholes: number;
}

export interface Trip {
  id: string;
  name: string;
  status: "active" | "completed";
  startedAt: string;
  endedAt: string | null;
  route: string;
  detections: number;
  coordinates: [number, number][];
}

export interface Vehicle {
  name: string;
  area: string;
  registrationNumber: string;
  cameraId: string;
  routeCovered: string;
}
