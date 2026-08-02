export interface CurrentUser {
  id: string;
  username: string;
  role: string;
}

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

export function clearLegacySession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('workora_user');
  window.localStorage.removeItem('workora_username');
  window.localStorage.removeItem('workora_role');
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      if (res.status === 401) {
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

export function persistLegacySession(user: CurrentUser) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('workora_user', JSON.stringify(user));
  window.localStorage.setItem('workora_username', user.username);
  window.localStorage.setItem('workora_role', user.role);
}
