import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ScoreHistoryPoint } from "../../types/progress";
import { formatDate, describeScoreChange } from "../../utils/formatters";
import { ProgressEmptyState } from "./ProgressEmptyState";

interface ScoreHistoryChartProps {
  gameName: string;
  history: ScoreHistoryPoint[];
}

export function ScoreHistoryChart({
  gameName,
  history,
}: ScoreHistoryChartProps) {
  const chartData = history.map((point) => ({
    ...point,
    label: formatDate(point.completedAt),
  }));

  const changeSummary =
    history.length >= 2
      ? describeScoreChange(
          history[history.length - 2].score,
          history[history.length - 1].score,
        )
      : null;

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-800">
        Score history — {gameName}
      </h3>
      <p className="mt-1 text-base text-slate-500">
        Your game score for each completed session, in order. This reflects
        performance on this exercise, not a medical measurement.
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        {history.length === 0 ? (
          <ProgressEmptyState
            title="Not enough sessions yet"
            description="Complete this exercise a few more times to see your score history."
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
              aria-label={`Line chart of game score over time for ${gameName}`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 13, fill: "#475569" }} />
                  <YAxis
                    tick={{ fontSize: 13, fill: "#475569" }}
                    label={{
                      value: "Score",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 13, fill: "#475569" },
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}`, "Score"]}
                    contentStyle={{ fontSize: 13 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <table className="sr-only">
              <caption>Score history for {gameName}</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Score</th>
                  <th scope="col">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((point) => (
                  <tr key={point.sessionId}>
                    <td>{point.label}</td>
                    <td>{point.score}</td>
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
