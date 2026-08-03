import { NotificationStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

const STATE_MAP: Record<string, Parameters<typeof NotificationStateScreen>[0]['state']> = {
  inbox: 'inbox',
  detail: 'detail',
  settings: 'settings',
  push: 'push_permission',
  permission: 'push_permission',
  empty: 'empty',
  read: 'read',
  unread: 'unread',
  filtered: 'filtered',
  like: 'like',
  comment: 'comment',
  follow: 'follow',
  mention: 'mention',
  message: 'message',
  trust: 'trust_update',
  system: 'system',
};

export default async function NotificationScreenPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, status] = await Promise.all([params, loadSystemStatus()]);
  const state = STATE_MAP[slug] || 'detail';

  return (
    <NotificationStateScreen
      state={state}
      title={slug && !STATE_MAP[slug] ? `Notification detail` : undefined}
      description={slug && !STATE_MAP[slug] ? `Notification ${slug} is available as a live detail state.` : undefined}
      status={status}
      primaryHref={state === 'system' ? '/dashboard' : '/notifications'}
      primaryLabel={state === 'system' ? 'Open dashboard' : 'Open notifications'}
    />
  );
}
