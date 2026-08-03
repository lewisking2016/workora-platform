import { AuthStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function MagicLinkConfirmationPage() {
  const status = await loadSystemStatus();

  return <AuthStateScreen state="magic_link_confirmation" status={status} />;
}
