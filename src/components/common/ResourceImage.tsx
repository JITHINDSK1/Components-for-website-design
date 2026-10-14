import React, { useState, useEffect } from 'react';
import { Layers, Terminal, Globe, Folder, ImageOff } from 'lucide-react';
import { ResourceType } from '../../types/resource';
import { imageDB } from '../../lib/image-db';

interface ResourceImageProps {
  src?: string;
  alt: string;
  type?: ResourceType;
  className?: string;
  aspectClass?: string;
}

export const ResourceImage: React.FC<ResourceImageProps> = ({
  src,
  alt,
  type = 'component',
  className = 'w-full h-full object-cover',
  aspectClass = 'h-48 w-full',
}) => {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setHasError(false);

    if (!src) {
      setResolvedUrl(null);
      return;
    }

    if (src.startsWith('idb:')) {
      setIsLoading(true);
      imageDB
        .getImage(src)
        .then((url) => {
          if (isMounted) {
            setResolvedUrl(url);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setHasError(true);
            setIsLoading(false);
          }
        });
    } else {
      setResolvedUrl(src);
    }

    return () => {
      isMounted = false;
    };
  }, [src]);

  const renderPlaceholder = () => {
    const getPlaceholderContent = () => {
      switch (type) {
        case 'component':
          return {
            icon: Layers,
            label: 'Component Reference',
            bg: 'from-blue-950/20 via-zinc-900 to-zinc-950',
            accent: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
          };
        case 'prompt':
          return {
            icon: Terminal,
            label: 'AI Prompt',
            bg: 'from-amber-950/20 via-zinc-900 to-zinc-950',
            accent: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
          };
        case 'website':
          return {
            icon: Globe,
            label: 'Website Bookmark',
            bg: 'from-indigo-950/20 via-zinc-900 to-zinc-950',
            accent: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
          };
        default:
          return {
            icon: Folder,
            label: 'Saved Resource',
            bg: 'from-zinc-900 via-zinc-900 to-zinc-950',
            accent: 'text-zinc-400 border-zinc-700/30 bg-zinc-800/40',
          };
      }
    };

    const config = getPlaceholderContent();
    const Icon = hasError ? ImageOff : config.icon;

    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br ${config.bg} relative overflow-hidden select-none border-b border-[#242428]`}
      >
        {/* Subtle geometric pattern in background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        />
        <div className={`p-3 rounded-xl border ${config.accent} mb-2 shadow-inner z-10`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-medium text-zinc-400 tracking-wide z-10 font-mono">
          {hasError ? 'Preview Unavailable' : config.label}
        </span>
      </div>
    );
  };

  if (!resolvedUrl || hasError) {
    return <div className={`relative overflow-hidden ${aspectClass}`}>{renderPlaceholder()}</div>;
  }

  return (
    <div className={`relative overflow-hidden bg-[#101012] ${aspectClass}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 z-10">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={resolvedUrl}
        alt={alt}
        className={className}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
};
