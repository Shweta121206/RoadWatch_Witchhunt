import { useMemo, useState } from "react";
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
          <span className="eyebrow dark">Trip Management</span>
          <h1>Route Monitoring</h1>
          <p>Start a detection trip, watch the current route, and review completed route history.</p>
        </div>
        <div className="trip-actions">
          <button className="primary-button compact" disabled={Boolean(currentTrip)} onClick={startTrip}>Start trip</button>
          <button className="secondary-button" disabled={!currentTrip} onClick={endTrip}>End trip</button>
        </div>
      </div>

      <section className="main-grid">
        <article className="chart-card">
          <div className="chart-head">
            <div>
              <h2>Current Trip Status</h2>
              <p>{currentTrip ? "Live route is recording AI detections." : "No active route is running."}</p>
            </div>
            <span className={`trip-status ${currentTrip ? "active" : "idle"}`}>
              {currentTrip ? "Active" : "Idle"}
            </span>
          </div>

          <div className="trip-status-grid">
            <div>
              <span>Trip ID</span>
              <strong>{currentTrip?.id ?? "None"}</strong>
            </div>
            <div>
              <span>Route</span>
              <strong>{currentTrip?.route ?? "Waiting for dispatch"}</strong>
            </div>
            <div>
              <span>Started</span>
              <strong>{currentTrip?.startedAt ?? "--"}</strong>
            </div>
            <div>
              <span>Detections</span>
              <strong>{currentTrip?.detections ?? 0}</strong>
            </div>
          </div>
        </article>

        <article className="stats-panel">
          <h2>Trip Summary</h2>
          <div className="stat-box">
            <span>Total trips</span>
            <strong>{trips.length}</strong>
            <small>Includes active and completed routes</small>
          </div>
          <div className="stat-box green">
            <span>Completed</span>
            <strong>{completedTrips.length}</strong>
            <small>Finished trip records</small>
          </div>
          <div className="stat-box">
            <span>Total detections</span>
            <strong>{trips.reduce((sum, trip) => sum + trip.detections, 0)}</strong>
            <small>Across all trips</small>
          </div>
        </article>
      </section>

      <section className="chart-card">
        <div className="chart-head">
          <div>
            <h2>Trip Route Visualization</h2>
            <p>{currentTrip ? currentTrip.name : "Most recent route preview"}</p>
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
              <Tooltip>{index === 0 ? "Start" : index === routeCoordinates.length - 1 ? "End" : `Stop ${index + 1}`}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </section>

      <section className="chart-card">
        <div className="chart-head">
          <div>
            <h2>Trip History</h2>
            <p>Completed garbage-truck route runs and detection counts.</p>
          </div>
        </div>
        <div className="activity-table">
          {completedTrips.map((trip) => (
            <div key={trip.id} className="activity-row">
              <div>
                <strong>{trip.id} - {trip.name}</strong>
                <p>{trip.route} - {trip.startedAt} to {trip.endedAt}</p>
              </div>
              <div className="hero-badge" style={{ background: "#10b981" }}>
                {trip.detections} detections
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
