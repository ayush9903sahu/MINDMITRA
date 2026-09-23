import { useEffect, useState, useCallback } from "react";
import { fetchOverallProgress } from "../services/progressService";
import { ApiError } from "../services/apiClient";
import type { AsyncState, OverallProgress } from "../types/progress";

export function useOverallProgress(): AsyncState<OverallProgress> & {
  reload: () => void;
} {
  const [state, setState] = useState<AsyncState<OverallProgress>>({
    data: null,
    isLoading: true,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetchOverallProgress()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : "We couldn't load your overall progress. Please try again.";
        setState({ data: null, isLoading: false, error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  return { ...state, reload };
}
