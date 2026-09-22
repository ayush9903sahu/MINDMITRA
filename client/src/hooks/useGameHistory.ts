import { useEffect, useState, useCallback } from "react";
import { fetchGameHistory } from "../services/progressService";
import { ApiError } from "../services/apiClient";
import type { AsyncState, GameHistory } from "../types/progress";

export function useGameHistory(
  gameId: string | null,
): AsyncState<GameHistory> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<GameHistory>>({
    data: null,
    isLoading: false,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!gameId) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    let cancelled = false;
    setState({ data: null, isLoading: true, error: null });

    fetchGameHistory(gameId)
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : "We couldn't load this game's history. Please try again.";
        setState({ data: null, isLoading: false, error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [gameId, reloadToken]);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  return { ...state, reload };
}
