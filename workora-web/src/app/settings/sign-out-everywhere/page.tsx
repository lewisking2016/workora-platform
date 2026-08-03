import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function SignOutEverywherePage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="sign_out_everywhere" status={status} />;
}
