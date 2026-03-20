import { FormEvent, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { createAccountWithEmail, loginWithEmail } from "../lib/auth";
import { requestNotificationAccess, showCareNotification } from "../lib/notifications";
import { useAppStore } from "../store/useAppStore";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type AuthMode = "signIn" | "signUp";

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useAppStore((state) => state.session);
  const setSession = useAppStore((state) => state.setSession);
  const authError = useAppStore((state) => state.authError);
  const setAuthError = useAppStore((state) => state.setAuthError);
  const isAuthLoading = useAppStore((state) => state.isAuthLoading);
  const setAuthLoading = useAppStore((state) => state.setAuthLoading);
  const setNotificationsEnabled = useAppStore((state) => state.setNotificationsEnabled);

  const [mode, setMode] = useState<AuthMode>("signIn");
  const [fullName, setFullName] = useState("Dr. Maya Sterling");
  const [email, setEmail] = useState("clinician@ragahealthcare.com");
  const [password, setPassword] = useState("CarePulse!2026");
  const [confirmPassword, setConfirmPassword] = useState("");

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from || "/";
  }, [location.state]);

  const isSignUpMode = mode === "signUp";

  if (session) {
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignUpMode && fullName.trim().length < 2) {
      setAuthError("Enter your full name to create the account.");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setAuthError("Enter a valid clinical email address.");
      return;
    }

    if (password.trim().length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    if (isSignUpMode && password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    try {
      setAuthError(null);
      setAuthLoading(true);

      const nextSession = isSignUpMode
        ? await createAccountWithEmail(fullName.trim(), email.trim(), password.trim())
        : await loginWithEmail(email.trim(), password.trim());

      setSession(nextSession);
      navigate(redirectPath, { replace: true });

      const permission = await requestNotificationAccess();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        await showCareNotification(
          isSignUpMode ? "RAGA account created" : "Welcome back to RAGA Health Care",
          isSignUpMode
            ? "Your workspace is ready. Review your patient care queue."
            : "Your morning care review queue is ready.",
          "/"
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in.";
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-showcase">
        <div className="login-orbit login-orbit-large" />
        <div className="login-orbit login-orbit-small" />
        <p className="eyebrow">Healthcare operations suite</p>
        <h1>Precision workflows for patient care, analytics, and modern ops.</h1>
        <p>
          RAGA Health Care blends bedside visibility, analytics, and alerts into a single clinician-first
          workspace designed for fast decisions.
        </p>

        <div className="showcase-grid">
          <article>
            <strong>Authentication</strong>
            <span>Firebase login flow with session persistence and clear error states.</span>
          </article>
          <article>
            <strong>Patient management</strong>
            <span>Responsive grid and list views with live status and care summaries.</span>
          </article>
          <article>
            <strong>Notifications</strong>
            <span>Service-worker local alerts for huddles, escalations, and care prompts.</span>
          </article>
        </div>
      </section>

      <section className="login-panel">
        <div className="brand-block">
          <div className="brand-mark">+</div>
          <div>
            <p className="eyebrow">Secure access</p>
            <h2>{isSignUpMode ? "Create clinician account" : "Clinician sign in"}</h2>
          </div>
        </div>

        <div
          className="auth-mode-switch"
          role="tablist"
          aria-label="Authentication mode switch"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!isSignUpMode}
            className={!isSignUpMode ? "auth-mode-button active" : "auth-mode-button"}
            onClick={() => {
              setMode("signIn");
              setAuthError(null);
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isSignUpMode}
            className={isSignUpMode ? "auth-mode-button active" : "auth-mode-button"}
            onClick={() => {
              setMode("signUp");
              setAuthError(null);
            }}
          >
            Sign up
          </button>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          {isSignUpMode ? (
            <label>
              <span>Full name</span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Dr. Maya Sterling"
                autoComplete="name"
              />
            </label>
          ) : null}

          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="clinician@ragahealthcare.com"
              autoComplete="email"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete={isSignUpMode ? "new-password" : "current-password"}
            />
          </label>

          {isSignUpMode ? (
            <label>
              <span>Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </label>
          ) : null}

          {authError ? <p className="form-error">{authError}</p> : null}

          <button
            className="primary-button"
            type="submit"
            disabled={isAuthLoading}
          >
            {isAuthLoading
              ? isSignUpMode
                ? "Creating account..."
                : "Signing in..."
              : isSignUpMode
                ? "Create account"
                : "Enter command center"}
          </button>

          <p className="login-form-meta">
            {isSignUpMode
              ? "Create a Firebase-backed clinician account using email and password."
              : "Use an existing Firebase account or the demo credentials below."}
          </p>
        </form>

        <div className="helper-card">
          <p className="eyebrow">{isSignUpMode ? "Firebase setup" : "Demo access"}</p>
          {isSignUpMode ? (
            <>
              <strong>Enable Email/Password</strong>
              <span>{"Firebase Console -> Authentication -> Sign-in method"}</span>
              <p>New accounts are created in Firebase and signed in immediately after success.</p>
            </>
          ) : (
            <>
              <strong>clinician@ragahealthcare.com</strong>
              <span>CarePulse!2026</span>
              <p>Add Firebase env variables to authenticate against a real project.</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
