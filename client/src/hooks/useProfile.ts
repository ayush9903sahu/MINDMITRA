import { useCallback, useEffect, useState } from "react";
import { fetchProfile, saveProfile, uploadAvatar as uploadAvatarRequest, removeAvatar as removeAvatarRequest } from "../services/profile.service";
import { Profile, UpdateProfileInput, ProfileValidationError } from "../../../shared/types/profile.types";

interface UseProfileResult {
  profile: Profile | null;
  isComplete: boolean;
  isLoading: boolean;
  isSaving: boolean;
  loadError: string | null;
  saveError: string | null;
  fieldErrors: ProfileValidationError[];
  save: (input: UpdateProfileInput) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  removeAvatar: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

/**
 * ASSUMPTION: this hook does not itself check authentication — it expects
 * to be rendered only inside a route already wrapped by Module 2's
 * <ProtectedRoute>, exactly like DashboardPage.tsx is. A 401 from the API
 * (e.g. an expired session) surfaces as `loadError`/`saveError` here; it's
 * <ProtectedRoute>'s job to redirect to /login, not this hook's.
 */
export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ProfileValidationError[]>([]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetchProfile();
      setProfile(res.profile);
      setIsComplete(res.isComplete);
    } catch (err) {
      setLoadError("We couldn't load your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (input: UpdateProfileInput): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(null);
    setFieldErrors([]);
    try {
      const res = await saveProfile(input);
      setProfile(res.profile);
      setIsComplete(true);
      return true;
    } catch (err: any) {
      const apiErrors: ProfileValidationError[] | undefined = err?.response?.data?.errors;
      if (apiErrors?.length) {
        setFieldErrors(apiErrors);
        setSaveError("Please fix the highlighted fields.");
      } else {
        setSaveError("We couldn't save your profile. Please try again.");
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File): Promise<boolean> => {
    setSaveError(null);
    try {
      const res = await uploadAvatarRequest(file);
      setProfile((prev) => (prev ? { ...prev, avatarUrl: res.avatarUrl, updatedAt: new Date().toISOString() } : prev));
      return true;
    } catch (err: any) {
      setSaveError(err?.response?.data?.message ?? "We couldn't upload that image. Please try a different file.");
      return false;
    }
  }, []);

  const removeAvatar = useCallback(async (): Promise<boolean> => {
    setSaveError(null);
    try {
      await removeAvatarRequest();
      setProfile((prev) => (prev ? { ...prev, avatarUrl: null } : prev));
      return true;
    } catch (err) {
      setSaveError("We couldn't remove your photo. Please try again.");
      return false;
    }
  }, []);

  return {
    profile,
    isComplete,
    isLoading,
    isSaving,
    loadError,
    saveError,
    fieldErrors,
    save,
    uploadAvatar,
    removeAvatar,
    refetch: load,
  };
}
