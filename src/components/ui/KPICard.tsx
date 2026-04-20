interface KPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  icon?: string;
}

export default function KPICard({
  label,
  value,
  sub,
  accent,
  icon,
}: KPICardProps) {
  return (
    <div className={`kpi-card${accent ? " kpi-card--accent" : ""}`}>
      <div className="kpi-card__header">
        <span className="kpi-card__label">{label}</span>
        {icon && <span className="kpi-card__icon">{icon}</span>}
      </div>
      <div className="kpi-card__value">{value}</div>
      {sub && <div className="kpi-card__sub">{sub}</div>}
    </div>
  );
}
