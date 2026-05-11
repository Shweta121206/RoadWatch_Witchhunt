import { FormEvent, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function RequestRoute() {
  const { t } = useLanguage();
  const [route, setRoute] = useState("");
  const [priority, setPriority] = useState("Routine");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="request-page">
      <div className="hero-card">
        <div>
          <span className="eyebrow">{t("coverageRequest")}</span>
          <h1>{t("requestRouteCoverage")}</h1>
          <p>{t("requestRouteDesc")}</p>
        </div>
      </div>

      <form className="form-section route-request-form" onSubmit={handleSubmit}>
        <h2>{t("routeToCover")}</h2>
        <div className="form-group">
          <label htmlFor="route">
            <span className="label-text">{t("route")}</span>
            <span className="label-description">{t("routeRequestHelp")}</span>
          </label>
          <textarea
            id="route"
            value={route}
            onChange={(event) => setRoute(event.target.value)}
            placeholder={t("routeRequestPlaceholder")}
            rows={5}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">
            <span className="label-text">{t("priority")}</span>
            <span className="label-description">{t("priorityHelp")}</span>
          </label>
          <select id="priority" className="language-select" value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option>{t("routine")}</option>
            <option>{t("high")}</option>
            <option>{t("urgent")}</option>
          </select>
        </div>

        {submitted && <div className="form-success-box">{t("routeRequestSaved")}</div>}
        <button type="submit" className="primary-button">{t("submitRequest")}</button>
      </form>
    </div>
  );
}
