import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function TwoFactorChallengePage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="two_factor_challenge" status={status} />;
}
