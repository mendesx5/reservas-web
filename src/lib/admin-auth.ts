const TOKEN_KEY = "buganville_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function isAdminAuthed(): boolean {
  return getAdminToken() !== null;
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function logoutAdmin() {
  sessionStorage.removeItem(TOKEN_KEY);
}
