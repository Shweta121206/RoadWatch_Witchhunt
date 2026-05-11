import { MapContainer, TileLayer } from "react-leaflet";
import PotholeMarker from "./PotholeMarker";
import type { Pothole } from "../types";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  potholes: Pothole[];
  className?: string;
}

export default function MapView({ potholes, className = "" }: MapViewProps) {
  const center: [number, number] = potholes.length
    ? [potholes[0].latitude, potholes[0].longitude]
    : [13.0827, 80.2707];

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className={`leaflet-map ${className}`}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {potholes.map((pothole) => (
        <PotholeMarker key={pothole.id} pothole={pothole} />
      ))}
    </MapContainer>
  );
}
