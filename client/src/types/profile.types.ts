export enum Gender { FEMALE="FEMALE", MALE="MALE", NON_BINARY="NON_BINARY", PREFER_NOT_TO_SAY="PREFER_NOT_TO_SAY", OTHER="OTHER" }
export interface ProfileAddress { addressLine1:string|null; addressLine2:string|null; city:string|null; state:string|null; postalCode:string|null; country:string|null; }
export interface Profile extends ProfileAddress { id:string; userId:string; fullName:string; dateOfBirth:string; age:number; gender:Gender; genderCustom:string|null; contactEmail:string; avatarUrl:string|null; createdAt:string; updatedAt:string; }
export interface GetProfileResponse { profile:Profile|null; isComplete:boolean; }
export interface UpdateProfileInput extends Partial<ProfileAddress> { fullName:string; dateOfBirth:string; gender:Gender; genderCustom?:string|null; contactEmail:string; }
export interface UpdateProfileResponse { profile:Profile; }
export interface UploadAvatarResponse { avatarUrl:string; }
export interface ProfileValidationError { field:keyof UpdateProfileInput|"avatar"; message:string; }
