import { potholesData } from "../data/mockData";
import type { AnalyticsSummary, Pothole } from "../types";

const readJson = async <T>(path: string, fallback: T): Promise<T> => {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json() as T;
  } catch {
    return fallback;
  }
};

export const getPotholes = async () => (
  readJson<Pothole[]>("/api/v1/potholes", potholesData)
);

export const getPotholeById = async (id: string) => {
  const potholes = await getPotholes();
  return potholes.find((pothole) => pothole.id === id) ?? null;
};

export const createDetection = async (payload: Partial<Pothole>) => {
  const res = await fetch("/api/v1/detections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Unable to create detection");
  return res.json();
};

export const analyzeDetectionImage = async (payload: {
  image: File;
  latitude: number;
  longitude: number;
  title?: string;
}) => {
  const formData = new FormData();
  formData.append("image", payload.image);
  formData.append("latitude", String(payload.latitude));
  formData.append("longitude", String(payload.longitude));
  if (payload.title) formData.append("title", payload.title);

  const res = await fetch("/api/v1/detections/analyze", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail ?? "Unable to analyze detection image");
  }
  return res.json();
};

export const getAnalyticsSummary = async () => {
  const fallback: AnalyticsSummary = {
    totalPotholes: potholesData.length,
    openPotholes: potholesData.filter((pothole) => pothole.status !== "fixed").length,
    fixedPotholes: potholesData.filter((pothole) => pothole.status === "fixed").length,
    criticalPotholes: potholesData.filter((pothole) => pothole.severity === "critical").length,
  };

  return readJson<AnalyticsSummary>("/api/v1/analytics/summary", fallback);
};
