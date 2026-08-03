import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function ChangePasswordPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="change_password" status={status} />;
}
