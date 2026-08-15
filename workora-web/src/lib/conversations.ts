'use client';

import { apiFetch } from '@/lib/session';

/**
 * Start (or reopen) a direct conversation with another user and navigate
 * straight into it. Falls back to the plain inbox if anything fails, so the
 * Message button never dead-ends on an empty "No conversations yet" screen.
 */
export async function openConversationWith(
  otherUserId: string | null | undefined,
  router: { push: (url: string) => void },
  inboxPath = '/dashboard/messages',
) {
  if (!otherUserId) {
    router.push(inboxPath);
    return;
  }
  try {
    const res = await apiFetch('/api/messages/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ other_user_id: otherUserId }),
    });
    if (res.ok) {
      const conv = await res.json();
      router.push(`${inboxPath}?conversation=${conv.id}`);
      return;
    }
  } catch (error) {
    console.error('Failed to open conversation', error);
  }
  router.push(inboxPath);
}
