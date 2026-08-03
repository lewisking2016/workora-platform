import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function VerifyPhonePage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="verify_phone" status={status} />;
}
