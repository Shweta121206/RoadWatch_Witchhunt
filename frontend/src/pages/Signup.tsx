import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";
import { useLanguage } from "../contexts/LanguageContext";

interface SignupProps {
  onAuthenticate: () => void;
}

export default function Signup({ onAuthenticate }: SignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }
    
    if (password.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    // For demo purposes, allow signup
    // In production, this would hit a backend API
    login(email, password);
    setError("");
    onAuthenticate();
    navigate("/");
  };

  const handleGoogleSignup = () => {
    // Google OAuth implementation would go here
    login("user@google.com", "googleauth");
    onAuthenticate();
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-panel">
        <div className="auth-header">
          <div className="brand-mark large">RW</div>
          <h1>RoadWatch</h1>
          <p>{t("createYourAccount")}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {t("fullName")}
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            {t("email")}
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            {t("password")}
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <label>
            {t("confirmPassword")}
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="primary-button">
            {t("createAccount")}
          </button>
        </form>

        <div className="auth-divider">{t("or")}</div>

        <button type="button" className="google-button" onClick={handleGoogleSignup}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
          {t("signUpWithGoogle")}
        </button>

        <div className="auth-footer">
          <p>{t("alreadyHaveAccount")} <Link to="/login" className="auth-link">{t("signIn")}</Link></p>
        </div>
      </div>

      <div className="auth-background">
        <div className="auth-overlay"></div>
        <div className="auth-content">
          <h2>{t("joinRoadWatch")}</h2>
          <p>{t("signupDesc")}</p>
        </div>
      </div>
    </div>
  );
}
