import { useEffect, useState, useCallback } from "react";
import { fetchWeeklyActivity } from "../services/progressService";
import { ApiError } from "../services/apiClient";
import type { AsyncState, WeeklyActivityPoint } from "../types/progress";

export function useWeeklyActivity(
  weeks = 8,
): AsyncState<WeeklyActivityPoint[]> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<WeeklyActivityPoint[]>>({
    data: null,
    isLoading: true,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetchWeeklyActivity(weeks)
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : "We couldn't load your weekly activity. Please try again.";
        setState({ data: null, isLoading: false, error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [weeks, reloadToken]);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  return { ...state, reload };
}
