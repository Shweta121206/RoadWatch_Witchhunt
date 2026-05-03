import { useEffect, useMemo, useState } from "react";
import { severityDistribution, timelineData } from "../data/mockData";
import { getAnalyticsSummary, getPotholes } from "../services/api";
import type { AnalyticsSummary, Pothole } from "../types";

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
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [potholes, setPotholes] = useState<Pothole[]>([]);

  useEffect(() => {
    getAnalyticsSummary().then(setSummary);
    getPotholes().then(setPotholes);
  }, []);

  const heatPoints = useMemo(() => potholes.map((pothole, index) => ({
    ...pothole,
    left: 18 + ((index * 23) % 68),
    top: 20 + ((index * 17) % 58),
  })), [potholes]);

  const cards = [
    { label: "Total potholes", value: summary?.totalPotholes ?? 0, color: "#0f766e" },
    { label: "Open potholes", value: summary?.openPotholes ?? 0, color: "#f97316" },
    { label: "Fixed potholes", value: summary?.fixedPotholes ?? 0, color: "#16a34a" },
    { label: "Critical potholes", value: summary?.criticalPotholes ?? 0, color: "#dc2626" },
  ];

  return (
    <div className="analytics-page dashboard-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow dark">Analytics</span>
          <h1>Detection Intelligence</h1>
          <p>Summary, density, timeline, and severity mix for live pothole detections.</p>
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
              <h2>Heatmap</h2>
              <p>Detection density by area.</p>
            </div>
          </div>
          <div className="heatmap-panel">
            {heatPoints.map((point) => (
              <span
                key={point.id}
                className={`heat-point heat-${point.severity}`}
                style={{ left: `${point.left}%`, top: `${point.top}%` }}
                title={`${point.id} ${point.severity}`}
              />
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-head">
            <div>
              <h2>Severity Pie</h2>
              <p>Priority split across open detections.</p>
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
            <h2>Timeline</h2>
            <p>Daily AI detections this week.</p>
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
            <h2>Ward-wise Statistics</h2>
            <p>Chennai Zone 13 ward view for Velachery and nearby Adyar-zone corridors.</p>
          </div>
        </div>
        <div className="ward-table-wrap">
          <div className="ward-table ward-table-head">
            <span>Ward</span>
            <span>Area</span>
            <span>Localities</span>
            <span>Open</span>
            <span>Fixed</span>
            <span>Critical</span>
            <span>Avg confidence</span>
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
