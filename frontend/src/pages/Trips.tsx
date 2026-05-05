import { useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from "react-leaflet";
import { tripsData } from "../data/mockData";
import type { Trip } from "../types";
import "leaflet/dist/leaflet.css";

const formatNow = () => new Date().toLocaleString([], {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function Trips() {
  const { t } = useLanguage();
  const [trips, setTrips] = useState<Trip[]>(tripsData);
  const currentTrip = trips.find((trip) => trip.status === "active") ?? null;
  const completedTrips = trips.filter((trip) => trip.status === "completed");
  const routeCoordinates = currentTrip?.coordinates ?? trips[0]?.coordinates ?? [];

  const routeCenter = useMemo<[number, number]>(() => (
    routeCoordinates[0] ?? [13.0827, 80.2707]
  ), [routeCoordinates]);

  const startTrip = () => {
    if (currentTrip) return;

    const nextTrip: Trip = {
      id: `TR-${Math.floor(5000 + Math.random() * 900)}`,
      name: "Velachery Verification Route",
      status: "active",
      startedAt: formatNow(),
      endedAt: null,
      route: "Velachery Main Road to Adyar Zone 13",
      detections: 0,
      coordinates: [
        [12.9791, 80.2442],
        [12.9895, 80.2493],
        [13.0011, 80.2565],
        [13.0184, 80.2618],
        [13.0418, 80.2341],
      ],
    };

    setTrips([nextTrip, ...trips]);
  };

  const endTrip = () => {
    if (!currentTrip) return;

    setTrips(trips.map((trip) => (
      trip.id === currentTrip.id
        ? { ...trip, status: "completed", endedAt: formatNow(), detections: Math.max(trip.detections, 4) }
        : trip
    )));
  };

  return (
    <div className="trips-page dashboard-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow dark">{t("tripManagement")}</span>
          <h1>{t("routeMonitoring")}</h1>
          <p>{t("tripsOverview")}</p>
        </div>
        <div className="trip-actions">
          <button className="primary-button compact" disabled={Boolean(currentTrip)} onClick={startTrip}>{t("startTrip")}</button>
          <button className="secondary-button" disabled={!currentTrip} onClick={endTrip}>{t("endTrip")}</button>
        </div>
      </div>

      <section className="main-grid">
        <article className="chart-card">
          <div className="chart-head">
            <div>
              <h2>{t("currentTripStatus")}</h2>
              <p>{currentTrip ? t("liveRouteRecording") : t("noActiveRouteRunning")}</p>
            </div>
            <span className={`trip-status ${currentTrip ? "active" : "idle"}`}>
              {currentTrip ? t("active") : t("idle")}
            </span>
          </div>

          <div className="trip-status-grid">
            <div>
              <span>{t("tripId")}</span>
              <strong>{currentTrip?.id ?? t("none")}</strong>
            </div>
            <div>
              <span>{t("route")}</span>
              <strong>{currentTrip?.route ?? t("waitingForDispatch")}</strong>
            </div>
            <div>
              <span>{t("started")}</span>
              <strong>{currentTrip?.startedAt ?? "--"}</strong>
            </div>
            <div>
              <span>{t("detections")}</span>
              <strong>{currentTrip?.detections ?? 0}</strong>
            </div>
          </div>
        </article>

        <article className="stats-panel">
          <h2>{t("tripSummary")}</h2>
          <div className="stat-box">
            <span>{t("totalTrips")}</span>
            <strong>{trips.length}</strong>
            <small>{t("includesActiveAndCompletedRoutes")}</small>
          </div>
          <div className="stat-box green">
            <span>{t("completed")}</span>
            <strong>{completedTrips.length}</strong>
            <small>{t("finishedTripRecords")}</small>
          </div>
          <div className="stat-box">
            <span>{t("totalDetections")}</span>
            <strong>{trips.reduce((sum, trip) => sum + trip.detections, 0)}</strong>
            <small>{t("acrossAllTrips")}</small>
          </div>
        </article>
      </section>

      <section className="chart-card">
        <div className="chart-head">
          <div>
            <h2>{t("tripRouteVisualization")}</h2>
            <p>{currentTrip ? currentTrip.name : t("mostRecentRoutePreview")}</p>
          </div>
        </div>
        <MapContainer center={routeCenter} zoom={13} scrollWheelZoom className="trip-route-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {routeCoordinates.length > 1 && (
            <Polyline positions={routeCoordinates} pathOptions={{ color: "#0f766e", weight: 6 }} />
          )}
          {routeCoordinates.map((point, index) => (
            <CircleMarker key={`${point[0]}-${point[1]}`} center={point} radius={7} pathOptions={{ color: "#ffffff", fillColor: "#f97316", fillOpacity: 1, weight: 3 }}>
              <Tooltip>{index === 0 ? t("start") : index === routeCoordinates.length - 1 ? t("end") : `${t("stop")} ${index + 1}`}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </section>

      <section className="chart-card">
        <div className="chart-head">
          <div>
            <h2>{t("tripHistory")}</h2>
            <p>{t("completedRouteRuns")}</p>
          </div>
        </div>
        <div className="activity-table">
          {completedTrips.map((trip) => (
            <div key={trip.id} className="activity-row">
              <div>
                <strong>{trip.id} - {trip.name}</strong>
                <p>{trip.route} - {trip.startedAt} {t("to")} {trip.endedAt}</p>
              </div>
              <div className="hero-badge" style={{ background: "#10b981" }}>
                {trip.detections} {t("detections")}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
