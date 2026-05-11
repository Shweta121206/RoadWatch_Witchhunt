import { useMemo, useState } from "react";
import MapView from "../components/MapView";
import SeverityBadge from "../components/SeverityBadge";
import StatusBadge from "../components/StatusBadge";
import { usePotholeData } from "../contexts/PotholeDataContext";

export default function MapDashboard() {
  const { potholes, isDatasetUploaded } = usePotholeData();
  const [lastUpdated] = useState<string>(() => (
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  ));

  const stats = useMemo(() => ({
    total: potholes.length,
    critical: potholes.filter((pothole) => pothole.severity === "critical").length,
    open: potholes.filter((pothole) => pothole.status !== "fixed").length,
    fixed: potholes.filter((pothole) => pothole.status === "fixed").length,
  }), [potholes]);

  return (
    <div className="map-dashboard">
      <MapView potholes={potholes} className="map-dashboard-map" />

      <section className="map-command-panel" aria-label="Live pothole monitoring summary">
        <div>
          <span className="eyebrow dark">Live AI Monitoring</span>
          <h1>RoadWatch Map</h1>
          <p>{isDatasetUploaded ? "Uploaded detections are visible as severity-coded pothole markers." : "Upload images and one coordinate JSON file to activate pothole markers."}</p>
        </div>

        <div className="map-stat-grid">
          <div>
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>
          <div>
            <span>Open</span>
            <strong>{stats.open}</strong>
          </div>
          <div>
            <span>Fixed</span>
            <strong>{stats.fixed}</strong>
          </div>
          <div>
            <span>Critical</span>
            <strong>{stats.critical}</strong>
          </div>
        </div>

        <div className="map-legend">
          <SeverityBadge severity="critical" />
          <SeverityBadge severity="high" />
          <SeverityBadge severity="medium" />
          <SeverityBadge severity="low" />
        </div>

        <div className="live-feed">
          <div className="live-feed-head">
            <strong>Latest detections</strong>
            <span>{isDatasetUploaded ? `Refreshed ${lastUpdated}` : "Waiting for upload"}</span>
          </div>
          {potholes.length === 0 ? (
            <div className="empty-state compact">No pothole details are visible until a dataset is uploaded.</div>
          ) : (
            potholes.slice(0, 4).map((pothole) => (
              <article key={pothole.id} className="live-feed-item">
                <div>
                  <strong>{pothole.id}</strong>
                  <span>{pothole.title}</span>
                </div>
                <StatusBadge status={pothole.status} />
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
