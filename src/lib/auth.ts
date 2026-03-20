import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

import { firebaseAuth, isFirebaseConfigured } from "./firebase";
import type { UserSession } from "../types";

const DEMO_EMAIL = "clinician@ragahealthcare.com";
const DEMO_PASSWORD = "CarePulse!2026";

const formatSession = (email: string, uid: string, displayName?: string | null): UserSession => ({
  id: uid,
  name: displayName || "Dr. Maya Sterling",
  email,
  role: "Lead Care Coordinator",
  initials: "MS"
});

const getAuthErrorMessage = (error: unknown, intent: "sign-in" | "sign-up"): string => {
  const code =
    typeof error === "object" && error && "code" in error && typeof error.code === "string"
      ? error.code
      : null;

  switch (code) {
    case "auth/configuration-not-found":
    case "auth/operation-not-allowed":
      return "Email/password authentication is not enabled in Firebase yet. Turn it on in Authentication -> Sign-in method.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "The email or password is incorrect.";
    case "auth/email-already-in-use":
      return "An account already exists for this email.";
    case "auth/weak-password":
      return "Use a stronger password with at least 6 characters.";
    default:
      return intent === "sign-in" ? "Unable to sign in right now." : "Unable to create your account right now.";
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<UserSession> => {
  if (firebaseAuth && isFirebaseConfigured) {
    try {
      const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return formatSession(
        credentials.user.email || email,
        credentials.user.uid,
        credentials.user.displayName
      );
    } catch (error) {
      throw new Error(getAuthErrorMessage(error, "sign-in"));
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 700));

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    return formatSession(email, "demo-user");
  }

  throw new Error(
    "Firebase is not configured for this environment. Use the demo credentials shown on the login screen or add VITE_FIREBASE_* variables."
  );
};

export const createAccountWithEmail = async (
  name: string,
  email: string,
  password: string
): Promise<UserSession> => {
  if (firebaseAuth && isFirebaseConfigured) {
    try {
      const credentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);

      if (name.trim()) {
        await updateProfile(credentials.user, {
          displayName: name.trim()
        });
      }

      return formatSession(credentials.user.email || email, credentials.user.uid, name.trim());
    } catch (error) {
      throw new Error(getAuthErrorMessage(error, "sign-up"));
    }
  }

  throw new Error(
    "Sign up requires Firebase to be configured. Add your VITE_FIREBASE_* variables and enable Email/Password authentication in Firebase."
  );
};

export const logoutCurrentUser = async (): Promise<void> => {
  if (firebaseAuth && isFirebaseConfigured) {
    await signOut(firebaseAuth);
  }
};

export const subscribeToAuthSession = (
  callback: (session: UserSession | null) => void
): (() => void) => {
  if (!firebaseAuth || !isFirebaseConfigured) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(firebaseAuth, (user) => {
    if (!user) {
      callback(null);
      return;
    }

    callback(formatSession(user.email || "clinician@ragahealthcare.com", user.uid, user.displayName));
  });
};
