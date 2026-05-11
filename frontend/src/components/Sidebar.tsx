import { NavLink } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const navItems = [
  {
    path: "/",
    labelKey: "liveMap",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18h6V6H4v12ZM14 18h6V10h-6v8Z" />
      </svg>
    ),
  },
  {
    path: "/analytics",
    labelKey: "analytics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19h16M8 14V8m8 11V11" />
      </svg>
    ),
  },
  {
    path: "/potholes",
    labelKey: "potholes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 12h10M8 16h8M9 8h6" />
      </svg>
    ),
  },
  {
    path: "/upload",
    labelKey: "upload",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
      </svg>
    ),
  },
  {
    path: "/settings",
    labelKey: "settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01A1.65 1.65 0 0 0 9 4.09V4a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { t } = useLanguage();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">RW</div>
        <div>
          <div className="brand-title">RoadWatch</div>
          <div className="brand-subtitle">{t("operations")}</div>
        </div>
      </div>

      <div className="sidebar-group">
        <div className="sidebar-label">{t("general")}</div>
        {navItems.slice(0, 3).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {t(item.labelKey)}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-group">
        <div className="sidebar-label">{t("tools")}</div>
        {navItems.slice(3).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {t(item.labelKey)}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="profile-card">
          <div className="profile-avatar">RW</div>
          <div>
            <div className="profile-name">Admin1_MAA</div>
            <div className="profile-email">admin@roadwatch.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
