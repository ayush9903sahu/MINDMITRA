// Shared client route path constants. Import these instead of hardcoding path
// strings so a path only ever needs to change in one place.

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  GAMES: "/games",
  GAME_DETAIL: "/games/:gameId",
  PROGRESS: "/progress",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;

/** Build a concrete /games/:gameId path for a real gameId. */
export function gameDetailPath(gameId: string): string {
  return `/games/${gameId}`;
}
