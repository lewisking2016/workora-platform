import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function AccountDisabledPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="account_disabled" status={status} />;
}
