export const ROUTES={LOGIN:"/login",REGISTER:"/register",DASHBOARD:"/dashboard",GAMES:"/games",GAME_DETAIL:"/games/:gameId",PROGRESS:"/progress",PROFILE:"/profile",SETTINGS:"/settings"} as const;
export const AUTH_ROUTES={register:"/api/auth/register",login:"/api/auth/login",logout:"/api/auth/logout",me:"/api/auth/me"} as const;
export const PASSWORD_MIN_LENGTH=8;
export const PROFILE_ROUTES={base:"/api/profile",avatar:"/api/profile/avatar"} as const;
export const PROFILE_FIELD_LIMITS={fullName:{min:1,max:100},genderCustom:{max:50},contactEmail:{max:254},addressLine1:{max:200},addressLine2:{max:200},city:{max:100},state:{max:100},postalCode:{max:20},country:{max:100}} as const;
export const GENDER_OPTIONS=[{value:"FEMALE",label:"Female"},{value:"MALE",label:"Male"},{value:"NON_BINARY",label:"Non-binary"},{value:"PREFER_NOT_TO_SAY",label:"Prefer not to say"},{value:"OTHER",label:"Self-describe"}] as const;
export const AVATAR_UPLOAD={maxSizeBytes:5*1024*1024,allowedMimeTypes:["image/jpeg","image/png","image/webp"] as const};
export const PRIMARY_NAV_ITEMS=[{label:"Dashboard",path:ROUTES.DASHBOARD,icon:"LayoutDashboard"},{label:"Games",path:ROUTES.GAMES,icon:"Gamepad2"},{label:"Progress",path:ROUTES.PROGRESS,icon:"ChartNoAxesCombined"},{label:"Profile",path:ROUTES.PROFILE,icon:"UserRound"},{label:"Settings",path:ROUTES.SETTINGS,icon:"Settings"}];
export const gameDetailPath=(id:string)=>`/games/${id}`;
