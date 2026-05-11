import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import MapView from "../components/MapView";
import SeverityBadge from "../components/SeverityBadge";
import StatusBadge from "../components/StatusBadge";
import { useLanguage } from "../contexts/LanguageContext";
import { getPotholeById } from "../services/api";
import type { Pothole, Status } from "../types";

export default function PotholeDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [pothole, setPothole] = useState<Pothole | null | undefined>(undefined);
  const [status, setStatus] = useState<Status>("detected");
  const [isFalsePositiveLocked, setIsFalsePositiveLocked] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPotholeById(id).then((nextPothole) => {
      setPothole(nextPothole);
      if (nextPothole) setStatus(nextPothole.status);
      setIsFalsePositiveLocked(false);
    });
  }, [id]);

  if (pothole === null) return <Navigate to="/potholes" replace />;
  if (!pothole) return <div className="panel detail-loading">{t("loadingPothole")}</div>;
  const canLockFalsePositive = status === "false_positive" && !isFalsePositiveLocked;

  return (
    <div className="detail-page">
      <div className="page-title-row">
        <div>
          <Link to="/potholes" className="back-link">{t("backToPotholes")}</Link>
          <h1>{pothole.id}</h1>
          <p>{pothole.title}</p>
        </div>
        <div className="detail-actions">
          <button className="secondary-button" disabled={isFalsePositiveLocked} onClick={() => setStatus("false_positive")}>
            {t("markFalsePositive")}
          </button>
          <button
            className="secondary-button"
            disabled={!canLockFalsePositive}
            onClick={() => setIsFalsePositiveLocked(true)}
          >
            {isFalsePositiveLocked ? t("falsePositiveLocked") : t("lockFalsePositive")}
          </button>
          <select
            value={status}
            disabled={isFalsePositiveLocked}
            onChange={(event) => setStatus(event.target.value as Status)}
          >
            <option value="detected">{t("detected")}</option>
            <option value="in_progress">{t("in_progress")}</option>
            <option value="fixed">{t("fixed")}</option>
            <option value="reopened">{t("reopened")}</option>
            <option value="false_positive">{t("falsePositive")}</option>
          </select>
        </div>
      </div>

      <section className="detail-grid">
        <article className="chart-card">
          <img className="detail-image" src={pothole.image} alt={pothole.title} />
          <div className="pothole-gallery">
            {(pothole.gallery ?? [pothole.image]).map((src) => (
              <img key={src} src={src} alt={pothole.title} />
            ))}
          </div>
          <div className="detail-badges">
            <SeverityBadge severity={pothole.severity} />
            <StatusBadge status={status} />
          </div>
          <dl className="detail-list">
            <div><dt>{t("location")}</dt><dd>{pothole.location}</dd></div>
            <div><dt>{t("gpsCoordinates")}</dt><dd>{pothole.latitude.toFixed(5)}, {pothole.longitude.toFixed(5)}</dd></div>
            <div><dt>{t("confidence")}</dt><dd>{Math.round(pothole.confidence * 100)}%</dd></div>
            <div><dt>{t("detectedTime")}</dt><dd>{pothole.detectedAt}</dd></div>
            <div><dt>{t("verificationCount")}</dt><dd>{pothole.verification}</dd></div>
          </dl>
        </article>

        <article className="chart-card">
          <div className="chart-head">
            <div>
              <h2>{t("mapLocation")}</h2>
              <p>{t("exactMarkerPosition")}</p>
            </div>
          </div>
          <MapView potholes={[pothole]} className="detail-map" />
        </article>
      </section>

      <section className="chart-card">
        <div className="chart-head">
          <div>
            <h2>{t("verificationHistory")}</h2>
            <p>{t("auditTrail")}</p>
          </div>
        </div>
        <div className="activity-table">
          {(pothole.verificationHistory ?? []).map((event) => (
            <div key={event.id} className="activity-row">
              <div>
                <strong>{event.action}</strong>
                <p>{event.actor} - {event.note}</p>
              </div>
              <span>{event.timestamp}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
