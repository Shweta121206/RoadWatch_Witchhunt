import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const mockData = [
      { id: 1, name: "T. Nagar Main Road", location: "13.0827, 80.2707", detections: 3, status: "detected" },
      { id: 2, name: "Mount Road", location: "13.0850, 80.2780", detections: 5, status: "reopened" },
      { id: 3, name: "Adyar Bridge", location: "13.0011, 80.2565", detections: 2, status: "in_progress" },
      { id: 4, name: "Velachery Main Road", location: "12.9791, 80.2442", detections: 1, status: "fixed" },
      { id: 5, name: "Anna Salai", location: "13.0845, 80.2748", detections: 4, status: "detected" },
      { id: 6, name: "Nungambakkam", location: "13.0880, 80.2790", detections: 2, status: "reported" },
    ];

    const results = mockData.filter((item) => (
      item.name.toLowerCase().includes(query.toLowerCase()) || item.location.includes(query)
    ));

    setSearchResults(results);
    setShowResults(true);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="search-input">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder={t("search")} value={searchQuery} onChange={(event) => handleSearch(event.target.value)} />
          {showResults && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((result) => (
                <div key={result.id} className="search-result-item">
                  <div className="result-info">
                    <div className="result-name">{result.name}</div>
                    <div className="result-detail">{result.location}</div>
                    <div className="result-meta">{result.detections} {t("detections")} - {t(result.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="topbar-right">
        <div className="date-pill">01 May 2026 - 01 June 2026</div>
        <button className="topbar-action green" onClick={() => navigate("/")}>{t("liveMap")}</button>
        <button className="topbar-action" onClick={() => navigate("/potholes")}>{t("detections")}</button>
        <button className="pill-button secondary" onClick={onLogout}>{t("logout")}</button>
      </div>
    </header>
  );
}
