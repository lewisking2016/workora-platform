'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PaperPlaneTilt, MagnifyingGlass, Check, Checks, ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';

interface Conversation {
  id: string;
  other_username: string;
  other_user_id: string;
  last_message_text: string;
  last_message_at: string;
  unread_count: number;
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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('workora_user');
    const uname = localStorage.getItem('workora_username');
    if (userStr) {
      const u = JSON.parse(userStr);
      setUserId(u.id);
      setUsername(uname || u.username || '');
      fetchConversations(u.id);
    }
  }, []);

  const fetchConversations = async (uid: string) => {
    try {
      const res = await fetch(`/api/messages/conversations/${uid}`);
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const openConversation = async (conv: Conversation) => {
    setActiveConv(conv);
    try {
      const res = await fetch(`/api/messages/${conv.id}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      // Mark as read
      await fetch(`/api/messages/${conv.id}/read`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      fetchConversations(userId);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) { console.error(e); }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeConv) return;
    try {
      const res = await fetch(`/api/messages/${activeConv.id}/send`, {
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
    <div className="h-screen w-full bg-white text-zinc-950 font-display flex overflow-hidden">
      <Sidebar />

      {/* Conversations List */}
      <div className={`${activeConv ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-[360px] h-full border-r border-zinc-100 shrink-0`}>
        <div className="p-5 border-b border-zinc-50">
          <h1 className="text-xl font-black mb-4">Messages</h1>
          <div className="relative">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
              className="h-10 w-full rounded-xl bg-zinc-100 pl-9 pr-4 text-xs font-bold outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length > 0 ? filtered.map(conv => (
            <button key={conv.id} onClick={() => openConversation(conv)}
              className={`w-full flex items-center gap-3 p-4 border-b border-zinc-50 hover:bg-zinc-50 transition-colors text-left ${activeConv?.id === conv.id ? 'bg-zinc-50' : ''}`}>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-white text-sm font-black uppercase shrink-0">
                {conv.other_username?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black truncate">{conv.other_username}</p>
                  <span className="text-[9px] font-bold text-zinc-400 shrink-0">{timeAgo(conv.last_message_at)}</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium truncate">{conv.last_message_text || 'No messages yet'}</p>
              </div>
              {conv.unread_count > 0 && (
                <span className="h-5 min-w-5 px-1 bg-[#0066FF] text-white rounded-full text-[9px] font-black flex items-center justify-center">{conv.unread_count}</span>
              )}
            </button>
          )) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-300 gap-3 p-8">
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
            <div className="flex items-center gap-3 p-4 border-b border-zinc-100 shrink-0">
              <button onClick={() => setActiveConv(null)} className="lg:hidden h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                <ArrowLeft size={18} weight="bold" />
              </button>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-white text-xs font-black uppercase">
                {activeConv.other_username?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-black">{activeConv.other_username}</p>
                <p className="text-[10px] text-zinc-400 font-bold">Workora Member</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => {
                const isMe = msg.sender_id === userId;
                return (
                  <motion.div key={msg.id || i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium ${isMe ? 'bg-[#0066FF] text-white rounded-br-md' : 'bg-zinc-100 text-zinc-950 rounded-bl-md'}`}>
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
            <div className="p-4 border-t border-zinc-100 flex items-center gap-3 shrink-0">
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message..."
                className="flex-1 h-11 rounded-2xl bg-zinc-100 px-4 text-sm font-bold outline-none"
                onKeyDown={e => e.key === 'Enter' && sendMessage()} />
              <button onClick={sendMessage} className="h-11 w-11 bg-[#0066FF] text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-colors shrink-0">
                <PaperPlaneTilt size={20} weight="fill" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-300 gap-3">
            <PaperPlaneTilt size={48} weight="duotone" />
            <p className="text-sm font-bold">Select a conversation</p>
          </div>
        )}
      </div>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl p-4 px-8 flex justify-between items-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <Link href="/dashboard/feed"><span className="text-zinc-400 text-2xl font-black">H</span></Link>
        <Link href="/dashboard/search"><MagnifyingGlass size={28} /></Link>
        <Link href="/dashboard/messages" className="text-[#0066FF]"><PaperPlaneTilt size={28} weight="fill" /></Link>
        <Link href="/dashboard/profile" className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center font-black text-[10px] uppercase">{username?.charAt(0) || 'U'}</Link>
      </nav>
    </div>
  );
}
