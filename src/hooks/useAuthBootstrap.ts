import { useEffect } from "react";

import { isFirebaseConfigured } from "../lib/firebase";
import { subscribeToAuthSession } from "../lib/auth";
import { useAppStore } from "../store/useAppStore";

export const useAuthBootstrap = (): void => {
  const setSession = useAppStore((state) => state.setSession);
  const clearSession = useAppStore((state) => state.clearSession);

  useEffect(() => {
    const unsubscribe = subscribeToAuthSession((session) => {
      if (session) {
        setSession(session);
        return;
      }

      if (isFirebaseConfigured) {
        clearSession();
      }
    });

    return unsubscribe;
  }, [clearSession, setSession]);
};
