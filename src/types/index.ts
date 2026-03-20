export type PatientView = "grid" | "list";
export type RiskLevel = "High" | "Medium" | "Low";
export type AdmissionStatus = "Critical" | "Monitoring" | "Stable" | "Discharged";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  room: string;
  insurance: string;
  riskLevel: RiskLevel;
  status: AdmissionStatus;
  heartRate: number;
  bloodPressure: string;
  temperature: string;
  adherence: number;
  progress: number;
  nextVisit: string;
  lastUpdated: string;
  assignedDoctor: string;
  alerts: string[];
  medications: string[];
  notes: string;
}

export interface InsightPoint {
  label: string;
  value: number;
}
