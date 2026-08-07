'use client';

import React from 'react';

interface MeshBackgroundProps {
  className?: string;
  variant?: 'subtle' | 'prominent' | 'hero';
}

export function MeshBackground({ className = '', variant = 'subtle' }: MeshBackgroundProps) {
  const opacity = {
    subtle: 'opacity-[0.015]',
    prominent: 'opacity-[0.03]',
    hero: 'opacity-[0.05]'
  }[variant];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Square mesh grid */}
      <div 
        className={`absolute inset-0 ${opacity}`}
        style={{
          backgroundImage: `
            linear-gradient(to right, black 1px, transparent 1px),
            linear-gradient(to bottom, black 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Glowing orbs that fade out */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '6s', animationDelay: '2s' }} />
      
      {/* Radial fade to transparent */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/50 to-white" />
    </div>
  );
}
