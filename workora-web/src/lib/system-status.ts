export interface SystemStatus {
  healthy: boolean;
  service: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  checkedAt: string;
}

const FALLBACK_BASE_URL = 'http://localhost:3001';

function getBackendBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_URL || FALLBACK_BASE_URL;
  return value === 'base' ? 'http://4.221.170.153:3001' : value;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${getBackendBaseUrl()}${path}`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function loadSystemStatus(): Promise<SystemStatus> {
  const [health, settings] = await Promise.all([
    fetchJson<{ status?: string; service?: string }>('/health'),
    fetchJson<Record<string, unknown>>('/settings'),
  ]);

  const maintenanceValue = settings?.maintenance_mode;
  const maintenanceMessageValue = settings?.maintenance_message;

  return {
    healthy: Boolean(health?.status === 'ok'),
    service: health?.service || 'workora-backend',
    maintenanceMode: maintenanceValue === true || maintenanceValue === 'true',
    maintenanceMessage: typeof maintenanceMessageValue === 'string' ? maintenanceMessageValue : '',
    checkedAt: new Date().toISOString(),
  };
}
