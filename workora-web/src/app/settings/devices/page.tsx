import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function DeviceManagementPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="device_management" status={status} />;
}
