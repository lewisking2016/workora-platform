'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  CaretLeft, 
  CaretRight
} from '@phosphor-icons/react';

interface BirthdayPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function BirthdayPicker({ value, onChange }: BirthdayPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'days' | 'years'>('days');
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const formatDate = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const handleDateSelect = (day: number) => {
    onChange(formatDate(currentDate.getFullYear(), currentDate.getMonth(), day));
    setIsOpen(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView('days');
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const isSelected = value === formatDate(currentDate.getFullYear(), currentDate.getMonth(), d);
      days.push(
        <button
          key={d}
          onClick={() => handleDateSelect(d)}
          className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
            isSelected 
              ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20' 
              : 'hover:bg-zinc-100 text-zinc-600'
          }`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="relative w-full">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-2 text-left">Birthday</p>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-full rounded-xl bg-zinc-50 border border-zinc-200 px-4 flex items-center justify-between text-zinc-950 hover:bg-white hover:border-[#0066FF] transition-all"
      >
        <span className="font-bold text-sm">{value || 'Select Birth Date'}</span>
        <CalendarIcon size={20} weight="duotone" className="text-zinc-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 z-[100] mt-3 bg-white/90 backdrop-blur-2xl border border-zinc-100 rounded-[32px] p-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] min-w-[320px]"
          >
            {view === 'days' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400">
                    <CaretLeft size={16} weight="bold" />
                  </button>
                  <button 
                    onClick={() => setView('years')}
                    className="font-black text-xs uppercase tracking-widest text-zinc-950 hover:text-[#0066FF] transition-colors flex items-center gap-2"
                  >
                    {currentDate.toLocaleString('default', { month: 'long' })} <span className="bg-zinc-100 px-2 py-1 rounded-md">{currentDate.getFullYear()}</span>
                  </button>
                  <button onClick={() => changeMonth(1)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400">
                    <CaretRight size={16} weight="bold" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-4">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">{day}</div>
                  ))}
                  {renderDays()}
                </div>
              </>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-6">
                   <button onClick={() => setView('days')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0066FF]">
                     <CaretLeft size={14} weight="bold" /> Back to Days
                   </button>
                   <span className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-300">Select Year</span>
                </div>
                <div className="grid grid-cols-3 gap-2 h-64 overflow-y-auto scrollbar-hide p-2">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                        currentDate.getFullYear() === year 
                          ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20' 
                          : 'hover:bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-zinc-50 mt-2">
               <button onClick={() => { onChange(''); setIsOpen(false); }} className="text-[10px] font-black uppercase tracking-widest text-[#0066FF]">Clear</button>
               <button onClick={() => { setCurrentDate(new Date()); setView('days'); }} className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Today</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
