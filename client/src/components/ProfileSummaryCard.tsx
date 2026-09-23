import { Profile } from "../types/profile.types";
import { GENDER_OPTIONS } from "../constants";
import { avatarUrl } from "../services/profile.service";

interface ProfileSummaryCardProps {
  profile: Profile;
  onEdit: () => void;
}

function formatAddress(profile: Profile): string | null {
  const parts = [
    profile.addressLine1,
    profile.addressLine2,
    [profile.city, profile.state].filter(Boolean).join(", "),
    profile.postalCode,
    profile.country,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function genderLabel(profile: Profile): string {
  if (profile.gender === "OTHER" && profile.genderCustom) return profile.genderCustom;
  return GENDER_OPTIONS.find((o) => o.value === profile.gender)?.label ?? "Not specified";
}

export function ProfileSummaryCard({ profile, onEdit }: ProfileSummaryCardProps) {
  const address = formatAddress(profile);

  return (
    <section
      aria-labelledby="profile-summary-heading"
      className="flex flex-col gap-6 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-slate-200 bg-slate-100 text-3xl font-semibold text-slate-500"
            role="img"
            aria-label={profile.avatarUrl ? `${profile.fullName}'s profile photo` : "No profile photo set"}
          >
            {profile.avatarUrl ? (
              <img src={avatarUrl(profile.updatedAt)} alt="" className="h-full w-full object-cover" />
            ) : (
              <span aria-hidden="true">
                {profile.fullName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0]?.toUpperCase())
                  .join("") || "?"}
              </span>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 id="profile-summary-heading" className="text-2xl font-semibold text-slate-900">
              {profile.fullName}
            </h2>
            <p className="text-lg text-slate-600">
              {profile.age} years old · {genderLabel(profile)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="min-h-[48px] w-full rounded-lg border-2 border-blue-700 bg-white px-6 text-lg font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:w-auto"
        >
          Edit profile
        </button>
      </div>

      <dl className="grid grid-cols-1 gap-4 border-t-2 border-slate-100 pt-6 sm:grid-cols-2">
        <div>
          <dt className="text-base font-medium text-slate-500">Date of birth</dt>
          <dd className="text-lg text-slate-900">{profile.dateOfBirth}</dd>
        </div>
        <div>
          <dt className="text-base font-medium text-slate-500">Contact email</dt>
          <dd className="text-lg text-slate-900">{profile.contactEmail}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-base font-medium text-slate-500">Address</dt>
          <dd className="text-lg text-slate-900">{address ?? "Not provided"}</dd>
        </div>
      </dl>

      <p className="text-base text-slate-500">This information is private and visible only to you.</p>
    </section>
  );
}
