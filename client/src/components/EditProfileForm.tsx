import { FormEvent, useState } from "react";
import { Gender, Profile, ProfileValidationError, UpdateProfileInput } from "../../../shared/types/profile.types";
import { GENDER_OPTIONS, PROFILE_FIELD_LIMITS } from "../../../shared/constants/profile.constants";
// ASSUMPTION: Module 2 built these under client/src/components/ — reused
// here rather than re-implemented, per the "reuse shared components" rule.
// If their actual prop names differ from what's used below, the fix is
// local to this file (the props passed to <FormField>/<PrimaryButton>/
// <AlertBanner>), not a redesign of the form itself.
import { FormField } from "./FormField";
import { PrimaryButton } from "./PrimaryButton";
import { AlertBanner } from "./AlertBanner";

interface EditProfileFormProps {
  initialProfile: Profile | null;
  isSaving: boolean;
  saveError: string | null;
  fieldErrors: ProfileValidationError[];
  onSubmit: (input: UpdateProfileInput) => Promise<boolean>;
  onCancel?: () => void;
}

type FormState = {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  genderCustom: string;
  contactEmail: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

function toFormState(profile: Profile | null): FormState {
  return {
    fullName: profile?.fullName ?? "",
    dateOfBirth: profile?.dateOfBirth ?? "",
    gender: profile?.gender ?? Gender.PREFER_NOT_TO_SAY,
    genderCustom: profile?.genderCustom ?? "",
    contactEmail: profile?.contactEmail ?? "",
    addressLine1: profile?.addressLine1 ?? "",
    addressLine2: profile?.addressLine2 ?? "",
    city: profile?.city ?? "",
    state: profile?.state ?? "",
    postalCode: profile?.postalCode ?? "",
    country: profile?.country ?? "",
  };
}

/** Lightweight client-side age preview so the user sees the derived age
 * update live as they pick a date of birth — the server always recomputes
 * and returns the authoritative value; this is UX only. */
function previewAge(dateOfBirth: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime()) || dob.getTime() > Date.now()) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

export function EditProfileForm({ initialProfile, isSaving, saveError, fieldErrors, onSubmit, onCancel }: EditProfileFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initialProfile));
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const errorFor = (field: string): string | undefined =>
    localErrors[field] ?? fieldErrors.find((e) => e.field === field)?.message;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateClientSide(): boolean {
    const errors: Record<string, string> = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required.";
    if (!form.dateOfBirth) errors.dateOfBirth = "Date of birth is required.";
    else if (previewAge(form.dateOfBirth) === null) errors.dateOfBirth = "Enter a valid date that isn't in the future.";
    if (!/^\S+@\S+\.\S+$/.test(form.contactEmail)) errors.contactEmail = "Enter a valid email address.";
    if (form.gender === Gender.OTHER && !form.genderCustom.trim()) {
      errors.genderCustom = "Please describe your gender, or choose a different option.";
    }
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateClientSide()) return;

    const input: UpdateProfileInput = {
      fullName: form.fullName.trim(),
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      genderCustom: form.gender === Gender.OTHER ? form.genderCustom.trim() : null,
      contactEmail: form.contactEmail.trim(),
      addressLine1: form.addressLine1.trim() || undefined,
      addressLine2: form.addressLine2.trim() || undefined,
      city: form.city.trim() || undefined,
      state: form.state.trim() || undefined,
      postalCode: form.postalCode.trim() || undefined,
      country: form.country.trim() || undefined,
    };

    await onSubmit(input);
  }

  const age = previewAge(form.dateOfBirth);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8" aria-describedby={saveError ? "profile-form-error" : undefined}>
      {saveError && (
        <div id="profile-form-error">
          <AlertBanner variant="error" message={saveError} />
        </div>
      )}

      <fieldset className="flex flex-col gap-6">
        <legend className="text-2xl font-semibold text-slate-900">About you</legend>

        <FormField
          label="Full name"
          name="fullName"
          type="text"
          value={form.fullName}
          onChange={(v: string) => update("fullName", v)}
          error={errorFor("fullName")}
          required
          maxLength={PROFILE_FIELD_LIMITS.fullName.max}
          autoComplete="name"
        />

        <div>
          <FormField
            label="Date of birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={(v: string) => update("dateOfBirth", v)}
            error={errorFor("dateOfBirth")}
            required
            max={new Date().toISOString().slice(0, 10)}
          />
          {age !== null && (
            <p className="mt-2 text-lg text-slate-600" aria-live="polite">
              Age: <span className="font-semibold">{age}</span> (calculated automatically)
            </p>
          )}
        </div>

        <div role="radiogroup" aria-labelledby="gender-legend" className="flex flex-col gap-3">
          <span id="gender-legend" className="text-lg font-medium text-slate-900">
            Gender
          </span>
          <div className="flex flex-col gap-3">
            {GENDER_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-lg border-2 border-slate-300 px-4 py-3 text-lg has-[:checked]:border-blue-700 has-[:checked]:bg-blue-50"
              >
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={form.gender === option.value}
                  onChange={() => update("gender", option.value)}
                  className="h-6 w-6"
                />
                {option.label}
              </label>
            ))}
          </div>
          {form.gender === Gender.OTHER && (
            <FormField
              label="Please describe (optional detail shown only to you)"
              name="genderCustom"
              type="text"
              value={form.genderCustom}
              onChange={(v: string) => update("genderCustom", v)}
              error={errorFor("genderCustom")}
              maxLength={PROFILE_FIELD_LIMITS.genderCustom.max}
            />
          )}
        </div>

        <FormField
          label="Contact email"
          name="contactEmail"
          type="email"
          value={form.contactEmail}
          onChange={(v: string) => update("contactEmail", v)}
          error={errorFor("contactEmail")}
          required
          maxLength={PROFILE_FIELD_LIMITS.contactEmail.max}
          autoComplete="email"
          helperText="Used for profile-related contact only — this is separate from your login email."
        />
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="text-2xl font-semibold text-slate-900">Address (optional)</legend>
        <p className="text-base text-slate-600">Only you can see this. It's never shown to other users.</p>

        <FormField
          label="Address line 1"
          name="addressLine1"
          type="text"
          value={form.addressLine1}
          onChange={(v: string) => update("addressLine1", v)}
          error={errorFor("addressLine1")}
          maxLength={PROFILE_FIELD_LIMITS.addressLine1.max}
          autoComplete="address-line1"
        />
        <FormField
          label="Address line 2"
          name="addressLine2"
          type="text"
          value={form.addressLine2}
          onChange={(v: string) => update("addressLine2", v)}
          error={errorFor("addressLine2")}
          maxLength={PROFILE_FIELD_LIMITS.addressLine2.max}
          autoComplete="address-line2"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            label="City"
            name="city"
            type="text"
            value={form.city}
            onChange={(v: string) => update("city", v)}
            error={errorFor("city")}
            maxLength={PROFILE_FIELD_LIMITS.city.max}
            autoComplete="address-level2"
          />
          <FormField
            label="State / province"
            name="state"
            type="text"
            value={form.state}
            onChange={(v: string) => update("state", v)}
            error={errorFor("state")}
            maxLength={PROFILE_FIELD_LIMITS.state.max}
            autoComplete="address-level1"
          />
          <FormField
            label="Postal code"
            name="postalCode"
            type="text"
            value={form.postalCode}
            onChange={(v: string) => update("postalCode", v)}
            error={errorFor("postalCode")}
            maxLength={PROFILE_FIELD_LIMITS.postalCode.max}
            autoComplete="postal-code"
          />
          <FormField
            label="Country"
            name="country"
            type="text"
            value={form.country}
            onChange={(v: string) => update("country", v)}
            error={errorFor("country")}
            maxLength={PROFILE_FIELD_LIMITS.country.max}
            autoComplete="country-name"
          />
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-4">
        <PrimaryButton type="submit" isLoading={isSaving}>
          Save profile
        </PrimaryButton>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[48px] rounded-lg border-2 border-slate-300 bg-white px-6 text-lg font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
