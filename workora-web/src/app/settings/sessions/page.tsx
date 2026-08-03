import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function ActiveSessionsPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="active_sessions" status={status} />;
}
