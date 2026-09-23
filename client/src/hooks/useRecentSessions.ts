import { useEffect, useState, useCallback } from "react";
import { fetchRecentSessions } from "../services/progressService";
import { ApiError } from "../services/apiClient";
import type { AsyncState, RecentSessionSummary } from "../types/progress";

export function useRecentSessions(
  limit = 10,
): AsyncState<RecentSessionSummary[]> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<RecentSessionSummary[]>>({
    data: null,
    isLoading: true,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetchRecentSessions(limit)
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : "We couldn't load recent activity. Please try again.";
        setState({ data: null, isLoading: false, error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [limit, reloadToken]);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  return { ...state, reload };
}
