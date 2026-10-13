import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Terminal,
  Layers,
  Globe,
  PanelsTopLeft,
  Activity,
  Image as ImageIcon,
  Folder,
  ArrowRight,
  ExternalLink,
  CornerDownLeft,
} from 'lucide-react';
import { Resource, Collection } from '../../types/resource';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  collections: Collection[];
  onSelectResource: (resource: Resource) => void;
  onSelectCollection: (colId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  resources,
  collections,
  onSelectResource,
  onSelectCollection,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown handler for Ctrl+K, Cmd+K, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter matching resources
  const q = query.trim().toLowerCase();
  const matchedResources = q
    ? resources.filter((r) => {
        return (
          r.title.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.promptText?.toLowerCase().includes(q) ||
          r.sourceUrl?.toLowerCase().includes(q) ||
          r.sourceWebsiteName?.toLowerCase().includes(q) ||
          r.notes?.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
    : resources.slice(0, 8); // show recent 8 when empty query

  // Filter matching collections
  const matchedCollections = q
    ? collections.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      )
    : [];

  const allItems: Array<
    | { type: 'resource'; data: Resource }
    | { type: 'collection'; data: Collection }
  > = [
    ...matchedCollections.map((c) => ({ type: 'collection' as const, data: c })),
    ...matchedResources.map((r) => ({ type: 'resource' as const, data: r })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, allItems.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = allItems[selectedIndex];
      if (selected) {
        if (selected.type === 'resource') {
          onSelectResource(selected.data);
        } else {
          onSelectCollection(selected.data.id);
        }
        onClose();
      }
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'prompt':
        return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'component':
        return <Layers className="w-4 h-4 text-blue-400" />;
      case 'website':
        return <Globe className="w-4 h-4 text-purple-400" />;
      case 'template':
        return <PanelsTopLeft className="w-4 h-4 text-emerald-400" />;
      case 'animation':
        return <Activity className="w-4 h-4 text-pink-400" />;
      case 'screenshot':
        return <ImageIcon className="w-4 h-4 text-cyan-400" />;
      default:
        return <Layers className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Command Palette Container */}
      <div className="relative w-full max-w-2xl bg-[#121215] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#242428] bg-[#16161A]">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, component name, prompt, or keyword..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="text-[10px] bg-zinc-900 border border-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              <Search className="w-6 h-6 mx-auto mb-2 opacity-40" />
              <p>No resources found matching &quot;{query}&quot;</p>
              <p className="mt-1 text-[11px] text-zinc-600">
                Try searching by tag, prompt keyword, or source domain
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {matchedCollections.length > 0 && (
                <div className="px-2 pt-2 pb-1 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  Collections ({matchedCollections.length})
                </div>
              )}

              {allItems.map((item, index) => {
                const isSelected = index === selectedIndex;

                if (item.type === 'collection') {
                  const col = item.data;
                  return (
                    <div
                      key={col.id}
                      onClick={() => {
                        onSelectCollection(col.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                        isSelected
                          ? 'bg-blue-600/20 text-white border border-blue-500/30'
                          : 'text-zinc-300 hover:bg-zinc-800/40 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Folder className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="font-semibold truncate">{col.name}</span>
                        <span className="text-[11px] text-zinc-500 truncate max-w-xs">
                          {col.description}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-400 font-mono">
                          <span>Open</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                }

                const res = item.data;
                return (
                  <div
                    key={res.id}
                    onClick={() => {
                      onSelectResource(res);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                      isSelected
                        ? 'bg-blue-600/20 text-white border border-blue-500/30'
                        : 'text-zinc-300 hover:bg-zinc-800/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {getResourceIcon(res.type)}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white truncate">
                            {res.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-400 font-mono uppercase shrink-0">
                            {res.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                          {res.description || res.promptText || res.sourceUrl}
                        </p>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="flex items-center gap-1 text-[10px] text-blue-400 font-mono shrink-0 ml-2">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </div>
                    ) : (
                      res.sourceWebsiteName && (
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0 ml-2">
                          {res.sourceWebsiteName}
                        </span>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#242428] bg-[#0E0E10] text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>{allItems.length} results</span>
        </div>
      </div>
    </div>
  );
};
