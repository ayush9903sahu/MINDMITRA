import { z } from "zod";
import { Gender } from "../../../shared/types/profile.types";
import { MAX_AGE_YEARS, MIN_AGE_YEARS, PROFILE_FIELD_LIMITS } from "../../../shared/constants/profile.constants";
import { computeAge } from "./age";

/**
 * ISO yyyy-mm-dd date-of-birth validation:
 *  - must parse to a real calendar date
 *  - must not be in the future
 *  - derived age must fall within a plausible human range
 * Keeping this as a zod `.refine` (rather than a plain regex) means the
 * error the user sees always matches the actual reason it failed.
 */
const dateOfBirthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Date of birth is not a valid date",
  })
  .refine((value) => new Date(value).getTime() <= Date.now(), {
    message: "Date of birth cannot be in the future",
  })
  .refine(
    (value) => {
      const age = computeAge(new Date(value));
      return age >= MIN_AGE_YEARS && age <= MAX_AGE_YEARS;
    },
    { message: `Date of birth must correspond to an age between ${MIN_AGE_YEARS} and ${MAX_AGE_YEARS}` }
  );

const optionalAddressField = (max: number) =>
  z
    .string()
    .max(max, `Must be ${max} characters or fewer`)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" || v === undefined ? null : v));

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(PROFILE_FIELD_LIMITS.fullName.min, "Full name is required")
      .max(PROFILE_FIELD_LIMITS.fullName.max, `Full name must be ${PROFILE_FIELD_LIMITS.fullName.max} characters or fewer`),
    dateOfBirth: dateOfBirthSchema,
    gender: z.nativeEnum(Gender, { errorMap: () => ({ message: "Please select a valid gender option" }) }),
    genderCustom: z
      .string()
      .trim()
      .max(PROFILE_FIELD_LIMITS.genderCustom.max, `Must be ${PROFILE_FIELD_LIMITS.genderCustom.max} characters or fewer`)
      .optional()
      .or(z.literal(""))
      .transform((v) => (v === "" || v === undefined ? null : v)),
    contactEmail: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .max(PROFILE_FIELD_LIMITS.contactEmail.max, "Email is too long"),
    addressLine1: optionalAddressField(PROFILE_FIELD_LIMITS.addressLine1.max),
    addressLine2: optionalAddressField(PROFILE_FIELD_LIMITS.addressLine2.max),
    city: optionalAddressField(PROFILE_FIELD_LIMITS.city.max),
    state: optionalAddressField(PROFILE_FIELD_LIMITS.state.max),
    postalCode: optionalAddressField(PROFILE_FIELD_LIMITS.postalCode.max),
    country: optionalAddressField(PROFILE_FIELD_LIMITS.country.max),
  })
  .superRefine((data, ctx) => {
    if (data.gender === Gender.OTHER && !data.genderCustom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["genderCustom"],
        message: "Please describe your gender, or choose a different option",
      });
    }
  });

export type UpdateProfileParsed = z.infer<typeof updateProfileSchema>;
