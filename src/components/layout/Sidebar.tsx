import React from 'react';
import {
  Layers,
  Terminal,
  Globe,
  Folder,
  Plus,
  Bookmark,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { FilterCategory } from '../../types/resource';

interface SidebarProps {
  activeFilter: FilterCategory;
  onSelectFilter: (filter: FilterCategory) => void;
  onOpenAddModal: () => void;
  counts: {
    all: number;
    component: number;
    prompt: number;
    website: number;
    other: number;
  };
  onResetDemo: () => void;
  onClearAll: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeFilter,
  onSelectFilter,
  onOpenAddModal,
  counts,
  onResetDemo,
  onClearAll,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: FilterCategory; label: string; icon: any; count: number }[] = [
    { id: 'all', label: 'All Saves', icon: Bookmark, count: counts.all },
    { id: 'component', label: 'Components', icon: Layers, count: counts.component },
    { id: 'prompt', label: 'Prompts', icon: Terminal, count: counts.prompt },
    { id: 'website', label: 'Websites', icon: Globe, count: counts.website },
    { id: 'other', label: 'Other', icon: Folder, count: counts.other },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#101013] border-r border-[#222226] p-4 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-5 pt-1 px-2 border-b border-[#202024]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-sm">
            V
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white">Vault</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">Personal Library</p>
          </div>
        </div>
      </div>

      {/* Primary + Add to Library Button in Sidebar */}
      <div className="py-4">
        <button
          onClick={() => {
            onOpenAddModal();
            onCloseMobile();
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shadow-blue-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Add to Library</span>
        </button>
      </div>

      {/* Navigation Filter Items */}
      <div className="space-y-1 flex-1 py-1">
        <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Library
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectFilter(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#16161A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`}
                />
                <span>{item.label}</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-zinc-800/80 text-zinc-500'
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Controls */}
      <div className="pt-4 border-t border-[#202024] space-y-2">
        <div className="px-2 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Storage</span>
          <span className="font-mono text-zinc-400">{counts.all} saved</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={() => {
              if (window.confirm('Reset sample demo items? Your custom items will be replaced by initial examples.')) {
                onResetDemo();
              }
            }}
            className="px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center justify-center gap-1 transition-colors"
            title="Reload initial demo items"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Clear all items from your library?')) {
                onClearAll();
              }
            }}
            className="px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/30 border border-zinc-800/80 text-[10px] text-zinc-400 hover:text-rose-400 flex items-center justify-center gap-1 transition-colors"
            title="Clear all saved resources"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Compact Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 h-screen sticky top-0 flex-col z-20">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/80 backdrop-blur-sm" onClick={onCloseMobile}>
          <div
            className="w-64 h-full bg-[#101013] max-w-[80vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};
