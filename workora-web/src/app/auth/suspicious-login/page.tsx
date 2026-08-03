import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function SuspiciousLoginPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="suspicious_login" status={status} />;
}
