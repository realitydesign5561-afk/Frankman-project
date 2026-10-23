import React, { useState } from 'react';
import { Armchair, Tv } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackCategory?: 'furniture' | 'electronics' | 'general';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Frankman Product',
  fallbackCategory = 'general',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        {fallbackCategory === 'electronics' ? (
          <Tv className="w-8 h-8 stroke-[1.5] text-stone-400 mb-1" />
        ) : (
          <Armchair className="w-8 h-8 stroke-[1.5] text-stone-400 mb-1" />
        )}
        <span className="text-[11px] font-medium tracking-wider uppercase text-stone-500 line-clamp-1 text-center">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-100 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  );
};
