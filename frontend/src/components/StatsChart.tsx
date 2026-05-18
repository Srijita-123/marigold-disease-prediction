import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoryEntry } from "../types";
import "./StatsChart.css";

const COLORS = ["#66bb6a", "#ef5350", "#ffb74d", "#42a5f5", "#ab47bc", "#26a69a", "#8d6e63"];

interface Props {
  history: HistoryEntry[];
}

export default function StatsChart({ history }: Props) {
  const diseaseCounts: Record<string, number> = {};
  let healthy = 0;
  let diseased = 0;

  for (const entry of history) {
    if (entry.is_healthy) healthy++;
    else diseased++;
    const key = entry.prediction.replace("Marigold – ", "");
    diseaseCounts[key] = (diseaseCounts[key] || 0) + 1;
  }

  const pieData = [
    { name: "Healthy", value: healthy },
    { name: "Diseased", value: diseased },
  ].filter((d) => d.value > 0);

  const barData = Object.entries(diseaseCounts).map(([name, count]) => ({ name, count }));

  if (history.length === 0) {
    return (
      <div className="stats-empty">
        <p>No scan data yet. Run predictions to see charts.</p>
      </div>
    );
  }

  return (
    <div className="stats-grid">
      <div className="chart-card">
        <h3>Health overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {barData.length > 0 && (
        <div className="chart-card">
          <h3>Detections by class</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <XAxis type="number" allowDecimals={false} stroke="var(--text-muted)" />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="count" fill="var(--accent)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
