import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AccuracyHistoryPoint } from "../../types/progress";
import { formatDate, describeAccuracyChange } from "../../utils/formatters";
import { ProgressEmptyState } from "./ProgressEmptyState";

interface AccuracyHistoryChartProps {
  gameName: string;
  history: AccuracyHistoryPoint[];
}

export function AccuracyHistoryChart({
  gameName,
  history,
}: AccuracyHistoryChartProps) {
  const trackedHistory = history.filter((point) => point.accuracy !== null);

  const chartData = trackedHistory.map((point) => ({
    ...point,
    label: formatDate(point.completedAt),
  }));

  const changeSummary =
    trackedHistory.length >= 2
      ? describeAccuracyChange(
          trackedHistory[trackedHistory.length - 2].accuracy,
          trackedHistory[trackedHistory.length - 1].accuracy,
        )
      : null;

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-800">
        Accuracy history — {gameName}
      </h3>
      <p className="mt-1 text-base text-slate-500">
        The share of correct responses for each session, where this exercise
        tracks accuracy.
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        {trackedHistory.length === 0 ? (
          <ProgressEmptyState
            title="No accuracy data"
            description="This exercise doesn't track accuracy, or you haven't completed enough sessions yet."
          />
        ) : (
          <>
            {changeSummary && (
              <p className="mb-3 text-base font-medium text-slate-700">
                {changeSummary}
              </p>
            )}
            <div
              className="h-64 w-full"
              role="img"
              aria-label={`Line chart of game accuracy over time for ${gameName}`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 13, fill: "#475569" }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 13, fill: "#475569" }}
                    label={{
                      value: "Accuracy (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 13, fill: "#475569" },
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Accuracy"]}
                    contentStyle={{ fontSize: 13 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <table className="sr-only">
              <caption>Accuracy history for {gameName}</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Accuracy</th>
                  <th scope="col">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((point) => (
                  <tr key={point.sessionId}>
                    <td>{point.label}</td>
                    <td>{point.accuracy}%</td>
                    <td>{point.difficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
