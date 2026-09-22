// Re-export shared types so the rest of the client imports from one place.
export type { Difficulty, GameCategory, GameConfig, GameState, GameResult, GameSummary } from "@shared/types/game";
export type { PublicUser, Profile } from "@shared/types/user";
export type { ApiResponse, ApiSuccess, ApiError } from "@shared/types/api";

// UI-only types belonging to this module.
export interface NavItem {
  label: string;
  path: string;
  icon: string; // lucide-react icon name, resolved in Sidebar/MobileNav
}
