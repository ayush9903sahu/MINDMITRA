import { apiRequest } from "./api";
import {
  GetProfileResponse,
  UpdateProfileInput,
  UpdateProfileResponse,
  UploadAvatarResponse,
} from "../../../shared/types/profile.types";
import { PROFILE_ROUTES } from "../../../shared/constants/profile.constants";

export async function fetchProfile(): Promise<GetProfileResponse> {
  return apiRequest<GetProfileResponse>(PROFILE_ROUTES.base, {
    method: "GET",
  });
}

export async function saveProfile(input: UpdateProfileInput): Promise<UpdateProfileResponse> {
  return apiRequest<UpdateProfileResponse>(PROFILE_ROUTES.base, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function uploadAvatar(file: File): Promise<UploadAvatarResponse> {
  const formData = new FormData();
  formData.append("avatar", file);

  return apiRequest<UploadAvatarResponse>(PROFILE_ROUTES.avatar, {
    method: "POST",
    body: formData,
    headers: {}, // override apiRequest's default Content-Type so the browser sets the multipart boundary itself
  });
}

export async function removeAvatar(): Promise<void> {
  await apiRequest<void>(PROFILE_ROUTES.avatar, {
    method: "DELETE",
  });
}

export function avatarUrl(updatedAt?: string | null): string {
  const base = `${import.meta.env.VITE_API_BASE_URL ?? ""}${PROFILE_ROUTES.avatar}`;
  return updatedAt ? `${base}?v=${encodeURIComponent(updatedAt)}` : base;
}