import {
  LineChart,
  Line,
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

import type { Load, Carrier, Broker, Driver, Invoice } from "@/types";
import { formatCurrency, calcProfit } from "@/utils/format";
import KPICard from "@/components/ui/KPICard";
import { ChartCard, ChartTooltip } from "@/components/ui/ChartCard";
import TableShell from "@/components/ui/TableShell";
import Badge from "@/components/ui/Badge";
import { monthlyChartData, activityFeed } from "@/data/seed";
import { findById } from "@/utils/format";

interface DashboardProps {
  loads: Load[];
  carriers: Carrier[];
  brokers: Broker[];
  drivers: Driver[];
  invoices: Invoice[];
}

const STATUS_PIE_COLORS = {
  Delivered: "#22c55e",
  "In Transit": "#38bdf8",
  Pending: "#fb923c",
  Cancelled: "#ef4444",
};

const LOAD_TABLE_HEADERS = [
  "Load #",
  "Broker",
  "Carrier",
  "Route",
  "Rate",
  "Profit",
  "Margin",
  "Status",
];

export default function Dashboard({
  loads,
  carriers,
  brokers,
  drivers,
  invoices,
}: DashboardProps) {
  const totalRevenue = loads.reduce((sum, l) => sum + l.rate, 0);
  const totalProfit = loads.reduce(
    (sum, l) => sum + calcProfit(l.rate, l.pay),
    0,
  );
  const avgMargin =
    totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0.0";
  const activeCarriers = carriers.filter((c) => c.status === "Active").length;
  const activeDrivers = drivers.filter((d) => d.status === "Active").length;
  const outstanding = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((s, i) => s + i.amount, 0);
  const rollingLoads = loads.filter((l) => l.status === "In Transit").length;
  const pendingLoads = loads.filter((l) => l.status === "Pending").length;

  const pieData = (
    ["Delivered", "In Transit", "Pending", "Cancelled"] as const
  ).map((status) => ({
    name: status,
    value: loads.filter((l) => l.status === status).length,
    fill: STATUS_PIE_COLORS[status],
  }));

  const recentLoads = [...loads].slice(-6).reverse();

  return (
    <div className="dashboard fade-in">
      <div className="kpi-grid">
        <KPICard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          sub={`${loads.length} total loads`}
          accent
          icon="💰"
        />
        <KPICard
          label="Net Profit"
          value={formatCurrency(totalProfit)}
          sub={`${avgMargin}% avg margin`}
          icon="📈"
        />
        <KPICard
          label="Active Loads"
          value={rollingLoads + pendingLoads}
          sub={`${rollingLoads} rolling · ${pendingLoads} booked`}
          icon="🚛"
        />
        <KPICard
          label="Fleet"
          value={`${activeCarriers}C / ${activeDrivers}D`}
          sub="active carriers & drivers"
          icon="👥"
        />
        <KPICard
          label="Outstanding A/R"
          value={formatCurrency(outstanding)}
          sub="not yet collected"
          icon="📄"
        />
      </div>

      <div className="charts-row">
        <ChartCard title="Revenue vs Profit — Last 6 Months">
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--text-sub)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fill: "var(--text-sub)",
                  fontSize: 10,
                  fontFamily: "JetBrains Mono, monospace",
                }}
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
                dot={{ r: 4, fill: "var(--clr-accent)" }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="var(--clr-success)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--clr-success)" }}
                strokeDasharray="4 2"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Load Status">
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={55}
                paddingAngle={3}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="status-pie__legend">
            {pieData.map((entry) => (
              <div key={entry.name} className="status-pie__row">
                <div className="status-pie__label">
                  <span
                    className="status-pie__dot"
                    style={{ background: entry.fill }}
                  />
                  {entry.name}
                </div>
                <span className="status-pie__count ff-mono">{entry.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <TableShell headers={LOAD_TABLE_HEADERS}>
        {recentLoads.map((load) => {
          const profit = calcProfit(load.rate, load.pay);
          const margin =
            load.rate > 0 ? ((profit / load.rate) * 100).toFixed(1) : "0.0";
          const broker = findById(brokers, load.bid);
          const carrier = findById(carriers, load.cid);
          return (
            <tr key={load.id}>
              <td
                style={{ padding: "11px 14px" }}
                className="ff-mono fz-12 tc-accent fw-600"
              >
                {load.num}
              </td>
              <td style={{ padding: "11px 14px", fontSize: 13 }}>
                {broker?.name ?? "—"}
              </td>
              <td
                style={{ padding: "11px 14px", fontSize: 13 }}
                className="tc-sub"
              >
                {carrier?.name ?? "—"}
              </td>
              <td
                style={{ padding: "11px 14px", fontSize: 12 }}
                className="tc-sub"
              >
                {load.oCity}, {load.oSt} → {load.dCity}, {load.dSt}
              </td>
              <td style={{ padding: "11px 14px" }} className="ff-mono fz-13">
                {formatCurrency(load.rate)}
              </td>
              <td
                style={{ padding: "11px 14px" }}
                className={`ff-mono fz-13 fw-600 ${profit >= 0 ? "tc-success" : "tc-danger"}`}
              >
                {formatCurrency(profit)}
              </td>
              <td
                style={{
                  padding: "11px 14px",
                  fontSize: 12,
                  fontFamily: "JetBrains Mono, monospace",
                  color:
                    Number(margin) >= 20
                      ? "var(--clr-success)"
                      : Number(margin) >= 10
                        ? "var(--clr-warn)"
                        : "var(--clr-danger)",
                }}
              >
                {margin}%
              </td>
              <td style={{ padding: "11px 14px" }}>
                <Badge value={load.status} />
              </td>
            </tr>
          );
        })}
      </TableShell>

      <ChartCard title="Recent Activity">
        {activityFeed.map((item) => (
          <div key={item.id} className="activity-item">
            <span
              className="activity-dot"
              style={{
                background: item.dot,
                boxShadow: `0 0 6px ${item.dot}99`,
              }}
            />
            <span className="activity-msg">{item.msg}</span>
            <span className="activity-time">{item.time}</span>
          </div>
        ))}
      </ChartCard>
    </div>
  );
}
