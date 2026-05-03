import { useState } from "react";
import { potholesData } from "../data/mockData";
import { useLanguage } from "../contexts/LanguageContext";

const severityColors: Record<string, string> = {
  critical: "#dc2626",
  high: "#f97316",
  medium: "#facc15",
  low: "#10b981",
};

export default function Potholes() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? potholesData : potholesData.filter((item) => item.severity === filter);

  return (
    <div className="potholes-page">
      <div className="hero-card">
        <div>
          <div className="eyebrow">{t("potholeManagement")}</div>
          <h1>{t("reviewRepair")}</h1>
          <p>{t("potholesOverview")}</p>
        </div>
        <div className="hero-metrics">
          <div>
            <p>{t("totalActive")}</p>
            <h2>{filtered.length}</h2>
          </div>
          <div className="hero-badge">{t("liveUpdates")}</div>
        </div>
      </div>

      <div className="main-grid">
        <div className="chart-card">
          <div className="chart-head">
            <h2>{t("potholeCases")}</h2>
            <div className="toggle-group">
              <button className={`toggle ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
                {t("all")}
              </button>
              <button className={`toggle ${filter === "critical" ? "active" : ""}`} onClick={() => setFilter("critical")}>
                {t("critical")}
              </button>
              <button className={`toggle ${filter === "high" ? "active" : ""}`} onClick={() => setFilter("high")}>
                {t("high")}
              </button>
            </div>
          </div>
          <div className="activity-table">
            {filtered.slice(0, 8).map((item) => (
              <div key={item.id} className="activity-row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.location} - {Math.round(item.confidence * 100)}% {t("confidence")}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className="hero-badge" style={{ background: severityColors[item.severity] || "#64748b", color: "#ffffff" }}>
                    {t(item.severity)}
                  </span>
                  <span className="hero-badge" style={{ background: "#f8fafc", color: "#0f172a" }}>
                    {t(item.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-panel">
          <h2>{t("quickStats")}</h2>
          <div className="stat-box">
            <span>{t("criticalPriority")}</span>
            <strong>{potholesData.filter((p) => p.severity === "critical").length}</strong>
            <small>{t("requiresImmediateAttention")}</small>
          </div>
          <div className="stat-box green">
            <span>{t("fixedToday")}</span>
            <strong>{potholesData.filter((p) => p.status === "fixed").length}</strong>
            <small>{t("completedRepairs")}</small>
          </div>
          <div className="stat-box">
            <span>{t("averageResponse")}</span>
            <strong>2.4h</strong>
            <small>{t("timeToFirstAction")}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
