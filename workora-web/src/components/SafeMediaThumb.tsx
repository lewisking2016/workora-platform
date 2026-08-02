'use client';

import React, { useState } from 'react';
import { FALLBACK_MEDIA_DATA_URI, resolveMediaUrl } from '@/lib/media';

interface SafeMediaThumbProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function SafeMediaThumb({ src, alt, className = '' }: SafeMediaThumbProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = !hasError && src ? resolveMediaUrl(src) : FALLBACK_MEDIA_DATA_URI;

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
