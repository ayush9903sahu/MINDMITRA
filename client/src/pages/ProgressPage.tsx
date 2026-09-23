<<<<<<< HEAD
import { BarChart3, Info } from "lucide-react";
import { Card, EmptyState } from "../components/ui";
export function ProgressPage(){return <div className="space-y-7" aria-labelledby="progress-title"><header><div className="flex items-center gap-3"><div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700"><BarChart3/></div><div><h1 id="progress-title" className="text-3xl font-bold">Your progress</h1><p className="mt-1 text-slate-600">A simple place for future cognitive activity analytics.</p></div></div></header><div className="grid gap-5 md:grid-cols-3"><Card><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Games played</p><p className="mt-2 text-3xl font-bold">0</p></Card><Card><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Best score</p><p className="mt-2 text-3xl font-bold">—</p></Card><Card><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Completion</p><p className="mt-2 text-3xl font-bold">0%</p></Card></div><Card><div className="flex items-start gap-3"><Info className="mt-1 h-5 w-5 text-brand-600"/><div><h2 className="text-xl font-bold">Analytics placeholder</h2><p className="mt-1 text-slate-600">Real progress data will be connected when the game and progress modules are implemented. No fake user statistics are shown.</p></div></div></Card><EmptyState title="No activity yet" description="Complete a cognitive game session to see progress here."/></div>}
=======
import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { useOverallProgress } from "../hooks/useOverallProgress";
import { useGameProgressList } from "../hooks/useGameProgressList";
import { useRecentSessions } from "../hooks/useRecentSessions";
import { useWeeklyActivity } from "../hooks/useWeeklyActivity";
import { useGameHistory } from "../hooks/useGameHistory";
import { OverallProgressCard } from "../components/progress/OverallProgressCard";
import { GameProgressList } from "../components/progress/GameProgressList";
import { RecentSessionsList } from "../components/progress/RecentSessionsList";
import { WeeklyActivityChart } from "../components/progress/WeeklyActivityChart";
import { GameDetailPanel } from "../components/progress/GameDetailPanel";
import { ProgressLoadingState } from "../components/progress/ProgressLoadingState";
import { ProgressErrorState } from "../components/progress/ProgressErrorState";
import { ProgressEmptyState } from "../components/progress/ProgressEmptyState";

export default function ProgressPage() {
  const overall = useOverallProgress();
  const gameProgress = useGameProgressList();
  const recentSessions = useRecentSessions(10);
  const weeklyActivity = useWeeklyActivity(8);

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const gameHistory = useGameHistory(selectedGameId);

  const gameOptions = useMemo(
    () =>
      (gameProgress.data ?? []).map((game) => ({
        id: game.gameId,
        name: game.gameName,
      })),
    [gameProgress.data],
  );

  const isInitialLoading =
    overall.isLoading ||
    gameProgress.isLoading ||
    recentSessions.isLoading ||
    weeklyActivity.isLoading;

  const firstError =
    overall.error ?? gameProgress.error ?? recentSessions.error ?? weeklyActivity.error;

  const retryAll = () => {
    overall.reload();
    gameProgress.reload();
    recentSessions.reload();
    weeklyActivity.reload();
  };

  const hasAnyData = (overall.data?.totalSessions ?? 0) > 0;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Progress</h1>
        <p className="mt-2 text-lg text-slate-600">
          Track how your cognitive exercise activity and game performance
          have changed over time.
        </p>
      </header>

      <div
        role="note"
        className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
      >
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-base text-amber-900">
          BrainCare tracks your performance on cognitive exercises and
          brain-training activities for your own reference. It is not a
          medical device, and these results do not diagnose, prevent, treat,
          or measure any medical condition. Please talk to a qualified
          healthcare professional about any concerns regarding memory or
          cognitive health.
        </p>
      </div>

      {isInitialLoading && <ProgressLoadingState label="Loading your progress dashboard…" />}

      {!isInitialLoading && firstError && (
        <ProgressErrorState message={firstError} onRetry={retryAll} />
      )}

      {!isInitialLoading && !firstError && !hasAnyData && (
        <ProgressEmptyState
          title="No activity yet"
          description="Play a cognitive exercise to start building your progress dashboard. Your sessions, scores, and activity trends will show up here."
        />
      )}

      {!isInitialLoading && !firstError && hasAnyData && (
        <>
          {overall.data && <OverallProgressCard progress={overall.data} />}

          {weeklyActivity.data && (
            <WeeklyActivityChart data={weeklyActivity.data} />
          )}

          {recentSessions.data && (
            <RecentSessionsList sessions={recentSessions.data} />
          )}

          {gameProgress.data && (
            <GameProgressList
              games={gameProgress.data}
              selectedGameId={selectedGameId}
              onSelectGame={setSelectedGameId}
            />
          )}

          <GameDetailPanel
            games={gameOptions}
            selectedGameId={selectedGameId}
            onSelectGame={setSelectedGameId}
            history={gameHistory.data}
            isLoading={gameHistory.isLoading}
            error={gameHistory.error}
            onRetry={gameHistory.reload}
          />
        </>
      )}
    </div>
  );
}
>>>>>>> 7b85fef4434da6bffc46c17cafcccb1c687613ef
