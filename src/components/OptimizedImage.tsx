"use client";

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  fill = false,
  priority = false,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  // Compute allowed host status synchronously during render to avoid cascading state updates
  const isUnsplashOrAllowed = (() => {
    if (!src) return true;
    try {
      if (src.startsWith('/') || src.startsWith('data:')) {
        return true;
      }
      const url = new URL(src);
      const host = url.hostname;
      return (
        host === 'images.unsplash.com' || 
        host === 'illustrations.popsy.co' || 
        host.endsWith('.supabase.co')
      );
    } catch {
      // Relative path or invalid URL fallback
      return true;
    }
  })();

  const fallbackImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';

  if (error || !src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={fallbackImage}
        alt={alt}
        className={className}
        style={fill ? { objectFit: 'cover', width: '100%', height: '100%' } : undefined}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={!fill ? width || 300 : undefined}
      height={!fill ? height || 300 : undefined}
      fill={fill}
      priority={priority}
      unoptimized={!isUnsplashOrAllowed}
      onError={() => setError(true)}
      style={fill ? { objectFit: 'cover' } : undefined}
    />
  );
}
