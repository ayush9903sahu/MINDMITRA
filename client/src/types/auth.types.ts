export interface SafeUser { id: string; email: string; createdAt: string; updatedAt: string; }
export interface RegisterRequestBody { email: string; password: string; passwordConfirmation: string; }
export interface LoginRequestBody { email: string; password: string; }
export interface AuthResponse { user: SafeUser; }
export interface ApiErrorResponse { error: { message: string; fields?: Record<string,string>; }; }
