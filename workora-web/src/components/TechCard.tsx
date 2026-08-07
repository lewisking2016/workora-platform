'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TechCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function TechCard({ children, className = '', hover = true, glow = false }: TechCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -4 } : undefined}
      className={`
        relative overflow-hidden
        bg-white border border-zinc-200
        ${hover ? 'transition-all duration-300 hover:shadow-xl hover:border-zinc-300' : ''}
        ${glow ? 'hover:shadow-blue-500/10' : ''}
        ${className}
      `}
      style={{ 
        borderRadius: '16px',
      }}
    >
      {/* Inner glow effect on hover */}
      {glow && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
