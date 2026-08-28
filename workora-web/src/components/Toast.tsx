'use client';

import React, { createContext, useCallback, useContext, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, WarningCircle, Info, X } from '@phosphor-icons/react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = nextId++;
      setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
      const timer = setTimeout(() => remove(id), 3000);
      timers.current.set(id, timer);
    },
    [remove],
  );

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={18} weight="fill" className="text-emerald-500" />,
    error: <WarningCircle size={18} weight="fill" className="text-red-500" />,
    info: <Info size={18} weight="fill" className="text-blue-500" />,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none lg:bottom-8">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-black/10 border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-black/30"
            >
              {icons[t.type]}
              <p className="text-sm font-semibold text-zinc-900 dark:text-white max-w-[260px]">{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                className="ml-2 rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X size={14} weight="bold" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
