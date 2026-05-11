import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { usePotholeData } from "../contexts/PotholeDataContext";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const { t } = useLanguage();
  const { potholes } = usePotholeData();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof potholes>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results = potholes.filter((item) => (
      item.title.toLowerCase().includes(query.toLowerCase()) || item.location.includes(query)
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
                    <div className="result-name">{result.title}</div>
                    <div className="result-detail">{result.location}</div>
                    <div className="result-meta">{t(result.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="topbar-right">
        <div className="date-pill">01 May 2026 - 01 June 2026</div>
        <button className="topbar-action" onClick={() => navigate("/upload")}>{t("upload")}</button>
        <button className="topbar-action green" onClick={() => navigate("/")}>{t("liveMap")}</button>
        <button className="topbar-action" onClick={() => navigate("/potholes")}>{t("detections")}</button>
        <button className="pill-button secondary" onClick={onLogout}>{t("logout")}</button>
      </div>
    </header>
  );
}
