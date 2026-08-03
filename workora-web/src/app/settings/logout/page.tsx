import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function LogoutConfirmationPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="logout_confirmation" status={status} />;
}
