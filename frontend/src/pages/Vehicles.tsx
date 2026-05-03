import type { Vehicle } from "../types";
import { useLanguage } from "../contexts/LanguageContext";

interface VehiclesProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export default function Vehicles({ vehicles, selectedVehicle, onSelectVehicle }: VehiclesProps) {
  const { t } = useLanguage();

  return (
    <div className="vehicles-page">
      <div className="hero-card">
        <div>
          <span className="eyebrow">{t("fleetRegistry")}</span>
          <h1>{t("vehicles")}</h1>
          <p>{t("vehiclesDesc")}</p>
        </div>
        <div className="hero-metrics">
          <div>
            <p>{t("totalVehicles")}</p>
            <h2>{vehicles.length}</h2>
          </div>
          <div className="hero-badge">{t("chennai")}</div>
        </div>
      </div>

      <section className="panel vehicle-panel">
        <div className="vehicle-table-head vehicle-row">
          <span>{t("vehicle")}</span>
          <span>{t("area")}</span>
          <span>{t("registrationNumber")}</span>
          <span>{t("cameraId")}</span>
          <span>{t("route")}</span>
        </div>
        <div className="vehicle-table">
          {vehicles.map((vehicle) => {
            const isSelected = selectedVehicle?.name === vehicle.name;

            return (
              <button
                key={`${vehicle.name}-${vehicle.registrationNumber}`}
                type="button"
                className={isSelected ? "vehicle-row selected" : "vehicle-row"}
                onClick={() => onSelectVehicle(vehicle)}
              >
                <strong>{vehicle.name}</strong>
                <span>{vehicle.area}</span>
                <span>{vehicle.registrationNumber}</span>
                <span>{vehicle.cameraId}</span>
                <span>{vehicle.routeCovered}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
