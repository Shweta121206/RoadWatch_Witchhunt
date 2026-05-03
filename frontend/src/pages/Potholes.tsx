import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SeverityBadge from "../components/SeverityBadge";
import StatusBadge from "../components/StatusBadge";
import { getPotholes } from "../services/api";
import type { Pothole, Severity, Status } from "../types";

type SeverityFilter = "all" | Severity;
type StatusFilter = "all" | Status;

export default function Potholes() {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [date, setDate] = useState("");

  useEffect(() => {
    getPotholes().then(setPotholes);
  }, []);

  const filtered = useMemo(() => potholes.filter((pothole) => {
    const matchesSeverity = severity === "all" || pothole.severity === severity;
    const matchesStatus = status === "all" || pothole.status === status;
    const matchesDate = !date || pothole.detectedAt.startsWith(date);
    return matchesSeverity && matchesStatus && matchesDate;
  }), [date, potholes, severity, status]);

  return (
    <div className="potholes-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow dark">Detections</span>
          <h1>Potholes</h1>
          <p>Filter AI detections by severity, repair status, and date.</p>
        </div>
        <strong>{filtered.length} visible</strong>
      </div>

      <section className="filter-bar">
        <label>
          Severity
          <select value={severity} onChange={(event) => setSeverity(event.target.value as SeverityFilter)}>
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
            <option value="all">All</option>
            <option value="detected">Detected</option>
            <option value="in_progress">In progress</option>
            <option value="fixed">Fixed</option>
            <option value="reopened">Reopened</option>
          </select>
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </section>

      <section className="panel pothole-table-panel">
        <div className="pothole-table pothole-table-head">
          <span>ID</span>
          <span>Severity</span>
          <span>Status</span>
          <span>Location</span>
          <span>Date</span>
          <span>Confidence</span>
        </div>
        <div className="pothole-table-body">
          {filtered.map((pothole) => (
            <Link key={pothole.id} to={`/potholes/${pothole.id}`} className="pothole-table pothole-table-row">
              <strong>{pothole.id}</strong>
              <SeverityBadge severity={pothole.severity} />
              <StatusBadge status={pothole.status} />
              <span>{pothole.location}</span>
              <span>{pothole.detectedAt}</span>
              <span>{Math.round(pothole.confidence * 100)}%</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
