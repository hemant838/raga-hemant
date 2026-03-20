import { create } from "zustand";
import { persist } from "zustand/middleware";

import { mockPatients } from "../data/mockPatients";
import type { Patient, PatientView, UserSession } from "../types";

interface AppState {
  session: UserSession | null;
  patients: Patient[];
  patientView: PatientView;
  selectedPatientId: string;
  authError: string | null;
  isAuthLoading: boolean;
  notificationsEnabled: boolean;
  setSession: (session: UserSession | null) => void;
  clearSession: () => void;
  setAuthError: (error: string | null) => void;
  setAuthLoading: (value: boolean) => void;
  setPatientView: (view: PatientView) => void;
  selectPatient: (patientId: string) => void;
  setNotificationsEnabled: (value: boolean) => void;
}

const defaultSelectedPatient = mockPatients[0]?.id ?? "";

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      session: null,
      patients: mockPatients,
      patientView: "grid",
      selectedPatientId: defaultSelectedPatient,
      authError: null,
      isAuthLoading: false,
      notificationsEnabled: false,
      setSession: (session) => set({ session }),
      clearSession: () =>
        set({
          session: null,
          authError: null
        }),
      setAuthError: (authError) => set({ authError }),
      setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
      setPatientView: (patientView) => set({ patientView }),
      selectPatient: (selectedPatientId) => set({ selectedPatientId }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled })
    }),
    {
      name: "raga-health-care-store",
      partialize: (state) => ({
        session: state.session,
        patientView: state.patientView,
        selectedPatientId: state.selectedPatientId,
        notificationsEnabled: state.notificationsEnabled
      })
    }
  )
);
