import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyActivityPoint } from "../../types/progress";
import { formatDate } from "../../utils/formatters";
import { ProgressEmptyState } from "./ProgressEmptyState";

interface WeeklyActivityChartProps {
  data: WeeklyActivityPoint[];
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatDate(point.weekStart),
  }));

  const hasActivity = data.some((point) => point.sessionsCount > 0);

  return (
    <section aria-labelledby="weekly-activity-heading">
      <h2
        id="weekly-activity-heading"
        className="text-2xl font-semibold text-slate-800"
      >
        Weekly activity
      </h2>
      <p className="mt-1 text-base text-slate-500">
        Number of exercise sessions completed each week.
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        {!hasActivity ? (
          <ProgressEmptyState
            title="No activity yet this period"
            description="Your weekly session count will appear here once you start practicing."
          />
        ) : (
          <>
            <div className="h-72 w-full" role="img" aria-label="Bar chart of exercise sessions completed per week">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 14, fill: "#475569" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 14, fill: "#475569" }}
                    label={{
                      value: "Sessions",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 14, fill: "#475569" },
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}`, "Sessions"]}
                    contentStyle={{ fontSize: 14 }}
                  />
                  <Bar dataKey="sessionsCount" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Accessible text alternative to the chart, for screen readers */}
            <table className="sr-only">
              <caption>Weekly activity data</caption>
              <thead>
                <tr>
                  <th scope="col">Week of</th>
                  <th scope="col">Sessions</th>
                  <th scope="col">Practice minutes</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((point) => (
                  <tr key={point.weekStart}>
                    <td>{point.label}</td>
                    <td>{point.sessionsCount}</td>
                    <td>{point.practiceMinutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
}
