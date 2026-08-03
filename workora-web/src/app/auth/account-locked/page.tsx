import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function AccountLockedPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="account_locked" status={status} />;
}
