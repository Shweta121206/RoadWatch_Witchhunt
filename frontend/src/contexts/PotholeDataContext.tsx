import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { potholesData } from "../data/mockData";
import type { AnalyticsSummary, Pothole } from "../types";

type Coordinate = {
  latitude: number;
  longitude: number;
};

interface UploadPayload {
  coordinates: unknown;
  images: File[];
}

interface PotholeDataContextType {
  potholes: Pothole[];
  analyticsSummary: AnalyticsSummary;
  isDatasetUploaded: boolean;
  uploadDataset: (payload: UploadPayload) => void;
  resetDataset: () => void;
}

const PotholeDataContext = createContext<PotholeDataContextType | undefined>(undefined);

const isValidCoordinate = (latitude: number, longitude: number) => (
  Number.isFinite(latitude)
  && Number.isFinite(longitude)
  && latitude >= -90
  && latitude <= 90
  && longitude >= -180
  && longitude <= 180
);

const collectCoordinates = (value: unknown): Coordinate[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    if (
      value.length >= 2
      && typeof value[0] === "number"
      && typeof value[1] === "number"
      && isValidCoordinate(value[0], value[1])
    ) {
      return [{ latitude: value[0], longitude: value[1] }];
    }

    return value.flatMap((item) => collectCoordinates(item));
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const latitude = record.latitude ?? record.lat;
    const longitude = record.longitude ?? record.lng ?? record.lon;

    if (typeof latitude === "number" && typeof longitude === "number" && isValidCoordinate(latitude, longitude)) {
      return [{ latitude, longitude }];
    }

    return Object.values(record).flatMap((item) => collectCoordinates(item));
  }

  return [];
};

const createUploadedPotholes = (coordinates: Coordinate[], images: File[]): Pothole[] => {
  const imageUrls = images.map((image) => URL.createObjectURL(image));

  return coordinates.slice(0, 200).map((coordinate, index) => {
    const template = potholesData[index % potholesData.length];
    const image = imageUrls[index % imageUrls.length] ?? template.image;
    return {
      ...template,
      id: `PH-UP-${String(index + 1).padStart(4, "0")}`,
      title: template.title,
      location: `${coordinate.latitude.toFixed(5)}, ${coordinate.longitude.toFixed(5)}`,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      image,
      gallery: undefined,
    };
  });
};

export const PotholeDataProvider = ({ children }: { children: ReactNode }) => {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [isDatasetUploaded, setIsDatasetUploaded] = useState(false);

  const analyticsSummary = useMemo<AnalyticsSummary>(() => ({
    totalPotholes: potholes.length,
    openPotholes: potholes.filter((pothole) => pothole.status !== "fixed").length,
    fixedPotholes: potholes.filter((pothole) => pothole.status === "fixed").length,
    criticalPotholes: potholes.filter((pothole) => pothole.severity === "critical").length,
  }), [potholes]);

  const uploadDataset = ({ coordinates, images }: UploadPayload) => {
    const parsedCoordinates = collectCoordinates(coordinates);

    if (images.length === 0) {
      throw new Error("Upload at least one pothole image.");
    }

    if (images.length > 200) {
      throw new Error("You can upload a maximum of 200 images.");
    }

    if (parsedCoordinates.length === 0) {
      throw new Error("The JSON file must include latitude and longitude values.");
    }

    setPotholes(createUploadedPotholes(parsedCoordinates, images));
    setIsDatasetUploaded(true);
  };

  const resetDataset = () => {
    setPotholes([]);
    setIsDatasetUploaded(false);
  };

  return (
    <PotholeDataContext.Provider value={{ potholes, analyticsSummary, isDatasetUploaded, uploadDataset, resetDataset }}>
      {children}
    </PotholeDataContext.Provider>
  );
};

export const usePotholeData = () => {
  const context = useContext(PotholeDataContext);
  if (!context) {
    throw new Error("usePotholeData must be used within a PotholeDataProvider");
  }

  return context;
};
