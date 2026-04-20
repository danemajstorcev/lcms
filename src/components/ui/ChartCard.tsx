import { type ReactNode } from 'react';

// ─── Chart card wrapper ───────────────────────────────────────────────────────

interface ChartCardProps {
  title:    string;
  children: ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="chart-card">
      <div className="chart-card__title">{title}</div>
      {children}
    </div>
  );
}

// ─── Shared recharts tooltip ──────────────────────────────────────────────────

interface TooltipPayloadItem {
  color:  string;
  name:   string;
  value:  number;
}

interface ChartTooltipProps {
  active?:  boolean;
  payload?: TooltipPayloadItem[];
  label?:   string;
}

const currencyKeys = ['revenue', 'profit', 'amount'];

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      {label && <div className="chart-tooltip__label">{label}</div>}
      {payload.map((item, i) => {
        const isCurrency = currencyKeys.some((k) => item.name.toLowerCase().includes(k));
        const displayVal = isCurrency
          ? `$${Number(item.value).toLocaleString()}`
          : item.value;

        return (
          <div key={i} className="chart-tooltip__row" style={{ color: item.color }}>
            {item.name}: {displayVal}
          </div>
        );
      })}
    </div>
  );
}
