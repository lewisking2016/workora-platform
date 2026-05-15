'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { 
  ChatCircleDots, 
  MagnifyingGlass, 
  DotsThreeVertical, 
  PaperPlaneTilt,
  SealCheck,
  Phone,
  VideoCamera,
  Plus
} from '@phosphor-icons/react';

interface Chat {
  id: number;
  name: string;
  lastMsg: string;
  time: string;
  trade: string;
  verified: boolean;
  unread: boolean;
}

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    // Simulate fetching conversations
    setTimeout(() => {
      const sampleChats = [
        { id: 1, name: 'James Kamau', lastMsg: 'I can start the wiring tomorrow morning.', time: '2m', trade: 'Electrician', verified: true, unread: true },
        { id: 2, name: 'Grace Wanjiku', lastMsg: 'The office transformation looks great!', time: '1h', trade: 'Interior Designer', verified: true, unread: false },
        { id: 3, name: 'Brian Kipchoge', lastMsg: 'Sent you the quote for the welding job.', time: '3h', trade: 'Welder', verified: false, unread: false },
        { id: 4, name: 'Faith Akinyi', lastMsg: 'Lunch catering for 10 people confirmed.', time: '5h', trade: 'Chef', verified: true, unread: false },
      ];
      setChats(sampleChats);
      setActiveChat(sampleChats[0]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="h-screen w-full bg-white text-[#1A1A1A] font-display flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-full flex overflow-hidden">
        
        {/* Chats List */}
        <div className="w-full lg:w-[400px] h-full flex flex-col border-r border-zinc-50">
           <div className="p-8 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                 <h1 className="text-2xl font-black tracking-tighter text-zinc-950 uppercase">Messages</h1>
                 <button className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-900 shadow-sm hover:scale-110 transition-transform">
                    <Plus size={20} weight="bold" />
                 </button>
              </div>
              
              <div className="relative">
                 <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                 <input 
                   placeholder="Search messages..." 
                   className="w-full h-12 bg-zinc-50 border border-zinc-100 rounded-xl pl-12 pr-4 text-xs font-bold focus:bg-white outline-none transition-all"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-10 flex flex-col gap-1">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="h-20 w-full bg-zinc-50 animate-pulse rounded-2xl mb-1" />)
              ) : chats.map((chat) => (
                <button 
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all relative ${activeChat?.id === chat.id ? 'bg-zinc-50 shadow-sm' : 'hover:bg-zinc-50/50'}`}
                >
                  <div className="h-14 w-14 rounded-full bg-zinc-100 flex-shrink-0 flex items-center justify-center text-[10px] font-black uppercase border border-zinc-50">
                     {chat.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center justify-between mb-0.5">
                       <p className="text-[14px] font-black text-zinc-900 truncate">
                         {chat.name}
                         {chat.verified && <SealCheck size={14} weight="fill" className="text-[#0066FF] inline ml-1" />}
                       </p>
                       <span className="text-[10px] font-bold text-zinc-300">{chat.time}</span>
                    </div>
                    <p className={`text-[12px] truncate ${chat.unread ? 'font-black text-zinc-900' : 'font-medium text-zinc-400'}`}>
                      {chat.lastMsg}
                    </p>
                  </div>
                  {chat.unread && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#0066FF] rounded-full shadow-[0_0_10px_#0066FF]" />
                  )}
                </button>
              ))}
           </div>
        </div>

        {/* Conversation View */}
        <div className="hidden lg:flex flex-1 h-full flex-col bg-zinc-50/20">
           {activeChat ? (
             <>
               <div className="h-24 px-8 border-b border-zinc-50 bg-white flex items-center justify-between z-10 shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-black uppercase border border-zinc-50">
                        {activeChat.name.charAt(0)}
                     </div>
                     <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                           <span className="text-[15px] font-black text-zinc-950 tracking-tight">{activeChat.name}</span>
                           {activeChat.verified && <SealCheck size={16} weight="fill" className="text-[#0066FF]" />}
                        </div>
                        <p className="text-[10px] font-black text-[#0066FF] uppercase tracking-widest leading-none mt-0.5">{activeChat.trade}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-400">
                     <button className="h-11 w-11 rounded-full hover:bg-zinc-50 flex items-center justify-center transition-all"><Phone size={22} weight="bold" /></button>
                     <button className="h-11 w-11 rounded-full hover:bg-zinc-50 flex items-center justify-center transition-all"><VideoCamera size={22} weight="bold" /></button>
                     <button className="h-11 w-11 rounded-full hover:bg-zinc-50 flex items-center justify-center transition-all"><DotsThreeVertical size={22} weight="bold" /></button>
                  </div>
               </div>

               <div className="flex-1 p-8 overflow-y-auto scrollbar-hide flex flex-col gap-6">
                  {/* Sample Chat Bubbles */}
                  <div className="max-w-[70%] bg-white p-5 rounded-tr-[24px] rounded-br-[24px] rounded-bl-[24px] shadow-sm border border-zinc-50">
                     <p className="text-[14px] font-medium leading-relaxed text-zinc-600">Hi {activeChat.name.split(' ')[0]}, I saw your recent wiring job on the feed. Are you available for a project this weekend?</p>
                  </div>
                  <div className="max-w-[70%] self-end bg-[#0066FF] p-5 rounded-tl-[24px] rounded-br-[24px] rounded-bl-[24px] shadow-xl shadow-blue-500/10">
                     <p className="text-[14px] font-medium leading-relaxed text-white">{activeChat.lastMsg}</p>
                  </div>
                  <div className="text-center">
                     <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest bg-white px-4 py-1 rounded-full border border-zinc-50">Today</span>
                  </div>
               </div>

               <div className="p-8 pt-0">
                  <div className="relative flex items-center gap-4 bg-white p-2 pl-6 rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/20">
                     <input 
                       placeholder={`Message ${activeChat.name.split(' ')[0]}...`}
                       className="flex-1 h-14 text-sm font-bold outline-none"
                     />
                     <button className="h-14 w-14 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                        <PaperPlaneTilt size={26} weight="fill" />
                     </button>
                  </div>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-300">
                <ChatCircleDots size={80} weight="duotone" />
                <p className="text-[10px] font-black uppercase tracking-widest">Select a conversation to start chatting</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
