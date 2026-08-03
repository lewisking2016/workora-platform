import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function RecoveryCodePage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="recovery_code" status={status} />;
}
