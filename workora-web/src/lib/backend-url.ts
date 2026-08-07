const DEV_BACKEND_URL = 'http://localhost:3001';
const PROD_BACKEND_URL = 'http://4.221.170.153:3001';

export function getBackendBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) {
    return configured === 'base' ? PROD_BACKEND_URL : configured;
  }

  return process.env.NODE_ENV === 'development' ? DEV_BACKEND_URL : PROD_BACKEND_URL;
}
