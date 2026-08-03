import { redirect } from 'next/navigation';
import { MessageStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

const KNOWN_STATES = new Set([
  'loading',
  'conversations',
  'conversation-detail',
  'new-conversation',
  'new-message',
  'reply-composer',
  'message-edit',
  'message-delete',
  'message-read',
  'message-unread',
  'message-delivered',
  'message-failed',
  'message-retry',
  'attachments',
  'voice-note',
  'media-preview',
  'search',
  'pinned',
  'archived',
  'muted',
  'blocked',
  'no-conversation',
]);

const toState = (slug: string) => slug.replace(/_/g, '-');

export default async function MessageScreenPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, status] = await Promise.all([params, loadSystemStatus()]);
  const state = toState(slug);

  if (!KNOWN_STATES.has(state)) {
    redirect(`/dashboard/messages?conversation=${encodeURIComponent(slug)}`);
  }

  return (
    <MessageStateScreen
      state={state as never}
      status={status}
      primaryHref="/dashboard/messages"
      primaryLabel="Open messages"
    />
  );
}
