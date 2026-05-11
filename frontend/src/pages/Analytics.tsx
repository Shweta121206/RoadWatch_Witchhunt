import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { MapContainer, TileLayer } from "react-leaflet";
import { severityDistribution, timelineData } from "../data/mockData";
import { getAnalyticsSummary, getPotholes } from "../services/api";
import type { AnalyticsSummary, Pothole } from "../types";
import LeafletHeatmap from "../components/LeafletHeatmap";

const wardStats = [
  {
    ward: "175",
    area: "Velachery",
    localities: "Periyar Nagar, Ambedkar Nagar",
    open: 14,
    fixed: 8,
    critical: 3,
    confidence: "89%",
  },
  {
    ward: "177",
    area: "Velachery / Thiruvanmiyur edge",
    localities: "Magalaxmi Nagar, Ganesh Nagar, Rajasathupathypuram, Joseph Colony",
    open: 11,
    fixed: 6,
    critical: 2,
    confidence: "86%",
  },
  {
    ward: "179",
    area: "Velachery Main Road corridor",
    localities: "Velachery Main Road, Kalshiyap Court",
    open: 18,
    fixed: 9,
    critical: 5,
    confidence: "91%",
  },
  {
    ward: "170-174",
    area: "Broader Zone 13",
    localities: "Adyar, R.A. Puram, Avvai Nagar areas",
    open: 23,
    fixed: 17,
    critical: 4,
    confidence: "84%",
  },
  {
    ward: "176, 178, 180-182",
    area: "Broader Velachery Assembly / Adyar Zone",
    localities: "Thiruvanmiyur, Besant Nagar, Adampakkam, Velachery West, Gandhi Salai",
    open: 31,
    fixed: 21,
    critical: 6,
    confidence: "87%",
  },
];

export default function Analytics() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [potholes, setPotholes] = useState<Pothole[]>([]);

  useEffect(() => {
    getAnalyticsSummary().then(setSummary);
    getPotholes().then(setPotholes);
  }, []);

  const center: [number, number] = potholes.length
    ? [potholes[0].latitude, potholes[0].longitude]
    : [13.0827, 80.2707];

  const heatPoints = useMemo(() => {
    const basePoints = potholes.map((pothole) => {
      const severityWeight = {
        critical: 1,
        high: 0.85,
        medium: 0.65,
        low: 0.45,
      }[pothole.severity];

      return [pothole.latitude, pothole.longitude, severityWeight] as [number, number, number];
    });

    return basePoints.flatMap(([lat, lng, intensity]) => {
      const cluster: [number, number, number][] = [[lat, lng, intensity]];

      for (let i = 1; i <= 5; i += 1) {
        const offset = 0.00015 * i;
        const strength = Math.max(0.15, intensity * (0.6 + i * 0.06));
        const angles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI];

        angles.forEach((angle, index) => {
          const deltaLat = Math.cos(angle) * offset * (index + 1);
          const deltaLng = Math.sin(angle) * offset * (index + 1);
          cluster.push([lat + deltaLat, lng + deltaLng, strength]);
        });
      }

      return cluster;
    });
  }, [potholes]);

  const cards = [
    { label: t("totalPotholes"), value: summary?.totalPotholes ?? 0, color: "#0f766e" },
    { label: t("openPotholes"), value: summary?.openPotholes ?? 0, color: "#f97316" },
    { label: t("fixedPotholes"), value: summary?.fixedPotholes ?? 0, color: "#16a34a" },
    { label: t("criticalPotholes"), value: summary?.criticalPotholes ?? 0, color: "#dc2626" },
  ];

  return (
    <div className="analytics-page dashboard-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow dark">{t("analytics")}</span>
          <h1>{t("detectionIntelligence")}</h1>
          <p>{t("summaryDensityTimeline")}</p>
        </div>
      </div>

      <section className="overview-grid four">
        {cards.map((card) => (
          <article key={card.label} className="summary-card">
            <div className="summary-head">
              <strong>{card.label}</strong>
              <span className="summary-dot" style={{ background: card.color }} />
            </div>
            <h3>{card.value}</h3>
          </article>
        ))}
      </section>

      <section className="main-grid">
        <div className="chart-card">
          <div className="chart-head">
            <div>
              <h2>{t("heatmap")}</h2>
              <p>{t("detectionDensityByArea")}</p>
            </div>
          </div>
          <div className="heatmap-panel">
            <MapContainer
              center={center}
              zoom={12}
              scrollWheelZoom
              className="leaflet-map"
              style={{ height: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LeafletHeatmap points={heatPoints} />
            </MapContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-head">
            <div>
              <h2>{t("severityPie")}</h2>
              <p>{t("prioritySplit")}</p>
            </div>
          </div>
          <div className="pie-wrap">
            <div className="severity-pie" />
            <div className="pie-legend">
              {severityDistribution.map((item) => (
                <span key={item.label}>
                  <i style={{ background: item.color }} />
                  {item.label} {item.value}%
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="chart-card">
        <div className="chart-head">
          <div>
            <h2>{t("timeline")}</h2>
            <p>{t("dailyAIDetections")}</p>
          </div>
        </div>
        <div className="timeline-chart">
          {timelineData.map((day) => (
            <div key={day.date} className="timeline-bar-wrap">
              <span className="timeline-bar" style={{ height: `${day.value * 4}px` }} />
              <strong>{day.value}</strong>
              <small>{day.date}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="chart-card">
        <div className="chart-head">
          <div>
            <h2>{t("wardWiseStatistics")}</h2>
            <p>{t("wardStatsDesc")}</p>
          </div>
        </div>
        <div className="ward-table-wrap">
          <div className="ward-table ward-table-head">
            <span>{t("ward")}</span>
            <span>{t("area")}</span>
            <span>{t("localities")}</span>
            <span>{t("open")}</span>
            <span>{t("fixed")}</span>
            <span>{t("critical")}</span>
            <span>{t("avgConfidence")}</span>
          </div>
          {wardStats.map((ward) => (
            <div key={ward.ward} className="ward-table ward-table-row">
              <strong>{ward.ward}</strong>
              <span>{ward.area}</span>
              <span>{ward.localities}</span>
              <span>{ward.open}</span>
              <span>{ward.fixed}</span>
              <span>{ward.critical}</span>
              <span>{ward.confidence}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
