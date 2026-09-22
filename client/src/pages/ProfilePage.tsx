import { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { ProfileSummaryCard } from "../components/ProfileSummaryCard";
import { EditProfileForm } from "../components/EditProfileForm";
import { AvatarUpload } from "../components/AvatarUpload";
// ASSUMPTION: same component Module 2 uses for its own loading/error states
// on LoginPage/DashboardPage. If Module 2's actual name differs, swap the
// import only.
import { AlertBanner } from "../components/AlertBanner";

/**
 * Rendered at /profile. INTEGRATION: wrap this route with Module 1's shell
 * layout and Module 2's <ProtectedRoute> in App.tsx, e.g.:
 *
 *   <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
 *
 * This page assumes it is never rendered for a logged-out user — it does
 * not itself check auth.
 */
export function ProfilePage() {
  const { profile, isComplete, isLoading, isSaving, loadError, saveError, fieldErrors, save, uploadAvatar, removeAvatar, refetch } =
    useProfile();

  // A user with no saved profile yet goes straight into edit mode — there's
  // nothing to summarize until they've entered something once.
  const [isEditing, setIsEditing] = useState(false);
  const showForm = isEditing || !isComplete;

  async function handleSubmit(input: Parameters<typeof save>[0]) {
    const ok = await save(input);
    if (ok) setIsEditing(false);
    return ok;
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6" aria-labelledby="profile-page-heading">
      <div>
        <h1 id="profile-page-heading" className="text-3xl font-bold text-slate-900">
          Your profile
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          This information is private. Only you can see it — it is never shown to other users.
        </p>
      </div>

      {isLoading && (
        <p role="status" aria-live="polite" className="text-lg text-slate-600">
          Loading your profile…
        </p>
      )}

      {loadError && (
        <div>
          <AlertBanner variant="error" message={loadError} />
          <button
            type="button"
            onClick={refetch}
            className="mt-4 min-h-[48px] rounded-lg border-2 border-slate-300 bg-white px-6 text-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !loadError && (
        <>
          {!isComplete && !isEditing && (
            <AlertBanner variant="info" message="Welcome! Add your details below to complete your profile." />
          )}

          {profile && (
            <section aria-label="Profile photo" className="rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">Profile photo</h2>
              <AvatarUpload currentAvatarUrl={profile.avatarUrl} fullName={profile.fullName} onUpload={uploadAvatar} onRemove={removeAvatar} />
            </section>
          )}

          {showForm ? (
            <section aria-label="Edit profile details" className="rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8">
              <EditProfileForm
                initialProfile={profile}
                isSaving={isSaving}
                saveError={saveError}
                fieldErrors={fieldErrors}
                onSubmit={handleSubmit}
                onCancel={isComplete ? () => setIsEditing(false) : undefined}
              />
            </section>
          ) : (
            profile && <ProfileSummaryCard profile={profile} onEdit={() => setIsEditing(true)} />
          )}
        </>
      )}
    </main>
  );
}
