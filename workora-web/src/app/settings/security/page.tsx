import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function SecuritySettingsPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="security_settings" status={status} />;
}
