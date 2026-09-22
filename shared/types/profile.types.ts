/**
 * Shared Profile types — source of truth for both client and server.
 * Mirrors the pattern established by shared/types/auth.types.ts in Module 2.
 *
 * NOTE ON EMAIL: `contactEmail` here is a *display/contact* email that lives
 * on the Profile record. It is intentionally separate from the account's
 * login email (User.email, owned by Module 2 / the auth system). Module 3
 * never reads or writes User.email. This keeps profile edits from ever being
 * able to lock a user out of their own account. contactEmail defaults to the
 * account email at profile-creation time but can be changed independently.
 */

export enum Gender {
  FEMALE = "FEMALE",
  MALE = "MALE",
  NON_BINARY = "NON_BINARY",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
  OTHER = "OTHER",
}

export interface ProfileAddress {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

/** Full profile shape as returned by GET /api/profile (never shared with other users). */
export interface Profile extends ProfileAddress {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string; // ISO date string, e.g. "1954-03-12"
  age: number; // always server-computed from dateOfBirth, never stored
  gender: Gender;
  genderCustom: string | null; // populated only when gender === OTHER
  contactEmail: string;
  avatarUrl: string | null; // relative API path (e.g. "/api/profile/avatar") or null
  createdAt: string;
  updatedAt: string;
}

/** Response envelope for GET /api/profile. `profile` is null until the user completes it once. */
export interface GetProfileResponse {
  profile: Profile | null;
  isComplete: boolean;
}

/** Body accepted by PUT /api/profile. All address fields are optional; everything else required. */
export interface UpdateProfileInput extends Partial<ProfileAddress> {
  fullName: string;
  dateOfBirth: string; // ISO date string (yyyy-mm-dd)
  gender: Gender;
  genderCustom?: string | null;
  contactEmail: string;
}

export interface UpdateProfileResponse {
  profile: Profile;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}

/** Field-level validation error shape, matching Module 2's FormField error contract. */
export interface ProfileValidationError {
  field: keyof UpdateProfileInput | "avatar";
  message: string;
}

export interface ProfileErrorResponse {
  message: string;
  errors?: ProfileValidationError[];
}
