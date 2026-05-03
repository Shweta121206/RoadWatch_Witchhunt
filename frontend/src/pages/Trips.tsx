import { tripsData } from "../data/mockData";
import { useLanguage } from "../contexts/LanguageContext";

export default function Trips() {
  const { t } = useLanguage();
  const activeTrips = tripsData.filter((trip) => trip.status === "active");
  const completedTrips = tripsData.filter((trip) => trip.status !== "active");

  return (
    <div className="trips-page">
      <div className="hero-card">
        <div>
          <div className="eyebrow">{t("tripManagement")}</div>
          <h1>{t("routeMonitoring")}</h1>
          <p>{t("tripsOverview")}</p>
        </div>
        <div className="hero-metrics">
          <div>
            <p>{t("activeRoutes")}</p>
            <h2>{activeTrips.length}</h2>
          </div>
          <div className="hero-badge">{t("realTime")}</div>
        </div>
      </div>

      <div className="main-grid">
        <div className="chart-card">
          <div className="chart-head">
            <h2>{t("activeTrips")}</h2>
            <p>{t("currentlyRunningRoutes")}</p>
          </div>
          <div className="activity-table">
            {activeTrips.map((trip) => (
              <div key={trip.id} className="activity-row">
                <div>
                  <strong>{trip.name}</strong>
                  <p>{trip.route} - {t("started")} {trip.startedAt}</p>
                </div>
                <div className="hero-badge" style={{ background: "#0f766e" }}>
                  {trip.detections} {t("detections")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-panel">
          <h2>{t("tripSummary")}</h2>
          <div className="stat-box">
            <span>{t("totalTripsToday")}</span>
            <strong>{tripsData.length}</strong>
            <small>{t("allRoutesCombined")}</small>
          </div>
          <div className="stat-box green">
            <span>{t("completed")}</span>
            <strong>{completedTrips.length}</strong>
            <small>{t("finishedSuccessfully")}</small>
          </div>
          <div className="stat-box">
            <span>{t("avgDetections")}</span>
            <strong>{Math.round(tripsData.reduce((sum, trip) => sum + trip.detections, 0) / tripsData.length)}</strong>
            <small>{t("perTrip")}</small>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-head">
          <h2>{t("recentCompletedTrips")}</h2>
          <p>{t("lastFiveFinishedRoutes")}</p>
        </div>
        <div className="activity-table">
          {completedTrips.slice(0, 5).map((trip) => (
            <div key={trip.id} className="activity-row">
              <div>
                <strong>{trip.name}</strong>
                <p>{trip.route} - {trip.startedAt} - {trip.endedAt}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <div className="hero-badge" style={{ background: "#10b981" }}>
                  {trip.detections} {t("detections")}
                </div>
                <div className="hero-badge" style={{ background: "#f8fafc", color: "#0f172a" }}>
                  {t("completed")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
