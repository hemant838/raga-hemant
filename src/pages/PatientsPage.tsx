import { useMemo, useState } from "react";

import { ViewToggle } from "../components/ViewToggle";
import { PatientGridCard } from "../components/patients/PatientGridCard";
import { PatientListRow } from "../components/patients/PatientListRow";
import { useAppStore } from "../store/useAppStore";

export default function PatientsPage(): JSX.Element {
  const patients = useAppStore((state) => state.patients);
  const patientView = useAppStore((state) => state.patientView);
  const setPatientView = useAppStore((state) => state.setPatientView);
  const selectedPatientId = useAppStore((state) => state.selectedPatientId);
  const selectPatient = useAppStore((state) => state.selectPatient);

  const [query, setQuery] = useState("");

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return patients;
    }

    return patients.filter((patient) =>
      [patient.name, patient.diagnosis, patient.assignedDoctor, patient.room]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [patients, query]);

  const selectedPatient =
    filteredPatients.find((patient) => patient.id === selectedPatientId) ?? filteredPatients[0] ?? null;

  return (
    <section className="page-content">
      <div className="toolbar">
        <label className="search-field">
          <span>Search patients</span>
          <input
            type="search"
            placeholder="Search name, diagnosis, doctor, or room"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <ViewToggle
          value={patientView}
          onChange={setPatientView}
        />
      </div>

      <div className="patients-layout">
        <div className="patients-list-panel">
          {patientView === "grid" ? (
            <div className="patients-grid">
              {filteredPatients.map((patient) => (
                <PatientGridCard
                  key={patient.id}
                  patient={patient}
                  selected={patient.id === selectedPatient?.id}
                  onSelect={() => selectPatient(patient.id)}
                />
              ))}
            </div>
          ) : (
            <div className="patients-table">
              <div className="patient-list-head">
                <span>Name</span>
                <span>Diagnosis</span>
                <span>Next visit</span>
                <span>Status</span>
                <span>Risk</span>
              </div>
              {filteredPatients.map((patient) => (
                <PatientListRow
                  key={patient.id}
                  patient={patient}
                  selected={patient.id === selectedPatient?.id}
                  onSelect={() => selectPatient(patient.id)}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="patient-detail-panel">
          {selectedPatient ? (
            <>
              <div className="detail-top">
                <div>
                  <p className="eyebrow">{selectedPatient.room}</p>
                  <h3>{selectedPatient.name}</h3>
                  <span>
                    {selectedPatient.age} years old • {selectedPatient.gender}
                  </span>
                </div>
                <span className={`status-pill ${selectedPatient.riskLevel.toLowerCase()}`}>
                  {selectedPatient.riskLevel} risk
                </span>
              </div>

              <div className="detail-grid">
                <div>
                  <span>Diagnosis</span>
                  <strong>{selectedPatient.diagnosis}</strong>
                </div>
                <div>
                  <span>Assigned doctor</span>
                  <strong>{selectedPatient.assignedDoctor}</strong>
                </div>
                <div>
                  <span>Insurance</span>
                  <strong>{selectedPatient.insurance}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{selectedPatient.status}</strong>
                </div>
              </div>

              <div className="vitals-grid">
                <div>
                  <span>Heart rate</span>
                  <strong>{selectedPatient.heartRate} bpm</strong>
                </div>
                <div>
                  <span>Blood pressure</span>
                  <strong>{selectedPatient.bloodPressure}</strong>
                </div>
                <div>
                  <span>Temperature</span>
                  <strong>{selectedPatient.temperature}</strong>
                </div>
                <div>
                  <span>Adherence</span>
                  <strong>{selectedPatient.adherence}%</strong>
                </div>
              </div>

              <div className="detail-section">
                <p className="eyebrow">Alerts</p>
                <div className="tag-list">
                  {selectedPatient.alerts.map((alert) => (
                    <span
                      key={alert}
                      className="tag"
                    >
                      {alert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <p className="eyebrow">Medications</p>
                <div className="tag-list">
                  {selectedPatient.medications.map((medication) => (
                    <span
                      key={medication}
                      className="tag soft"
                    >
                      {medication}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <p className="eyebrow">Clinical notes</p>
                <p>{selectedPatient.notes}</p>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <strong>No patients found</strong>
              <p>Try a different search term to surface matching patients.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
