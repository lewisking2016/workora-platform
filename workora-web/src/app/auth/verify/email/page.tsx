import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function VerifyEmailPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="verify_email" status={status} />;
}
