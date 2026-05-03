import { severityDistribution, timelineData } from "../data/mockData";
import { useLanguage } from "../contexts/LanguageContext";

export default function Analytics() {
  const { t } = useLanguage();

  return (
    <div className="analytics-page">
      <div className="chart-card">
        <div className="chart-head">
          <div>
            <h2>{t("analyticsSummary")}</h2>
            <p>{t("analyticsSummaryDesc")}</p>
          </div>
        </div>
        <div className="overview-grid">
          <div className="summary-card">
            <div className="summary-head">
              <h3>1,245</h3>
              <div className="summary-dot" style={{ background: "#0f766e" }}></div>
            </div>
            <span>{t("totalPotholes")}</span>
          </div>
          <div className="summary-card">
            <div className="summary-head">
              <h3>312</h3>
              <div className="summary-dot" style={{ background: "#f59e0b" }}></div>
            </div>
            <span>{t("openRepairs")}</span>
          </div>
          <div className="summary-card">
            <div className="summary-head">
              <h3>89</h3>
              <div className="summary-dot" style={{ background: "#10b981" }}></div>
            </div>
            <span>{t("fixedThisWeek")}</span>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div className="chart-card">
          <div className="chart-head">
            <h2>{t("severityDistribution")}</h2>
            <p>{t("severityBreakdown")}</p>
          </div>
          <div className="activity-table">
            {severityDistribution.map((item) => (
              <div key={item.label} className="activity-row">
                <div>
                  <strong>{t(item.label.toLowerCase())}</strong>
                  <p>{item.value}% {t("ofCases")}</p>
                </div>
                <div className="hero-badge" style={{ background: item.color }}>{item.value}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-panel">
          <h2>{t("weeklyDetectionTimeline")}</h2>
          <div className="chart-plot">
            <div className="bar-grid">
              {timelineData.map((day) => (
                <div key={day.date} className="chart-bar" style={{ height: `${day.value * 2}px` }}></div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            {timelineData.map((day) => (
              <span key={day.date} style={{ fontSize: '0.8rem', color: '#64748b' }}>{day.date}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
