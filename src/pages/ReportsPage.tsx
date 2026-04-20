import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import type { Load, Carrier, Broker } from "@/types";
import { formatCurrency, calcProfit } from "@/utils/format";
import KPICard from "@/components/ui/KPICard";
import { ChartCard, ChartTooltip } from "@/components/ui/ChartCard";
import { monthlyChartData } from "@/data/seed";

interface ReportsPageProps {
  loads: Load[];
  carriers: Carrier[];
  brokers: Broker[];
}

const EQUIP_COLORS: Record<string, string> = {
  "Dry Van": "#38bdf8",
  Reefer: "#a78bfa",
  Flatbed: "#fb923c",
  "Step Deck": "#34d399",
  RGN: "#f472b6",
};

export default function ReportsPage({
  loads,
  carriers,
  brokers,
}: ReportsPageProps) {
  const totalRevenue = loads.reduce((s, l) => s + l.rate, 0);
  const totalProfit = loads.reduce((s, l) => s + calcProfit(l.rate, l.pay), 0);
  const avgMargin =
    totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0.0";

  const carrierData = carriers
    .map((c) => ({
      name: c.name.split(" ")[0],
      profit: loads
        .filter((l) => l.cid === c.id)
        .reduce((s, l) => s + calcProfit(l.rate, l.pay), 0),
      loads: loads.filter((l) => l.cid === c.id).length,
    }))
    .filter((c) => c.loads > 0)
    .sort((a, b) => b.profit - a.profit);

  const brokerData = brokers
    .map((b) => ({
      name: b.name.split(" ")[0],
      revenue: loads
        .filter((l) => l.bid === b.id)
        .reduce((s, l) => s + l.rate, 0),
      profit: loads
        .filter((l) => l.bid === b.id)
        .reduce((s, l) => s + calcProfit(l.rate, l.pay), 0),
    }))
    .filter((b) => b.revenue > 0);

  const equipMap = loads.reduce<Record<string, number>>((acc, l) => {
    const equip = carriers.find((c) => c.id === l.cid)?.equip ?? "Other";
    acc[equip] = (acc[equip] ?? 0) + 1;
    return acc;
  }, {});
  const equipData = Object.entries(equipMap).map(([name, value]) => ({
    name,
    value,
    fill: EQUIP_COLORS[name] ?? "#888",
  }));

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div className="kpi-grid">
        <KPICard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          sub="all time"
          accent
        />
        <KPICard
          label="Net Profit"
          value={formatCurrency(totalProfit)}
          sub="all time"
        />
        <KPICard
          label="Avg Margin"
          value={`${avgMargin}%`}
          sub="across all loads"
        />
        <KPICard label="Total Loads" value={loads.length} sub="in system" />
      </div>

      <div className="reports-grid">
        <ChartCard title="Monthly Revenue vs Profit">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--text-sub)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-sub)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="var(--clr-accent)"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="var(--clr-success)"
                strokeWidth={2}
                dot={{ r: 3 }}
                strokeDasharray="4 2"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Profit by Carrier">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={carrierData} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-sub)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-sub)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="profit"
                name="Profit"
                fill="var(--clr-accent)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="reports-grid">
        <ChartCard title="Revenue vs Profit by Broker">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={brokerData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-sub)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-sub)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="var(--clr-info)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="profit"
                name="Profit"
                fill="var(--clr-success)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Loads by Equipment Type">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={equipData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={68}
                paddingAngle={3}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {equipData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="equip-legend">
            {equipData.map((e) => (
              <div key={e.name} className="equip-legend__item">
                <span
                  className="equip-legend__dot"
                  style={{ background: e.fill }}
                />
                {e.name}:{" "}
                <strong style={{ color: "var(--text)", marginLeft: 3 }}>
                  {e.value}
                </strong>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
