import { useEffect, useMemo, useState } from "react";
import MapView from "../components/MapView";
import SeverityBadge from "../components/SeverityBadge";
import StatusBadge from "../components/StatusBadge";
import { getPotholes } from "../services/api";
import type { Pothole } from "../types";

export default function MapDashboard() {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("Loading");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const nextPotholes = await getPotholes();
      if (!mounted) return;
      setPotholes(nextPotholes);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };

    load();
    const interval = window.setInterval(load, 5000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

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
          <p>Camera detections flow into backend APIs, then appear here as severity-coded pothole markers.</p>
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
            <span>Refreshed {lastUpdated}</span>
          </div>
          {potholes.slice(0, 4).map((pothole) => (
            <article key={pothole.id} className="live-feed-item">
              <div>
                <strong>{pothole.id}</strong>
                <span>{pothole.title}</span>
              </div>
              <StatusBadge status={pothole.status} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
