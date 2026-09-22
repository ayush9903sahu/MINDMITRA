// ASSUMPTION: mirrors Module 2's client/src/services/auth.service.ts, which
// (per the handoff) wraps calls through client/src/services/api.ts — an
// axios instance configured with `baseURL: import.meta.env.VITE_API_BASE_URL`
// and `withCredentials: true` (required so the httpOnly JWT cookie from
// Module 2 is sent on every request). If api.ts exports something with a
// different name or shape, update the single import line below — nothing
// else in this file needs to change.
import { api } from "./api";
import {
  GetProfileResponse,
  UpdateProfileInput,
  UpdateProfileResponse,
  UploadAvatarResponse,
} from "../../../shared/types/profile.types";
import { PROFILE_ROUTES } from "../../../shared/constants/profile.constants";

export async function fetchProfile(): Promise<GetProfileResponse> {
  const { data } = await api.get<GetProfileResponse>(PROFILE_ROUTES.base);
  return data;
}

export async function saveProfile(input: UpdateProfileInput): Promise<UpdateProfileResponse> {
  const { data } = await api.put<UpdateProfileResponse>(PROFILE_ROUTES.base, input);
  return data;
}

export async function uploadAvatar(file: File): Promise<UploadAvatarResponse> {
  const formData = new FormData();
  formData.append("avatar", file);
  // Do not set Content-Type manually — axios/the browser needs to set the
  // multipart boundary itself.
  const { data } = await api.post<UploadAvatarResponse>(`${PROFILE_ROUTES.avatar}`, formData);
  return data;
}

export async function removeAvatar(): Promise<void> {
  await api.delete(PROFILE_ROUTES.avatar);
}

/**
 * Full URL for <img src>. The avatar route is authenticated (not a static
 * file), so the browser must send the auth cookie with the image request —
 * this works automatically as long as VITE_API_BASE_URL's domain shares the
 * cookie's domain/SameSite settings with the rest of the app (same
 * requirement Module 2's cookie auth already has for every other call).
 * A cache-busting query param is appended so the <img> re-fetches after a
 * new upload instead of showing a stale browser-cached image at the same URL.
 */
export function avatarUrl(updatedAt?: string | null): string {
  const base = `${import.meta.env.VITE_API_BASE_URL ?? ""}${PROFILE_ROUTES.avatar}`;
  return updatedAt ? `${base}?v=${encodeURIComponent(updatedAt)}` : base;
}
