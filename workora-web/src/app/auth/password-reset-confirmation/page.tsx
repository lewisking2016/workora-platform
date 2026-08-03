import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function PasswordResetConfirmationPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="password_reset_confirmation" status={status} />;
}
