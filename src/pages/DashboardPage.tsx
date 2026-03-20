import { MetricCard } from "../components/MetricCard";
import { requestNotificationAccess, showCareNotification } from "../lib/notifications";
import { useAppStore } from "../store/useAppStore";

export default function DashboardPage(): JSX.Element {
  const patients = useAppStore((state) => state.patients);
  const setNotificationsEnabled = useAppStore((state) => state.setNotificationsEnabled);

  const highRiskPatients = patients.filter((patient) => patient.riskLevel === "High");
  const monitoringPatients = patients.filter((patient) => patient.status === "Monitoring");

  const handleWardAlert = async () => {
    const permission = await requestNotificationAccess();

    if (permission === "granted") {
      setNotificationsEnabled(true);
      await showCareNotification(
        "Ward huddle in 10 minutes",
        "Review telemetry spikes and medication flags before handoff.",
        "/patients"
      );
    }
  };

  return (
    <section className="page-content">
      <div className="metrics-grid">
        <MetricCard
          label="Active patients"
          value={`${patients.length}`}
          delta="+8% this week"
        />
        <MetricCard
          label="High-risk cases"
          value={`${highRiskPatients.length}`}
          delta="2 need escalation"
          tone="coral"
        />
        <MetricCard
          label="Monitoring queue"
          value={`${monitoringPatients.length}`}
          delta="Median wait 14m"
          tone="sand"
        />
      </div>

      <article className="briefing-banner">
        <div className="briefing-copy">
          <p className="eyebrow">Shift briefing</p>
          <h3>Morning throughput is 13% ahead of target while cardiac recovery lags behind baseline.</h3>
        </div>

        <div className="briefing-actions">
          <button
            className="primary-button"
            type="button"
            onClick={handleWardAlert}
          >
            Dispatch ward alert
          </button>
        </div>
      </article>

      <div className="dashboard-grid">
        <article className="panel">
          <p className="eyebrow">Priority patients</p>
          <div className="stack-list">
            {highRiskPatients.map((patient) => (
              <div
                key={patient.id}
                className="stack-item"
              >
                <div>
                  <strong>{patient.name}</strong>
                  <span>{patient.diagnosis}</span>
                </div>
                <div>
                  <strong>{patient.room}</strong>
                  <span>{patient.nextVisit}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Care lane readiness</p>
          <div className="lane-list">
            <div>
              <span>Medication reconciliation</span>
              <strong>78%</strong>
            </div>
            <div>
              <span>Discharge prep</span>
              <strong>64%</strong>
            </div>
            <div>
              <span>Lab follow-up completion</span>
              <strong>82%</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
