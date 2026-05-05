import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.body.classList.contains("dark-mode");
    setDarkMode(isDark);
  }, []);

  const handleDarkModeToggle = () => {
    setDarkMode((current) => {
      const nextMode = !current;
      document.body.classList.toggle("dark-mode", nextMode);
      return nextMode;
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as "English" | "Tamil" | "Hindi");
  };

  return (
    <div className="settings-page">
      <div className="hero-card">
        <div>
          <div className="eyebrow">{t("settings")}</div>
          <h1>{t("systemConfiguration")}</h1>
          <p>{t("managePreferences")}</p>
        </div>
        <div className="hero-metrics">
          <div>
            <p>{t("systemStatus")}</p>
            <h2>{t("online")}</h2>
          </div>
          <div className="hero-badge">{t("allSystems")}</div>
        </div>
      </div>

      <div className="main-grid">
        <div className="chart-card">
          <div className="chart-head">
            <h2>{t("preferences")}</h2>
            <p>{t("customizeExperience")}</p>
          </div>
          <div className="activity-table">
            <div className="activity-row">
              <div>
                <strong>{t("darkMode")}</strong>
                <p>{t("toggleThemes")}</p>
              </div>
              <button className={`toggle ${darkMode ? 'active' : ''}`} onClick={handleDarkModeToggle}>
                {darkMode ? t("on") : t("off")}
              </button>
            </div>
            <div className="activity-row">
              <div>
                <strong>{t("language")}</strong>
                <p>{t("selectLanguage")}</p>
              </div>
              <select value={language} onChange={handleLanguageChange} className="language-select">
                <option value="English">English</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="stats-panel">
          <h2>{t("accountInfo")}</h2>
          <div className="stat-box">
            <span>{t("accountName")}</span>
            <strong>Admin1_MAA</strong>
          </div>
          <div className="stat-box">
            <span>{t("emailAddress")}</span>
            <strong>admin@roadwatch.com</strong>
          </div>
          <div className="stat-box green">
            <span>{t("role")}</span>
            <strong>{t("operationsAdmin")}</strong>
          </div>
          <div className="stat-box">
            <span>{t("twoFactorAuth")}</span>
            <strong>{t("enabled")}</strong>
          </div>
          <div className="stat-box">
            <span>{t("city")}</span>
            <strong>{t("chennai")}</strong>
          </div>
          <div className="stat-box">
            <span>{t("state")}</span>
            <strong>{t("tamilNadu")}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
