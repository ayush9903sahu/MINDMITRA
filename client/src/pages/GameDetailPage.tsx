import { useParams } from "react-router-dom";
import { PagePlaceholder } from "./PagePlaceholder";
  

/** Placeholder — actual game rendering belongs to individual game modules. */
export function GameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <PagePlaceholder title="Game" ownerModule="Games">
      <p className="mt-2 text-sm text-neutral-500">
        Requested game id: <code className="rounded bg-neutral-100 px-1.5 py-0.5">{gameId}</code>
      </p>
    </PagePlaceholder>
  );
}
