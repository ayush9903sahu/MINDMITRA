import { GameCard, EmptyState } from "@/components/ui";
import { GameSummary } from "@/types";

// Sample data purely to demonstrate GameCard. The Games module replaces this
// with real data fetched from the server.
const SAMPLE_GAMES: GameSummary[] = [
  {
    game: {
      id: "memory-match",
      name: "Memory Match",
      description: "Flip cards and find matching pairs to exercise short-term memory.",
      category: "memory",
      icon: "Grid3x3",
      supportedDifficulties: ["easy", "medium", "hard"],
    },
    bestScore: 1240,
    lastPlayedAt: new Date().toISOString(),
    completed: true,
  },
  {
    game: {
      id: "word-recall",
      name: "Word Recall",
      description: "Remember and recite a growing list of words to practice recall.",
      category: "language",
      icon: "BookOpenText",
      supportedDifficulties: ["easy", "medium", "hard"],
    },
    bestScore: null,
    lastPlayedAt: null,
    completed: false,
  },
];

export function GamesPage() {
  const hasGames = SAMPLE_GAMES.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">Games</h1>
      {hasGames ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_GAMES.map((summary) => (
            <GameCard key={summary.game.id} summary={summary} />
          ))}
        </div>
      ) : (
        <EmptyState title="No games available yet" description="Check back soon for cognitive exercises." />
      )}
    </div>
  );
}
