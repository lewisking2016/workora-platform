'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PaperPlaneTilt, MagnifyingGlass, Check, Checks, ArrowLeft, PushPin, CalendarBlank, BellSlash } from '@phosphor-icons/react';
import { useSearchParams } from 'next/navigation';
import { fetchCurrentUser, apiFetch } from '@/lib/session';

interface Conversation {
  id: string;
  other_username: string;
  other_user_id: string;
  last_message_text: string;
  last_message_at: string;
  unread_count: number;
  is_pinned?: boolean;
  is_archived?: boolean;
  is_muted?: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();
  const initialConversationId = searchParams.get('conversation');
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);

  // Keep a ref of the latest messages so the poller can diff without
  // reading state (and without side effects inside a state updater).
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;

      if (!user) {
        window.location.href = '/login';
        return;
      }

      setUserId(user.id);
      setUsername(user.username || '');
      const nextConversations = await fetchConversations(user.id);
      if (initialConversationId) {
        const match = nextConversations.find((conv) => conv.id === initialConversationId);
        if (match) {
          await openConversation(match, user.id);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const fetchConversations = async (uid: string) => {
    try {
      const res = await apiFetch(`/api/messages/conversations/${uid}`);
      const data = await res.json();
      const nextConversations = Array.isArray(data) ? data : [];
      setConversations(nextConversations);
      return nextConversations as Conversation[];
    } catch (e) { console.error(e); }
    return [] as Conversation[];
  };

  const openConversation = async (conv: Conversation, uid = userId) => {
    setActiveConv(conv);
    try {
      const res = await apiFetch(`/api/messages/${conv.id}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      // Mark as read
      await apiFetch(`/api/messages/${conv.id}/read`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid }),
      });
      fetchConversations(uid);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) { console.error(e); }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeConv) return;
    try {
      const res = await apiFetch(`/api/messages/${activeConv.id}/send`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: userId, text: newMsg }),
      });
      const msg = await res.json();
      setMessages(prev => [...prev, { ...msg, sender_name: username }]);
      setNewMsg('');
      fetchConversations(userId);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) { console.error(e); }
  };

  // Merge a fresh server snapshot into local messages without duplicating ids.
  const mergeMessages = (prev: Message[], next: Message[]) => {
    const seen = new Set(prev.map(m => m.id));
    return [...prev, ...next.filter(m => !seen.has(m.id))];
  };

  // ── Live polling: feel real-time without WebSockets ────────────────
  useEffect(() => {
    if (!activeConv || !userId) return;

    let cancelled = false;
    const lastHeightRef = { current: bottomRef.current?.offsetTop || 0 };

    const pollConversation = async () => {
      // Skip work while the tab is hidden.
      if (document.hidden) return;
      try {
        const res = await apiFetch(`/api/messages/${activeConv.id}`);
        const data = await res.json();
        if (cancelled || !Array.isArray(data)) return;

        const prev = messagesRef.current;
        const newIncoming = data.some(
          m => m.sender_id !== userId && !prev.some(p => p.id === m.id)
        );

        setMessages(mergeMessages(prev, data));

        // If a new incoming message arrived, mark it read and refresh the list.
        if (newIncoming) {
          void apiFetch(`/api/messages/${activeConv.id}/read`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }),
          }).catch(() => undefined);
          void fetchConversations(userId);
        }

        // Auto-scroll only when the user was already at the bottom.
        const el = bottomRef.current;
        if (el && el.offsetTop > lastHeightRef.current && el.parentElement) {
          const container = el.parentElement;
          const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
          if (nearBottom) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
        lastHeightRef.current = bottomRef.current?.offsetTop || lastHeightRef.current;
      } catch {
        // Network blips during polling are expected — stay quiet.
      }
    };

    const pollConversations = async () => {
      if (document.hidden) return;
      await fetchConversations(userId);
    };

    const messagesTimer = window.setInterval(pollConversation, 4000);
    const listTimer = window.setInterval(pollConversations, 15000);
    const onVisible = () => { if (!document.hidden) void pollConversation(); };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(messagesTimer);
      window.clearInterval(listTimer);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConv?.id, userId]);

  const updateConversationState = async (patch: Record<string, boolean>) => {
    if (!activeConv) return;
    try {
      const res = await apiFetch(`/api/messages/conversations/${activeConv.id}/state`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      setConversations(prev => prev.map(conv => conv.id === activeConv.id ? { ...conv, ...data } : conv));
      setActiveConv(prev => prev ? { ...prev, ...data } : prev);
    } catch (error) {
      console.error(error);
    }
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  const filtered = conversations.filter(c => c.other_username?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full h-full flex overflow-hidden">
      {/* Conversations List */}
      <div className={`${activeConv ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-[360px] h-full border-r border-zinc-100 dark:border-zinc-800 shrink-0`}>
        <div className="p-5 border-b border-zinc-50 dark:border-zinc-800">
          <h1 className="text-xl font-black mb-4 text-zinc-950 dark:text-white">Messages</h1>
          <div className="relative">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
              className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 pl-9 pr-4 text-xs font-bold outline-none text-zinc-950 dark:text-white" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length > 0 ? filtered.map(conv => (
            <button key={conv.id} onClick={() => openConversation(conv)}
              className={`w-full flex items-center gap-3 p-4 border-b border-zinc-50 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left ${activeConv?.id === conv.id ? 'bg-zinc-50 dark:bg-zinc-900' : ''}`}>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-white text-sm font-black uppercase shrink-0">
                {conv.other_username?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black truncate text-zinc-950 dark:text-white">{conv.other_username}</p>
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 shrink-0">{timeAgo(conv.last_message_at)}</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium truncate">{conv.last_message_text || 'No messages yet'}</p>
              </div>
              {conv.unread_count > 0 && (
                <span className="h-5 min-w-5 px-1 bg-[#0066FF] text-white rounded-full text-[9px] font-black flex items-center justify-center">{conv.unread_count}</span>
              )}
            </button>
          )) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-300 dark:text-zinc-700 gap-3 p-8">
              <PaperPlaneTilt size={40} weight="duotone" />
              <p className="text-xs font-bold text-center">No conversations yet. Connect with a professional to start chatting.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${activeConv ? 'flex' : 'hidden lg:flex'} flex-col flex-1 h-full`}>
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <button onClick={() => setActiveConv(null)} className="lg:hidden h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-950 dark:text-white">
                <ArrowLeft size={18} weight="bold" />
              </button>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-white text-xs font-black uppercase">
                {activeConv.other_username?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-black text-zinc-950 dark:text-white">{activeConv.other_username}</p>
                <p className="text-[10px] text-zinc-400 font-bold">Workora Member</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => updateConversationState({ is_pinned: !activeConv.is_pinned })}
                  className={`h-9 rounded-xl px-3 text-xs font-black ${activeConv.is_pinned ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'}`}
                >
                  <PushPin size={14} weight="bold" className="inline mr-1" />
                  {activeConv.is_pinned ? 'Pinned' : 'Pin'}
                </button>
                <button
                  onClick={() => updateConversationState({ is_archived: !activeConv.is_archived })}
                  className={`h-9 rounded-xl px-3 text-xs font-black ${activeConv.is_archived ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'}`}
                >
                  <CalendarBlank size={14} weight="bold" className="inline mr-1" />
                  {activeConv.is_archived ? 'Archived' : 'Archive'}
                </button>
                <button
                  onClick={() => updateConversationState({ is_muted: !activeConv.is_muted })}
                  className={`h-9 rounded-xl px-3 text-xs font-black ${activeConv.is_muted ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'}`}
                >
                  <BellSlash size={14} weight="bold" className="inline mr-1" />
                  {activeConv.is_muted ? 'Muted' : 'Mute'}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => {
                const isMe = msg.sender_id === userId;
                return (
                  <motion.div key={msg.id || i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium ${isMe ? 'bg-[#0066FF] text-white rounded-br-md' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white rounded-bl-md'}`}>
                      <p>{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-white/60' : 'text-zinc-400'}`}>
                        <span className="text-[8px] font-bold">{timeAgo(msg.created_at)}</span>
                        {isMe && (msg.is_read ? <Checks size={12} /> : <Check size={12} />)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3 shrink-0">
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message..."
                className="flex-1 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 px-4 text-sm font-bold outline-none text-zinc-950 dark:text-white"
                onKeyDown={e => e.key === 'Enter' && sendMessage()} />
              <button onClick={sendMessage} className="h-11 w-11 bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-2xl flex items-center justify-center hover:brightness-110 transition-all shrink-0">
                <PaperPlaneTilt size={20} weight="fill" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700 gap-3">
            <PaperPlaneTilt size={48} weight="duotone" />
            <p className="text-sm font-bold">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
