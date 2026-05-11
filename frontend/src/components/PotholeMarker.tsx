import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import SeverityBadge from "./SeverityBadge";
import StatusBadge from "./StatusBadge";
import type { Pothole, Severity } from "../types";

const severityColors: Record<Severity, string> = {
  critical: "#dc2626",
  high: "#f97316",
  medium: "#eab308",
  low: "#16a34a",
};

const markerIcon = (severity: Severity) => L.divIcon({
  className: "pothole-marker-shell",
  html: `<span style="background:${severityColors[severity]}"></span>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -18],
});

const formatConfidence = (confidence: number) => `${Math.round(confidence * 100)}%`;

export default function PotholeMarker({ pothole }: { pothole: Pothole }) {
  return (
    <Marker position={[pothole.latitude, pothole.longitude]} icon={markerIcon(pothole.severity)}>
      <Popup minWidth={260}>
        <div className="pothole-popup">
          <img src={pothole.image} alt={pothole.title} />
          <strong>{pothole.title}</strong>
          <div className="popup-badges">
            <SeverityBadge severity={pothole.severity} />
            <StatusBadge status={pothole.status} />
          </div>
          <dl>
            <div>
              <dt>GPS</dt>
              <dd>{pothole.latitude.toFixed(5)}, {pothole.longitude.toFixed(5)}</dd>
            </div>
            <div>
              <dt>Confidence</dt>
              <dd>{formatConfidence(pothole.confidence)}</dd>
            </div>
            <div>
              <dt>Detected</dt>
              <dd>{pothole.detectedAt}</dd>
            </div>
            <div>
              <dt>Verifications</dt>
              <dd>{pothole.verification}</dd>
            </div>
          </dl>
        </div>
      </Popup>
    </Marker>
  );
}
