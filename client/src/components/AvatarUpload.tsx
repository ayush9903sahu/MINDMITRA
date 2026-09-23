import { useRef, useState } from "react";
import { AVATAR_UPLOAD } from "../constants";
import { avatarUrl } from "../services/profile.service";

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  fullName: string;
  onUpload: (file: File) => Promise<boolean>;
  onRemove: () => Promise<boolean>;
}

/**
 * Large tap target, explicit instructions, and a visible text alternative
 * to drag-and-drop (older adults / assistive tech users often find
 * drag-and-drop hard to use) — a plain "Choose photo" button that opens the
 * OS file picker is the primary interaction.
 */
export function AvatarUpload({ currentAvatarUrl, fullName, onUpload, onRemove }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  async function handleFileChosen(file: File) {
    setError(null);

    if (!(AVATAR_UPLOAD.allowedMimeTypes as readonly string[]).includes(file.type)) {
      setError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > AVATAR_UPLOAD.maxSizeBytes) {
      setError(`That image is too large. Please choose one under ${AVATAR_UPLOAD.maxSizeBytes / (1024 * 1024)}MB.`);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsBusy(true);
    setStatus("Uploading photo…");

    const ok = await onUpload(file);

    setIsBusy(false);
    setStatus(ok ? "Profile photo updated." : null);
    if (!ok) {
      setError("We couldn't upload that photo. Please try again.");
      setPreviewUrl(null);
    }
    URL.revokeObjectURL(localPreview);
  }

  async function handleRemove() {
    setIsBusy(true);
    setStatus("Removing photo…");
    const ok = await onRemove();
    setIsBusy(false);
    setPreviewUrl(null);
    setStatus(ok ? "Profile photo removed." : null);
    if (!ok) setError("We couldn't remove your photo. Please try again.");
  }

  const displaySrc = previewUrl ?? (currentAvatarUrl ? avatarUrl() : null);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div
        className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-slate-200 bg-slate-100 text-4xl font-semibold text-slate-500"
        role="img"
        aria-label={displaySrc ? `${fullName}'s profile photo` : "No profile photo set"}
      >
        {displaySrc ? (
          <img src={displaySrc} alt="" className="h-full w-full object-cover" />
        ) : (
          <span aria-hidden="true">{initials || "?"}</span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isBusy}
            className="min-h-[48px] rounded-lg border-2 border-blue-700 bg-white px-5 text-lg font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-60"
          >
            Choose photo
          </button>
          {currentAvatarUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isBusy}
              className="min-h-[48px] rounded-lg border-2 border-slate-300 bg-white px-5 text-lg font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-60"
            >
              Remove photo
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={AVATAR_UPLOAD.allowedMimeTypes.join(",")}
          className="sr-only"
          aria-label="Choose a profile photo"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChosen(file);
            e.target.value = ""; // allow re-selecting the same file later
          }}
        />

        <p className="text-base text-slate-600">JPEG, PNG, or WebP. Up to 5MB.</p>

        {/* Live region: announces status to screen reader users without moving focus */}
        <p role="status" aria-live="polite" className="text-base text-slate-600">
          {status}
        </p>
        {error && (
          <p role="alert" className="text-base font-medium text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
