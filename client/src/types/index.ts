export type { SafeUser, RegisterRequestBody, LoginRequestBody, AuthResponse, ApiErrorResponse } from "./auth.types";
export type { Profile, UpdateProfileInput, ProfileValidationError, GetProfileResponse, UpdateProfileResponse, UploadAvatarResponse } from "./profile.types";
export { Gender } from "./profile.types";
export type { Difficulty, GameCategory, GameConfig, GameSummary } from "./game";
export interface NavItem { label:string; path:string; icon:string; }
