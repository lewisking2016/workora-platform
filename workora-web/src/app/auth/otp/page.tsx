import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function OtpPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="otp_entry" status={status} />;
}
