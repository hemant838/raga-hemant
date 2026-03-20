import type { Patient } from "../../types";

interface PatientGridCardProps {
  patient: Patient;
  selected: boolean;
  onSelect: () => void;
}

export const PatientGridCard = ({
  patient,
  selected,
  onSelect
}: PatientGridCardProps): JSX.Element => (
  <button
    type="button"
    className={selected ? "patient-card active" : "patient-card"}
    onClick={onSelect}
  >
    <div className="patient-card-top">
      <div>
        <p className="eyebrow">{patient.room}</p>
        <h3>{patient.name}</h3>
      </div>
      <span className={`status-pill ${patient.riskLevel.toLowerCase()}`}>{patient.riskLevel}</span>
    </div>

    <p className="patient-diagnosis">{patient.diagnosis}</p>

    <div className="stat-row">
      <div>
        <span>Heart rate</span>
        <strong>{patient.heartRate} bpm</strong>
      </div>
      <div>
        <span>Blood pressure</span>
        <strong>{patient.bloodPressure}</strong>
      </div>
    </div>

    <div className="progress-block">
      <div className="progress-labels">
        <span>Recovery progress</span>
        <strong>{patient.progress}%</strong>
      </div>
      <div className="progress-track">
        <span
          className="progress-fill"
          style={{ width: `${patient.progress}%` }}
        />
      </div>
    </div>

    <footer className="card-footer">
      <span>{patient.assignedDoctor}</span>
      <span>{patient.lastUpdated}</span>
    </footer>
  </button>
);
