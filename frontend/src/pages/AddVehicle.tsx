import { FormEvent, useState } from "react";
import type { Vehicle } from "../types";
import { useLanguage } from "../contexts/LanguageContext";

interface AddVehicleProps {
  onAddVehicle: (vehicle: Vehicle) => void;
}

const emptyVehicle: Vehicle = {
  name: "",
  area: "",
  registrationNumber: "",
  cameraId: "",
  routeCovered: "",
};

export default function AddVehicle({ onAddVehicle }: AddVehicleProps) {
  const { t } = useLanguage();
  const [vehicle, setVehicle] = useState<Vehicle>(emptyVehicle);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateRegistrationNumber = (regNum: string): boolean => {
    return /^[A-Z]{2}\s\d{2}\s[A-Z]{1,3}\s\d{4}$/.test(regNum);
  };

  const formatRegistrationNumber = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const state = cleaned.slice(0, 2).replace(/[^A-Z]/g, "");
    const district = cleaned.slice(2, 4).replace(/[^0-9]/g, "");
    const remainder = cleaned.slice(4);
    const firstDigitIndex = remainder.search(/\d/);
    const seriesSource = firstDigitIndex === -1 ? remainder : remainder.slice(0, firstDigitIndex);
    const numberSource = firstDigitIndex === -1 ? "" : remainder.slice(firstDigitIndex);
    const series = seriesSource.replace(/[^A-Z]/g, "").slice(0, 3);
    const number = numberSource.replace(/[^0-9]/g, "").slice(0, 4);

    return [state, district, series, number].filter(Boolean).join(" ");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "registrationNumber") {
      formattedValue = formatRegistrationNumber(value);
    }

    if (name === "cameraId") {
      formattedValue = value.toUpperCase();
    }

    setVehicle({ ...vehicle, [name]: formattedValue });
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!vehicle.name.trim()) {
      setError(t("vehicleNameRequired"));
      return;
    }

    if (!vehicle.area.trim()) {
      setError(t("areaRequired"));
      return;
    }

    if (!vehicle.registrationNumber.trim()) {
      setError(t("registrationRequired"));
      return;
    }

    if (!validateRegistrationNumber(vehicle.registrationNumber)) {
      setError(t("invalidRegistration"));
      return;
    }

    if (!vehicle.cameraId.trim()) {
      setError(t("cameraRequired"));
      return;
    }

    if (!vehicle.routeCovered.trim()) {
      setError(t("routeRequired"));
      return;
    }

    onAddVehicle(vehicle);
    setSuccess(t("vehicleAdded"));
    setVehicle(emptyVehicle);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="add-page">
      <div className="hero-card">
        <div>
          <span className="eyebrow">{t("fleetManagement")}</span>
          <h1>{t("addNewVehicle")}</h1>
          <p>{t("addVehicleDesc")}</p>
        </div>
      </div>

      <div className="add-container">
        <form className="add-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>{t("vehicleInformation")}</h2>

            <div className="form-group">
              <label htmlFor="name">
                <span className="label-text">{t("vehicleName")}</span>
                <span className="label-description">{t("vehicleNameDesc")}</span>
              </label>
              <input id="name" type="text" name="name" value={vehicle.name} onChange={handleInputChange} placeholder={t("enterVehicleName")} required />
            </div>

            <div className="form-group">
              <label htmlFor="area">
                <span className="label-text">{t("area")}</span>
                <span className="label-description">{t("areaDesc")}</span>
              </label>
              <input id="area" type="text" name="area" value={vehicle.area} onChange={handleInputChange} placeholder={t("areaPlaceholder")} required />
            </div>

            <div className="form-group">
              <label htmlFor="registrationNumber">
                <span className="label-text">{t("registrationNumber")}</span>
                <span className="label-description">{t("registrationDesc")}</span>
              </label>
              <input
                id="registrationNumber"
                type="text"
                name="registrationNumber"
                value={vehicle.registrationNumber}
                onChange={handleInputChange}
                placeholder={t("registrationPlaceholder")}
                maxLength={14}
                required
              />
              {vehicle.registrationNumber && !validateRegistrationNumber(vehicle.registrationNumber) && (
                <div className="input-error">
                  {t("registrationHelp")}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>{t("cameraRouteDetails")}</h2>

            <div className="form-group">
              <label htmlFor="cameraId">
                <span className="label-text">{t("cameraId")}</span>
                <span className="label-description">{t("cameraIdDesc")}</span>
              </label>
              <input id="cameraId" type="text" name="cameraId" value={vehicle.cameraId} onChange={handleInputChange} placeholder={t("cameraPlaceholder")} required />
            </div>

            <div className="form-group">
              <label htmlFor="routeCovered">
                <span className="label-text">{t("routeCovered")}</span>
                <span className="label-description">{t("routeCoveredDesc")}</span>
              </label>
              <textarea
                id="routeCovered"
                name="routeCovered"
                value={vehicle.routeCovered}
                onChange={handleInputChange}
                placeholder={t("routeCoveredPlaceholder")}
                rows={5}
                required
              />
            </div>
          </div>

          {error && <div className="form-error-box">{error}</div>}
          {success && <div className="form-success-box">{success}</div>}

          <div className="form-actions">
            <button type="submit" className="primary-button">{t("addVehicle")}</button>
            <button type="button" className="secondary-button" onClick={() => setVehicle(emptyVehicle)}>{t("clearForm")}</button>
          </div>
        </form>

        <div className="info-panel">
          <div className="info-card">
            <h3>{t("registrationFormatGuide")}</h3>
            <div className="format-guide">
              <div className="guide-item">
                <span className="guide-label">{t("stateUtCode")}</span>
                <span className="guide-value">{t("twoLetters")}</span>
              </div>
              <div className="guide-item">
                <span className="guide-label">{t("districtRto")}</span>
                <span className="guide-value">{t("twoDigits")}</span>
              </div>
              <div className="guide-item">
                <span className="guide-label">{t("series")}</span>
                <span className="guide-value">{t("oneToThreeLetters")}</span>
              </div>
              <div className="guide-item">
                <span className="guide-label">{t("uniqueNumber")}</span>
                <span className="guide-value">{t("fourDigits")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
