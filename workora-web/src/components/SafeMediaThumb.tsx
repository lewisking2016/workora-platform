'use client';

import React, { useState } from 'react';
import { APP_CONFIG } from '@/lib/config';

interface SafeMediaThumbProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function SafeMediaThumb({ src, alt, className = '' }: SafeMediaThumbProps) {
  const [hasError, setHasError] = useState(false);
  const fallback = APP_CONFIG.defaults.thumbnail;
  const resolvedSrc = !hasError && src ? src : fallback;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
