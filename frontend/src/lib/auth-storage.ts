import type { AuthResponse, User } from "./api/types";

export const AUTH_STORAGE_KEY = "travel_booking_auth";

export type StoredAuth = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export function saveAuth(auth: AuthResponse) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function getStoredAuth(): StoredAuth | null {
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearAuth() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
