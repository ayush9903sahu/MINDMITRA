import { useCallback,useEffect,useState } from "react";
import { fetchProfile,saveProfile,uploadAvatar as uploadAvatarRequest,removeAvatar as removeAvatarRequest } from "../services/profile.service";
import { ApiError } from "../services/api";
import type { Profile,UpdateProfileInput,ProfileValidationError } from "../types/profile.types";

export function useProfile(){
 const [profile,setProfile]=useState<Profile|null>(null); const [isComplete,setIsComplete]=useState(false); const [isLoading,setIsLoading]=useState(true); const [isSaving,setIsSaving]=useState(false); const [loadError,setLoadError]=useState<string|null>(null); const [saveError,setSaveError]=useState<string|null>(null); const [fieldErrors,setFieldErrors]=useState<ProfileValidationError[]>([]);
 const load=useCallback(async()=>{setIsLoading(true);setLoadError(null);try{const res=await fetchProfile();setProfile(res.profile);setIsComplete(res.isComplete)}catch(e){setLoadError(e instanceof ApiError?e.message:"We couldn't load your profile. Please try again.")}finally{setIsLoading(false)}},[]);
 useEffect(()=>{void load()},[load]);
 const save=useCallback(async(input:UpdateProfileInput)=>{setIsSaving(true);setSaveError(null);setFieldErrors([]);try{const res=await saveProfile(input);setProfile(res.profile);setIsComplete(true);return true}catch(e){if(e instanceof ApiError && e.fields){setFieldErrors(Object.entries(e.fields).map(([field,message])=>({field:field as ProfileValidationError["field"],message})));setSaveError("Please fix the highlighted fields.")}else setSaveError(e instanceof ApiError?e.message:"We couldn't save your profile. Please try again.");return false}finally{setIsSaving(false)}},[]);
 const uploadAvatar=useCallback(async(file:File)=>{setSaveError(null);try{const res=await uploadAvatarRequest(file);setProfile(prev=>prev?{...prev,avatarUrl:res.avatarUrl,updatedAt:new Date().toISOString()}:prev);return true}catch(e){setSaveError(e instanceof ApiError?e.message:"We couldn't upload that image. Please try again.");return false}},[]);
 const removeAvatar=useCallback(async()=>{setSaveError(null);try{await removeAvatarRequest();setProfile(prev=>prev?{...prev,avatarUrl:null,updatedAt:new Date().toISOString()}:prev);return true}catch(e){setSaveError(e instanceof ApiError?e.message:"We couldn't remove your photo. Please try again.");return false}},[]);
 return {profile,isComplete,isLoading,isSaving,loadError,saveError,fieldErrors,save,uploadAvatar,removeAvatar,refetch:load};
}
