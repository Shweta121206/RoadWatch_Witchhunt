export type Severity = "low" | "medium" | "high" | "critical";
export type Status = "detected" | "reported" | "in_progress" | "fixed";

export interface Pothole {
  id: string;
  title: string;
  location: string;
  status: Status;
  severity: Severity;
  confidence: number;
  detectedAt: string;
  verification: number;
  image: string;
}

export interface Trip {
  id: string;
  name: string;
  status: "active" | "completed";
  startedAt: string;
  endedAt: string | null;
  route: string;
  detections: number;
}

export interface Vehicle {
  name: string;
  area: string;
  registrationNumber: string;
  cameraId: string;
  routeCovered: string;
}
