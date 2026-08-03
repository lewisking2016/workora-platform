import { SystemStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function OfflinePage() {
  const status = await loadSystemStatus();

  return (
    <SystemStateScreen
      title="Offline"
      description="The app could not reach the backend right now. This page is tied to the live service status so users can retry when the connection comes back."
      primaryHref="/"
      primaryLabel="Retry connection"
      secondaryHref="/login"
      secondaryLabel="Sign in"
      status={status}
      variant="offline"
    />
  );
}
