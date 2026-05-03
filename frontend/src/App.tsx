import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "./utils/auth";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MapDashboard from "./pages/MapDashboard";
import Analytics from "./pages/Analytics";
import Potholes from "./pages/Potholes";
import PotholeDetail from "./pages/PotholeDetail";
import Trips from "./pages/Trips";
import Settings from "./pages/Settings";
import RequestRoute from "./pages/RequestRoute";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
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

  return (
    <LanguageProvider>
      <div className="app-shell">
        {authed && <Sidebar />}
        <div className="main-column">
          {authed && (
            <Header
              onLogout={handleLogout}
            />
          )}
          <main className="content-shell">
            <Routes>
              <Route path="/login" element={<Login onAuthenticate={() => setAuthed(true)} />} />
              <Route path="/signup" element={<Signup onAuthenticate={() => setAuthed(true)} />} />
              <Route path="/" element={requireAuth(<MapDashboard />)} />
              <Route path="/request" element={requireAuth(<RequestRoute />)} />
              <Route path="/analytics" element={requireAuth(<Analytics />)} />
              <Route path="/potholes" element={requireAuth(<Potholes />)} />
              <Route path="/potholes/:id" element={requireAuth(<PotholeDetail />)} />
              <Route path="/trips" element={requireAuth(<Trips />)} />
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
