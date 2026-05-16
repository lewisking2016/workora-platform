'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  House, Briefcase, ChatCircleDots, Bell, MagnifyingGlass,
  PencilSimple, VideoCamera, ChartLineUp, MapPin, Check,
  Moon, Sun, Crown, ShieldCheck, Plus, Trash, GearSix,
  User, Notebook, Certificate, Sparkle, ArrowRight
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';

type Tab = 'overview' | 'profile' | 'portfolio' | 'analytics';

export default function BusinessDashboard() {
  const [isDark, setIsDark] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const [username, setUsername] = useState('Professional');
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '', trade: '', location: '', full_name: '', title: '' });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('workora_username');
    if (stored) setUsername(stored);
    const userStr = localStorage.getItem('workora_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUserId(u.id);
        fetchAll(u.id);
      } catch { /* */ }
    }
  }, []);

  const fetchAll = async (uid: string) => {
    try {
      const res = await fetch(`/api/profile/me/${uid}`);
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setForm({ bio: data.profile.bio || '', trade: data.profile.trade || '', location: data.profile.location || '', full_name: data.profile.full_name || '', title: data.profile.title || '' });
        setSkills(data.skills || []);
        setExperience(data.experience || []);
        setEducation(data.education || []);
        setCerts(data.certifications || []);
        const gRes = await fetch(`/api/gigs/worker/${data.profile.id}`);
        const gData = await gRes.json();
        setGigs(Array.isArray(gData) ? gData : []);
      }
    } catch (e) { console.error(e); }
  };

  const saveProfile = async () => {
    await fetch(`/api/profile/update/${userId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio: form.bio, title: form.title, display_name: form.full_name, location: form.location }),
    });
    setEditing(false);
    fetchAll(userId);
  };

  const addSkill = async () => {
    if (!newSkill.trim() || !profile) return;
    await fetch('/api/profile/skills', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profile.id, skill_name: newSkill, skill_level: 'intermediate' }),
    });
    setNewSkill('');
    fetchAll(userId);
  };

  const deleteSkill = async (id: string) => {
    await fetch(`/api/profile/skills/${id}`, { method: 'DELETE' });
    fetchAll(userId);
  };

  const bg = isDark ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-950';
  const card = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100';
  const muted = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: House },
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'portfolio', label: 'Portfolio', icon: VideoCamera },
    { key: 'analytics', label: 'Analytics', icon: ChartLineUp },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-display ${bg}`}>
      {/* Top Nav */}
      <nav className={`sticky top-0 z-50 border-b shadow-sm transition-colors ${isDark ? 'bg-zinc-900/80 backdrop-blur-xl border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative h-9 w-9"><Image src="/logo/workora_logo.png" alt="W" fill className="object-contain" /></Link>
            <div className="relative hidden md:block">
              <MagnifyingGlass size={14} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input placeholder="Search" className={`h-9 w-[220px] rounded-lg border-none pl-9 pr-4 text-xs font-bold outline-none ${isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-100'}`} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[{ icon: House, label: 'Home' }, { icon: Briefcase, label: 'Jobs' }, { icon: ChatCircleDots, label: 'Messages', badge: 2 }, { icon: Bell, label: 'Alerts', badge: 5 }].map(i => (
              <button key={i.label} className={`flex flex-col items-center px-3 py-1 rounded-lg relative ${muted}`}>
                <div className="relative"><i.icon size={20} />
                  {i.badge && <span className="absolute -top-1 -right-2 h-4 min-w-4 px-0.5 bg-red-500 text-white rounded-full text-[7px] font-black flex items-center justify-center">{i.badge}</span>}
                </div>
                <span className="text-[8px] font-bold mt-0.5 hidden lg:block">{i.label}</span>
              </button>
            ))}
            <div className={`w-px h-6 mx-1 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
            <button onClick={() => setIsDark(!isDark)} className={`px-2 py-1 ${isDark ? 'text-yellow-400' : 'text-zinc-400'}`}>
              {isDark ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
            </button>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-[9px] font-black text-white uppercase">{username.charAt(0)}</div>
          </div>
        </div>
      </nav>

      {/* Tab Bar */}
      <div className={`border-b ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-white/50'} backdrop-blur-sm sticky top-14 z-40`}>
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${tab === t.key ? `border-[#0066FF] ${isDark ? 'text-white' : 'text-zinc-950'}` : `border-transparent ${muted} hover:${isDark ? 'text-white' : 'text-zinc-950'}`}`}>
              <t.icon size={16} weight={tab === t.key ? 'fill' : 'regular'} />{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 pt-6 pb-20">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Gigs', value: profile?.total_gigs || 0, color: 'text-[#0066FF]' },
                  { label: 'Trust Score', value: profile?.trust_score ? Number(profile.trust_score).toFixed(1) : '0.0', color: 'text-emerald-500' },
                  { label: 'Profile Views', value: '14', color: 'text-violet-500' },
                  { label: 'Est. Earnings', value: `KSh ${((profile?.total_gigs || 0) * 2500).toLocaleString()}`, color: 'text-amber-500' },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className={`rounded-2xl border p-5 ${card}`}>
                    <p className={`text-[10px] font-black uppercase tracking-wider ${muted}`}>{s.label}</p>
                    <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
                  </motion.div>
                ))}
              </div>
              {/* Quick Actions */}
              <div className={`rounded-2xl border p-6 ${card}`}>
                <h3 className="text-sm font-black mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Edit Profile', icon: PencilSimple, action: () => setTab('profile') },
                    { label: 'Upload Work', icon: VideoCamera, action: () => setTab('portfolio') },
                    { label: 'View Analytics', icon: ChartLineUp, action: () => setTab('analytics') },
                    { label: 'Settings', icon: GearSix, action: () => {} },
                  ].map(a => (
                    <button key={a.label} onClick={a.action} className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:scale-105 ${isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-zinc-100 hover:bg-zinc-50'}`}>
                      <a.icon size={24} className="text-[#0066FF]" />
                      <span className="text-[10px] font-bold">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Recent Gigs */}
              <div className={`rounded-2xl border p-6 ${card}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black">Recent Portfolio</h3>
                  <button onClick={() => setTab('portfolio')} className="text-[10px] font-bold text-[#0066FF]">View All <ArrowRight size={10} className="inline" /></button>
                </div>
                {gigs.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">{gigs.slice(0, 4).map(g => (
                    <div key={g.id} className="aspect-video rounded-xl bg-zinc-100 overflow-hidden relative">
                      {g.thumbnail_url && <Image src={g.thumbnail_url} alt={g.title} fill className="object-cover" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <p className="text-white text-[10px] font-bold truncate">{g.title}</p>
                      </div>
                    </div>
                  ))}</div>
                ) : (
                  <div className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 ${isDark ? 'border-zinc-800 text-zinc-600' : 'border-zinc-200 text-zinc-300'}`}>
                    <VideoCamera size={28} /><span className="text-[10px] font-bold">No work uploaded yet</span>
                  </div>
                )}
              </div>
            </div>
            {/* Right Sidebar */}
            <div className="space-y-6">
              <div className={`rounded-2xl border overflow-hidden ${card}`}>
                <div className="h-20 bg-gradient-to-r from-[#0066FF] to-[#7000FF]" />
                <div className="px-5 pb-5">
                  <div className="relative -mt-10 mb-3">
                    <div className={`h-16 w-16 rounded-full border-4 shadow-lg flex items-center justify-center ${isDark ? 'bg-zinc-900 border-zinc-900' : 'bg-white border-white'}`}>
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-xl font-black text-white uppercase">{username.charAt(0)}</div>
                    </div>
                  </div>
                  <h3 className="text-sm font-black flex items-center gap-1">{profile?.full_name || username} {profile?.is_verified && <Check size={14} weight="bold" className="text-[#0066FF]" />}</h3>
                  <p className={`text-[10px] font-bold mt-1 ${muted}`}>{profile?.trade || 'Professional'} | {profile?.title || 'Workora Member'}</p>
                  <div className={`flex items-center gap-1 mt-1 text-[9px] font-bold ${muted}`}><MapPin size={10} weight="fill" />{profile?.location || 'Kenya'}</div>
                  <button onClick={() => { setTab('profile'); setEditing(true); }} className="mt-4 h-9 w-full bg-[#0066FF]/10 text-[#0066FF] rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center hover:bg-[#0066FF]/20 transition-colors">
                    <PencilSimple size={12} weight="bold" className="mr-2" />Edit Profile
                  </button>
                </div>
              </div>
              <div className={`rounded-2xl border p-5 ${card}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black">Skills</p>
                  <span className={`text-[10px] font-bold ${muted}`}>{skills.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => <span key={s.id} className={`px-3 py-1 rounded-full text-[10px] font-bold ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>{s.skill_name}</span>)}
                  {skills.length === 0 && <p className={`text-[10px] font-bold ${muted}`}>No skills added</p>}
                </div>
              </div>
              <div className={`rounded-2xl border p-5 ${card}`}>
                <div className="flex items-center justify-between"><p className="text-xs font-black">Promote Your Work</p><Crown size={16} weight="fill" className="text-yellow-500" /></div>
                <p className={`text-[10px] mt-2 font-bold ${muted}`}>Boost visibility for <span className="font-black">KSh 150/week</span></p>
                <button className="mt-3 h-8 w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-black text-[9px] uppercase tracking-widest">Boost Now</button>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className={`rounded-2xl border p-6 ${card}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black">Profile Information</h3>
                {!editing ? <button onClick={() => setEditing(true)} className="h-9 px-5 bg-[#0066FF] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Edit</button>
                  : <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className={`h-9 px-5 rounded-xl text-[10px] font-black uppercase border ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>Cancel</button>
                    <button onClick={saveProfile} className="h-9 px-5 bg-[#0066FF] text-white rounded-xl text-[10px] font-black uppercase">Save</button>
                  </div>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'full_name' },
                  { label: 'Title', key: 'title' },
                  { label: 'Trade / Category', key: 'trade' },
                  { label: 'Location', key: 'location' },
                ].map(f => (
                  <div key={f.key}>
                    <label className={`text-[10px] font-black uppercase tracking-wider ${muted}`}>{f.label}</label>
                    {editing ? <input value={(form as any)[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className={`mt-1 h-10 w-full rounded-xl border px-4 text-sm font-bold outline-none ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200'}`} />
                      : <p className="text-sm font-bold mt-1">{(form as any)[f.key] || '-'}</p>}
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className={`text-[10px] font-black uppercase tracking-wider ${muted}`}>Bio</label>
                  {editing ? <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4}
                    className={`mt-1 w-full rounded-xl border p-4 text-sm font-bold outline-none resize-none ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200'}`} />
                    : <p className={`text-sm font-medium mt-1 leading-relaxed ${muted}`}>{form.bio || 'No bio yet'}</p>}
                </div>
              </div>
            </div>
            {/* Skills */}
            <div className={`rounded-2xl border p-6 ${card}`}>
              <h3 className="text-sm font-black mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map(s => (
                  <span key={s.id} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                    {s.skill_name}
                    <button onClick={() => deleteSkill(s.id)} className="text-red-400 hover:text-red-600 ml-1"><Trash size={12} /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill..."
                  className={`flex-1 h-10 rounded-xl border px-4 text-sm font-bold outline-none ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200'}`}
                  onKeyDown={e => e.key === 'Enter' && addSkill()} />
                <button onClick={addSkill} className="h-10 w-10 bg-[#0066FF] text-white rounded-xl flex items-center justify-center"><Plus size={18} weight="bold" /></button>
              </div>
            </div>
            {/* Experience */}
            <div className={`rounded-2xl border p-6 ${card}`}>
              <h3 className="text-sm font-black mb-4 flex items-center gap-2"><Notebook size={18} />Experience</h3>
              {experience.length > 0 ? experience.map(e => (
                <div key={e.id} className={`p-4 rounded-xl border mb-3 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <p className="text-sm font-black">{e.role_title}</p>
                  <p className={`text-xs font-bold ${muted}`}>{e.company}</p>
                  <p className={`text-[10px] font-bold mt-1 ${muted}`}>{e.start_date} - {e.is_current ? 'Present' : e.end_date}</p>
                </div>
              )) : <p className={`text-xs font-bold ${muted}`}>No experience added yet</p>}
            </div>
            {/* Education */}
            <div className={`rounded-2xl border p-6 ${card}`}>
              <h3 className="text-sm font-black mb-4 flex items-center gap-2"><Sparkle size={18} />Education</h3>
              {education.length > 0 ? education.map(e => (
                <div key={e.id} className={`p-4 rounded-xl border mb-3 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <p className="text-sm font-black">{e.degree}</p>
                  <p className={`text-xs font-bold ${muted}`}>{e.institution}</p>
                </div>
              )) : <p className={`text-xs font-bold ${muted}`}>No education added yet</p>}
            </div>
            {/* Certs */}
            <div className={`rounded-2xl border p-6 ${card}`}>
              <h3 className="text-sm font-black mb-4 flex items-center gap-2"><Certificate size={18} />Certifications</h3>
              {certs.length > 0 ? certs.map(c => (
                <div key={c.id} className={`p-4 rounded-xl border mb-3 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <p className="text-sm font-black">{c.cert_name}</p>
                  <p className={`text-xs font-bold ${muted}`}>{c.issuing_org}</p>
                </div>
              )) : <p className={`text-xs font-bold ${muted}`}>No certifications added yet</p>}
            </div>
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {tab === 'portfolio' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className={`rounded-2xl border p-6 ${card}`}>
              <h3 className="text-lg font-black mb-2">Proof of Work</h3>
              <p className={`text-xs font-bold mb-6 ${muted}`}>Upload videos and photos showcasing your craftsmanship</p>
              {gigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gigs.map(g => (
                    <div key={g.id} className="group aspect-video rounded-2xl bg-zinc-100 overflow-hidden relative border border-zinc-100">
                      {g.thumbnail_url && <Image src={g.thumbnail_url} alt={g.title} fill className="object-cover group-hover:scale-105 transition-transform" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                        <p className="text-white text-xs font-black truncate">{g.title}</p>
                        <p className="text-white/60 text-[9px] font-bold">{g.view_count} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 ${isDark ? 'border-zinc-800 text-zinc-600' : 'border-zinc-200 text-zinc-300'}`}>
                  <VideoCamera size={40} weight="duotone" />
                  <p className="text-xs font-bold">No work uploaded yet</p>
                  <p className={`text-[10px] font-bold ${muted}`}>Upload your first proof-of-work to get discovered</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {tab === 'analytics' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Profile Views', value: '14', change: '+3 this week' },
                { label: 'Search Appearances', value: '42', change: '+12 this week' },
                { label: 'Post Impressions', value: '238', change: '+56 this week' },
                { label: 'Hire Rate', value: '0%', change: 'No hires yet' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl border p-5 ${card}`}>
                  <p className={`text-[10px] font-black uppercase tracking-wider ${muted}`}>{s.label}</p>
                  <p className="text-3xl font-black mt-2">{s.value}</p>
                  <p className="text-[10px] font-bold text-emerald-500 mt-1">{s.change}</p>
                </motion.div>
              ))}
            </div>
            <div className={`rounded-2xl border p-6 ${card}`}>
              <h3 className="text-sm font-black mb-4">Performance Overview</h3>
              <div className={`h-48 rounded-xl flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                <div className="text-center">
                  <ChartLineUp size={40} className={muted} />
                  <p className={`text-xs font-bold mt-2 ${muted}`}>Analytics will populate as you gain traction</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
