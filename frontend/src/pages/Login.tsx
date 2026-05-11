import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";
import { useLanguage } from "../contexts/LanguageContext";

interface LoginProps {
  onAuthenticate: () => void;
}

export default function Login({ onAuthenticate }: LoginProps) {
  const [email, setEmail] = useState("admin@roadwatch.com");
  const [password, setPassword] = useState("RoadWatch123");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = login(email, password);
    if (success) {
      setError("");
      onAuthenticate();
      navigate("/");
    } else {
      setError(t("invalidCredentials"));
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth implementation would go here
    // For now, just login as demo
    login("admin@roadwatch.com", "RoadWatch123");
    onAuthenticate();
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-panel">
        <div className="auth-header">
          <div className="brand-mark large">RW</div>
          <h1>RoadWatch</h1>
          <p>{t("smartCityRoadManagement")}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {t("email")}
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            {t("password")}
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="primary-button">
            {t("signIn")}
          </button>
        </form>

        <div className="auth-divider">{t("or")}</div>

        <button type="button" className="google-button" onClick={handleGoogleLogin}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
          </svg>
          {t("continueWithGoogle")}
        </button>

        <div className="auth-footer">
          <p>{t("dontHaveAccount")} <Link to="/signup" className="auth-link">{t("signup")}</Link></p>
        </div>
      </div>

      <div className="auth-background">
        <div className="auth-overlay"></div>
        <div className="auth-content">
          <h2>{t("welcomeBack")}</h2>
          <p>{t("loginDesc")}</p>
        </div>
      </div>
    </div>
  );
}
