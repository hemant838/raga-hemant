interface MetricCardProps {
  label: string;
  value: string;
  delta: string;
  tone?: "teal" | "sand" | "coral";
}

export const MetricCard = ({
  label,
  value,
  delta,
  tone = "teal"
}: MetricCardProps): JSX.Element => (
  <article className={`metric-card tone-${tone}`}>
    <p>{label}</p>
    <h3>{value}</h3>
    <span>{delta}</span>
  </article>
);
