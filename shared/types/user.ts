// Shared user/profile types. Owned by Module 1 (Foundation).
// The Auth module and Profile module must import these rather than redefining them.

export interface PublicUser {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  // passwordHash is intentionally never included in any client-facing type.
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string | null; // ISO date
  age: number | null;
  gender: string | null;
  address: string | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}
