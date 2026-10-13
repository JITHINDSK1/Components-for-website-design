import React from 'react';
import {
  Sparkles,
  Plus,
  Search,
  ArrowRight,
  Clock,
  Flame,
  Folder,
  Terminal,
  Layers,
  Compass,
  Star,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Resource, Collection } from '../types/resource';
import { ResourceCard } from '../components/library/ResourceCard';
import { copyToClipboard } from '../lib/clipboard';
import { useToast } from '../components/layout/Toast';
import { NavItem } from '../components/layout/Sidebar';

interface HomePageProps {
  resources: Resource[];
  collections: Collection[];
  onOpenDetails: (resource: Resource) => void;
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resource: Resource) => void;
  onToggleFavorite: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenSearch: () => void;
  onNavigate: (tab: NavItem) => void;
  onSelectCollection: (colId: string) => void;
  onSelectTag: (tag: string) => void;
  onResetDemo: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  resources,
  collections,
  onOpenDetails,
  onEditResource,
  onDeleteResource,
  onToggleFavorite,
  onOpenAddModal,
  onOpenSearch,
  onNavigate,
  onSelectCollection,
  onSelectTag,
  onResetDemo,
}) => {
  const { toast } = useToast();

  // Section A: Recently saved (sorted by createdAt)
  const recentlySaved = [...resources]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Section B: Top saved (most used or pinned)
  const topSaved = [...resources]
    .filter((r) => r.isFavorite || (r.usageCount && r.usageCount > 5))
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, 4);

  // Section C: Continue exploring (last opened or recently touched)
  const continueExploring = [...resources]
    .sort((a, b) => {
      const timeA = a.lastOpenedAt ? new Date(a.lastOpenedAt).getTime() : new Date(a.updatedAt).getTime();
      const timeB = b.lastOpenedAt ? new Date(b.lastOpenedAt).getTime() : new Date(b.updatedAt).getTime();
      return timeB - timeA;
    })
    .slice(0, 3);

  // Section E: Recently added prompts
  const recentPrompts = resources
    .filter((r) => r.type === 'prompt' && r.promptText)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Copy prompt helper for Section E
  const handleCopyPrompt = async (text: string, title: string) => {
    const ok = await copyToClipboard(text, true);
    if (ok) {
      toast(`Copied "${title}" to clipboard!`, 'success');
    }
  };

  if (resources.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-5 text-zinc-500">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Your library is currently empty</h2>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Start gathering UI components, web inspiration, animations, and reusable AI prompts into your private vault.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Resource</span>
          </button>
          <button
            onClick={onResetDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs border border-zinc-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Load Demo Library</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#15151A] via-[#101014] to-[#0D0D10] border border-[#242428] shadow-2xl overflow-hidden">
        {/* Subtle decorative glowing mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-3.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Creative Intelligence &amp; Assets</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-2.5">
            Your creative library
          </h2>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            Everything worth saving, all in one place. Organize website components, UI inspiration, design references, and reusable AI prompts.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add to library</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1F] hover:bg-[#202026] text-zinc-300 hover:text-white border border-[#27272A] text-xs font-medium transition-all"
            >
              <Search className="w-4 h-4 text-zinc-400" />
              <span>Search everything</span>
              <kbd className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono ml-1">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => onNavigate('prompts')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Browse Prompts</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION A: Recently saved */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Recently Saved
              </h3>
              <p className="text-xs text-zinc-500">
                Latest design assets and prompts added to your vault
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('recent')}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-blue-400 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlySaved.map((item) => (
            <ResourceCard
              key={item.id}
              resource={item}
              collections={collections}
              onOpenDetails={onOpenDetails}
              onEdit={onEditResource}
              onDelete={onDeleteResource}
              onToggleFavorite={onToggleFavorite}
              onSelectTag={onSelectTag}
              onSelectCollection={onSelectCollection}
            />
          ))}
        </div>
      </section>

      {/* SECTION B: Top saved */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Top Saved &amp; Favorites
              </h3>
              <p className="text-xs text-zinc-500">
                Most used components and pinned daily prompts
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('favorites')}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <span>View all favorites</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topSaved.map((item) => (
            <ResourceCard
              key={item.id}
              resource={item}
              collections={collections}
              onOpenDetails={onOpenDetails}
              onEdit={onEditResource}
              onDelete={onDeleteResource}
              onToggleFavorite={onToggleFavorite}
              onSelectTag={onSelectTag}
              onSelectCollection={onSelectCollection}
            />
          ))}
        </div>
      </section>

      {/* SECTION D: Your collections */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Your Collections
              </h3>
              <p className="text-xs text-zinc-500">
                Thematic folders grouping your creative components
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('collections')}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-indigo-400 transition-colors"
          >
            <span>Manage collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {collections.slice(0, 6).map((col) => {
            const count = resources.filter((r) => r.collectionIds?.includes(col.id)).length;
            return (
              <div
                key={col.id}
                onClick={() => onSelectCollection(col.id)}
                className="group p-4 rounded-xl bg-[#151518] border border-[#242428] hover:border-[#383842] hover:bg-[#18181D] transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                    style={{ backgroundColor: `${col.color}20` }}
                  >
                    <Folder className="w-5 h-5" style={{ color: col.color }} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors truncate">
                      {col.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500 truncate max-w-xs">
                      {col.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                    {count}
                  </span>
                  <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION E: Recently added prompts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Recently Added AI Prompts
              </h3>
              <p className="text-xs text-zinc-500">
                Ready-to-use prompts with readable preview and 1-click clipboard copy
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('prompts')}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <span>Open Prompt Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentPrompts.map((prompt) => (
            <div
              key={prompt.id}
              onClick={() => onOpenDetails(prompt)}
              className="p-4 rounded-xl bg-[#141417] border border-[#242428] hover:border-[#383842] hover:bg-[#17171B] transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    AI Prompt
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPrompt(prompt.promptText || '', prompt.title);
                    }}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                    title="Copy full prompt"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
                  {prompt.title}
                </h4>

                <div className="p-3 rounded-lg bg-[#0C0C0E] border border-zinc-800/80 font-mono text-[11px] text-zinc-400 line-clamp-4 leading-relaxed mb-3">
                  {prompt.promptText}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60 font-mono">
                <span>{prompt.sourceWebsiteName || 'Saved Prompt'}</span>
                <span>Used {prompt.usageCount || 0}x</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION C: Continue Exploring */}
      <section className="p-5 rounded-xl bg-[#131316] border border-[#242428] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
            <Compass className="w-4 h-4 text-blue-400" />
            <span>Continue Exploring Recent References</span>
          </div>
          <button
            onClick={() => onNavigate('all-saved')}
            className="text-xs text-blue-400 hover:underline"
          >
            All Saved ({resources.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {continueExploring.map((res) => (
            <div
              key={res.id}
              onClick={() => onOpenDetails(res)}
              className="p-3 rounded-lg bg-[#18181D] border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <p className="text-xs font-medium text-zinc-200 truncate">{res.title}</p>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">{res.type}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
