import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="reset_password" status={status} />;
}
