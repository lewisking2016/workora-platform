export interface CurrentUser {
  id: string;
  username: string;
  role: string;
}

const TOKEN_KEY = 'workora_token';

function readLegacyUser(): CurrentUser | null {
  if (typeof window === 'undefined') return null;

  const userStr = window.localStorage.getItem('workora_user');
  if (!userStr) return null;

  try {
    const parsed = JSON.parse(userStr);
    if (!parsed?.id) return null;

    return {
      id: String(parsed.id),
      username: String(parsed.username || window.localStorage.getItem('workora_username') || ''),
      role: String(parsed.role || window.localStorage.getItem('workora_role') || 'worker'),
    };
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearLegacySession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('workora_user');
  window.localStorage.removeItem('workora_username');
  window.localStorage.removeItem('workora_role');
  window.localStorage.removeItem(TOKEN_KEY);
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const headers: HeadersInit = {};
    const token = getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch('/api/auth/me', {
      credentials: 'include',
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        clearLegacySession();
        return null;
      }

      return readLegacyUser();
    }

    const data = await res.json();
    const user = data?.user;
    if (!user?.id) return readLegacyUser();

    return {
      id: String(user.id),
      username: String(user.username || ''),
      role: String(user.role || 'worker'),
    };
  } catch {
    return readLegacyUser();
  }
}

export function persistLegacySession(user: CurrentUser, token?: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('workora_user', JSON.stringify(user));
  window.localStorage.setItem('workora_username', user.username);
  window.localStorage.setItem('workora_role', user.role);
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}
