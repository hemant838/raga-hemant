import type { Patient } from "../../types";

interface PatientListRowProps {
  patient: Patient;
  selected: boolean;
  onSelect: () => void;
}

export const PatientListRow = ({
  patient,
  selected,
  onSelect
}: PatientListRowProps): JSX.Element => (
  <button
    type="button"
    className={selected ? "patient-list-row active" : "patient-list-row"}
    onClick={onSelect}
  >
    <strong>{patient.name}</strong>
    <span>{patient.diagnosis}</span>
    <span>{patient.nextVisit}</span>
    <span>{patient.status}</span>
    <span className={`status-pill ${patient.riskLevel.toLowerCase()}`}>{patient.riskLevel}</span>
  </button>
);
