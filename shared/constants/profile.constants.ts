import { Gender } from "../types/profile.types";

/** Field length limits — enforced identically on client (UX) and server (source of truth). */
export const PROFILE_FIELD_LIMITS = {
  fullName: { min: 1, max: 100 },
  genderCustom: { max: 50 },
  contactEmail: { max: 254 },
  addressLine1: { max: 200 },
  addressLine2: { max: 200 },
  city: { max: 100 },
  state: { max: 100 },
  postalCode: { max: 20 },
  country: { max: 100 },
} as const;

/** Reasonable human age bounds used to sanity-check date of birth. */
export const MIN_AGE_YEARS = 0;
export const MAX_AGE_YEARS = 130;

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: Gender.FEMALE, label: "Female" },
  { value: Gender.MALE, label: "Male" },
  { value: Gender.NON_BINARY, label: "Non-binary" },
  { value: Gender.PREFER_NOT_TO_SAY, label: "Prefer not to say" },
  { value: Gender.OTHER, label: "Self-describe" },
];

export const AVATAR_UPLOAD = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  fieldName: "avatar",
};

export const PROFILE_ROUTES = {
  base: "/api/profile",
  avatar: "/api/profile/avatar",
} as const;
