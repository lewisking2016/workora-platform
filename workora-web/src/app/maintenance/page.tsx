import { SystemStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function MaintenancePage() {
  const status = await loadSystemStatus();

  return (
    <SystemStateScreen
      title="Maintenance mode"
      description="The backend is currently publishing a maintenance state. The screen is live, the message comes from system settings, and users can come back once the service reopens."
      primaryHref="/"
      primaryLabel="Return home"
      secondaryHref="/dashboard"
      secondaryLabel="Open dashboard"
      status={status}
      variant="maintenance"
    />
  );
}
