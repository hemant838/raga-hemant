import { MetricCard } from "../components/MetricCard";
import { recoverySeries, throughputSeries } from "../data/mockPatients";
import { useAppStore } from "../store/useAppStore";

const polylinePoints = throughputSeries
  .map((point, index) => `${index * 55 + 10},${120 - point.value * 1.5}`)
  .join(" ");

export default function AnalyticsPage(): JSX.Element {
  const patients = useAppStore((state) => state.patients);

  const averageAdherence =
    patients.reduce((total, patient) => total + patient.adherence, 0) / patients.length;
  const stablePatients = patients.filter((patient) => patient.status === "Stable").length;

  return (
    <section className="page-content">
      <div className="metrics-grid">
        <MetricCard
          label="Average adherence"
          value={`${Math.round(averageAdherence)}%`}
          delta="+6 pts vs last week"
        />
        <MetricCard
          label="Stable patients"
          value={`${stablePatients}`}
          delta="Ready for next-step planning"
          tone="sand"
        />
        <MetricCard
          label="Escalation trend"
          value="Down 12%"
          delta="Over the last 72 hours"
          tone="coral"
        />
      </div>

      <div className="analytics-grid">
        <article className="panel">
          <p className="eyebrow">Weekly throughput</p>
          <h3>Patient intake and completion volume</h3>
          <svg
            className="line-chart"
            viewBox="0 0 360 140"
            aria-label="Weekly throughput line chart"
          >
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#ff7f50"
                  stopOpacity="0.45"
                />
                <stop
                  offset="100%"
                  stopColor="#ff7f50"
                  stopOpacity="0.02"
                />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="#0d3639"
              strokeWidth="4"
              points={polylinePoints}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <polygon
              fill="url(#chartGradient)"
              points={`10,140 ${polylinePoints} 340,140`}
            />
          </svg>
          <div className="chart-labels">
            {throughputSeries.map((point) => (
              <span key={point.label}>{point.label}</span>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Recovery performance</p>
          <h3>Department-level discharge readiness</h3>
          <div className="bar-stack">
            {recoverySeries.map((item) => (
              <div
                key={item.label}
                className="bar-row"
              >
                <span>{item.label}</span>
                <div className="bar-track">
                  <span
                    className="bar-fill"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel panel-wide">
          <p className="eyebrow">Operational highlights</p>
          <div className="highlights-grid">
            <div>
              <strong>Telemetry drift</strong>
              <p>Cardiac cases show the largest after-hours intervention spike.</p>
            </div>
            <div>
              <strong>Discharge pacing</strong>
              <p>Respiratory cases are trending ahead thanks to stronger therapy adherence.</p>
            </div>
            <div>
              <strong>Clinic ops</strong>
              <p>Maternal care keeps the highest recovery score with the lowest revisit friction.</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
