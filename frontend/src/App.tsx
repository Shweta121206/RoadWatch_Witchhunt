import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "./utils/auth";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Potholes from "./pages/Potholes";
import Trips from "./pages/Trips";
import Settings from "./pages/Settings";
import AddVehicle from "./pages/AddVehicle";
import RequestRoute from "./pages/RequestRoute";
import Vehicles from "./pages/Vehicles";
import { LanguageProvider } from "./contexts/LanguageContext";
import { vehiclesData } from "./data/mockData";
import type { Vehicle } from "./types";

const storedVehicles = () => {
  const saved = localStorage.getItem("roadwatchVehicles");
  if (!saved) return vehiclesData;

  try {
    return JSON.parse(saved) as Vehicle[];
  } catch {
    return vehiclesData;
  }
};

function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [vehicles, setVehicles] = useState<Vehicle[]>(storedVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    setAuthed(false);
    navigate("/login");
  };

  const requireAuth = (element: JSX.Element) => (
    authed ? element : <Navigate to="/login" replace />
  );

  const saveVehicles = (nextVehicles: Vehicle[]) => {
    setVehicles(nextVehicles);
    localStorage.setItem("roadwatchVehicles", JSON.stringify(nextVehicles));
  };

  const addVehicle = (vehicle: Vehicle) => {
    saveVehicles([...vehicles, vehicle]);
  };

  const removeSelectedVehicle = () => {
    if (!selectedVehicle) return;

    const confirmation = window.prompt(`Type ${selectedVehicle.name} to confirm removal.`);
    if (confirmation !== selectedVehicle.name) return;

    saveVehicles(vehicles.filter((vehicle) => vehicle.name !== selectedVehicle.name));
    setSelectedVehicle(null);
  };

  return (
    <LanguageProvider>
      <div className="app-shell">
        {authed && <Sidebar />}
        <div className="main-column">
          {authed && (
            <Header
              onLogout={handleLogout}
              selectedVehicle={selectedVehicle}
              onRemoveVehicle={removeSelectedVehicle}
            />
          )}
          <main className="content-shell">
            <Routes>
              <Route path="/login" element={<Login onAuthenticate={() => setAuthed(true)} />} />
              <Route path="/signup" element={<Signup onAuthenticate={() => setAuthed(true)} />} />
              <Route path="/" element={requireAuth(<Dashboard />)} />
              <Route path="/add" element={requireAuth(<AddVehicle onAddVehicle={addVehicle} />)} />
              <Route path="/request" element={requireAuth(<RequestRoute />)} />
              <Route path="/analytics" element={requireAuth(<Analytics />)} />
              <Route path="/potholes" element={requireAuth(<Potholes />)} />
              <Route path="/trips" element={requireAuth(<Trips />)} />
              <Route
                path="/vehicles"
                element={requireAuth(
                  <Vehicles vehicles={vehicles} selectedVehicle={selectedVehicle} onSelectVehicle={setSelectedVehicle} />
                )}
              />
              <Route path="/settings" element={requireAuth(<Settings />)} />
              <Route path="*" element={<Navigate to={authed ? "/" : "/login"} replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
