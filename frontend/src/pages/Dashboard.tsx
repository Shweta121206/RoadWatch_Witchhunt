import { summaryCards, tripsData } from "../data/mockData";
import { useLanguage } from "../contexts/LanguageContext";

export default function Dashboard() {
  const { t } = useLanguage();
  const summaryTitleKeys: Record<string, string> = {
    "Total Detections": "totalDetections",
    "Active Potholes": "activePotholes",
    "Fixed This Month": "fixedThisMonth",
    "Open Potholes": "openPotholes",
  };

  return (
    <div className="dashboard-page">
      <section className="hero-card">
        <div>
          <span className="eyebrow">{t("dashboard")}</span>
          <h1>{t("totalDetections")}</h1>
          <p>{t("dashboardOverview")}</p>
        </div>
        <div className="hero-metrics">
          <div>
            <p>{t("totalDetections")}</p>
            <h2>1,245</h2>
          </div>
          <div className="hero-badge">+15.8%</div>
        </div>
      </section>

      <section className="main-grid">
        <div className="chart-card">
          <div className="chart-head">
            <div>
              <h2>{t("liveCoverageMap")}</h2>
              <p>{t("mapBackendReady")}</p>
            </div>
            <div className="map-status">{t("readyForApi")}</div>
          </div>
          <div className="map-panel" aria-label="Live route map placeholder">
            <div className="map-grid-lines" />
            <div className="map-route route-one" />
            <div className="map-route route-two" />
            <div className="map-marker marker-one">
              <span>TN</span>
            </div>
            <div className="map-marker marker-two">
              <span>A</span>
            </div>
            <div className="map-marker marker-three">
              <span>V</span>
            </div>
            <div className="map-caption">{t("chennaiLiveCoverage")}</div>
          </div>
        </div>

        <div className="stats-panel">
          <div className="stat-box green">
            <span>{t("criticalPotholes")}</span>
            <strong>28</strong>
            <small>45.0% ↑</small>
          </div>
          <div className="stat-box light">
            <span>{t("fixedToday")}</span>
            <strong>12</strong>
            <small>12.5% ↓</small>
          </div>
          <div className="stat-box">
            <span>{t("openCases")}</span>
            <strong>1,024</strong>
          </div>
          <div className="stat-box">
            <span>{t("activeTrips")}</span>
            <strong>5</strong>
          </div>
        </div>
      </section>

      <section className="overview-grid">
        {summaryCards.map((card) => (
          <article key={card.title} className="summary-card">
            <div className="summary-head">
              <strong>{t(summaryTitleKeys[card.title] || card.title)}</strong>
              <span className="summary-dot" style={{ background: card.color }} />
            </div>
            <h3>{card.value}</h3>
            <p>{card.caption}</p>
          </article>
        ))}
      </section>

      <section className="panel panel-full">
        <div className="panel-title">{t("recentActivity")}</div>
        <div className="activity-table">
          {tripsData.map((trip) => (
            <div key={trip.id} className="activity-row">
              <div>
                <strong>{trip.name}</strong>
                <p>{trip.route}</p>
              </div>
              <div>
                <span>{trip.status === "active" ? t("ongoing") : t("completed")}</span>
                <strong>{trip.detections} {t("detections")}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
