import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";
import SeverityBadge from "../components/SeverityBadge";
import StatusBadge from "../components/StatusBadge";
import { getPotholes } from "../services/api";
import type { Pothole, Severity, Status } from "../types";

type SeverityFilter = "all" | Severity;
type StatusFilter = "all" | Status;

export default function Potholes() {
  const { t } = useLanguage();
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
          <span className="eyebrow dark">{t("detections")}</span>
          <h1>{t("potholes")}</h1>
          <p>{t("filterAIDetections")}</p>
        </div>
        <strong>{filtered.length} {t("visible")}</strong>
      </div>

      <section className="filter-bar">
        <label>
          {t("severity")}
          <select value={severity} onChange={(event) => setSeverity(event.target.value as SeverityFilter)}>
            <option value="all">{t("all")}</option>
            <option value="critical">{t("critical")}</option>
            <option value="high">{t("high")}</option>
            <option value="medium">{t("medium")}</option>
            <option value="low">{t("low")}</option>
          </select>
        </label>
        <label>
          {t("status")}
          <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
            <option value="all">{t("all")}</option>
            <option value="detected">{t("detected")}</option>
            <option value="in_progress">{t("in_progress")}</option>
            <option value="fixed">{t("fixed")}</option>
            <option value="reopened">{t("reopened")}</option>
          </select>
        </label>
        <label>
          {t("date")}
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </section>

      <section className="panel pothole-table-panel">
        <div className="pothole-table pothole-table-head">
          <span>{t("id")}</span>
          <span>{t("severity")}</span>
          <span>{t("status")}</span>
          <span>{t("location")}</span>
          <span>{t("date")}</span>
          <span>{t("confidence")}</span>
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
