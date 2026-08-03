import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function SessionExpiredPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="session_expired" status={status} />;
}
