import React, { useState } from 'react';
import {
  Terminal,
  Search,
  Copy,
  Check,
  Star,
  Sparkles,
  ExternalLink,
  Plus,
  ArrowUpDown,
  CheckCircle2,
  Edit2,
  Trash2,
  Eye,
  FileCode,
} from 'lucide-react';
import { Resource, Collection } from '../types/resource';
import { copyToClipboard, formatCopyWithContext } from '../lib/clipboard';
import { useToast } from '../components/layout/Toast';

interface PromptsPageProps {
  resources: Resource[];
  collections: Collection[];
  onOpenDetails: (resource: Resource) => void;
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resource: Resource) => void;
  onToggleFavorite: (id: string) => void;
  onMarkAsUsed: (id: string) => void;
  onOpenAddModal: () => void;
}

const PROMPT_CATEGORIES = [
  { id: 'all', label: 'All Prompts' },
  { id: 'frontend', label: 'Frontend Dev', tag: 'react' },
  { id: 'architecture', label: 'Architecture', tag: 'architecture' },
  { id: 'review', label: 'Code Review', tag: 'code-review' },
  { id: 'animation', label: 'Animations', tag: 'animations' },
  { id: 'design', label: 'UI / Design', tag: 'cards' },
];

export const PromptsPage: React.FC<PromptsPageProps> = ({
  resources,
  collections,
  onOpenDetails,
  onEditResource,
  onDeleteResource,
  onToggleFavorite,
  onMarkAsUsed,
  onOpenAddModal,
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recent_added' | 'most_used' | 'alphabetical'>('recent_added');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter only prompt resources
  const allPrompts = resources.filter((r) => r.type === 'prompt' || Boolean(r.promptText));

  let filtered = allPrompts.filter((p) => {
    // 1. Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchPrompt = p.promptText?.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchPrompt && !matchTags) return false;
    }

    // 2. Category filter
    if (selectedCategory !== 'all') {
      const catConfig = PROMPT_CATEGORIES.find((c) => c.id === selectedCategory);
      if (catConfig?.tag && !p.tags?.some((t) => t.toLowerCase().includes(catConfig.tag))) {
        return false;
      }
    }

    // 3. Favorites only
    if (favoritesOnly && !p.isFavorite) return false;

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'most_used') return (b.usageCount || 0) - (a.usageCount || 0);
    if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCopyRaw = async (e: React.MouseEvent, prompt: Resource) => {
    e.stopPropagation();
    if (!prompt.promptText) return;
    const ok = await copyToClipboard(prompt.promptText, true);
    if (ok) {
      setCopiedId(prompt.id);
      onMarkAsUsed(prompt.id);
      toast(`Copied prompt: "${prompt.title}"`, 'success');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyWithContext = async (e: React.MouseEvent, prompt: Resource) => {
    e.stopPropagation();
    if (!prompt.promptText) return;
    const formatted = formatCopyWithContext(prompt.title, prompt.sourceUrl, prompt.promptText);
    const ok = await copyToClipboard(formatted, true);
    if (ok) {
      onMarkAsUsed(prompt.id);
      toast('Copied with context headers!', 'success');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141418] border border-[#242428]">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
            <Terminal className="w-4 h-4" />
            <span>AI Prompt Engineering Repository</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Reusable AI Prompts
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed">
            Optimized for fast copy-pasting into LLMs, cursor rules, or coding agents. Search full prompt texts with instant copy actions.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-950/40 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Save New Prompt</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search full prompt texts, instructions, tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#151518] border border-[#242428] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
              favoritesOnly
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-[#151518] border-[#242428] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-current' : ''}`} />
            <span>Starred</span>
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-7 pr-8 py-2 rounded-xl bg-[#151518] border border-[#242428] text-xs text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="recent_added">Recently Added</option>
              <option value="most_used">Most Used</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {PROMPT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'bg-[#151518] text-zinc-400 hover:text-zinc-200 border border-[#242428]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Prompt Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#141417] border border-[#242428] max-w-md mx-auto">
          <Terminal className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No prompts found</h3>
          <p className="text-xs text-zinc-400 mb-4">
            Try adjusting search terms or add a new reusable prompt.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-medium text-white"
          >
            Add Prompt
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prompt) => {
            const isCopied = copiedId === prompt.id;
            const wordCount = prompt.promptText ? prompt.promptText.trim().split(/\s+/).length : 0;

            return (
              <div
                key={prompt.id}
                onClick={() => onOpenDetails(prompt)}
                className="group relative flex flex-col justify-between rounded-2xl bg-[#141417] border border-[#242428] hover:border-[#383842] hover:bg-[#16161B] transition-all p-5 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/50"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {wordCount} words
                      </span>
                      {prompt.sourceWebsiteName && (
                        <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[110px]">
                          {prompt.sourceWebsiteName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleFavorite(prompt.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          prompt.isFavorite
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-amber-400'
                        }`}
                        title="Star"
                      >
                        <Star className={`w-3.5 h-3.5 ${prompt.isFavorite ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => onEditResource(prompt)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-1 mb-1.5">
                    {prompt.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3.5">
                    {prompt.description || 'System instruction and LLM engineering prompt.'}
                  </p>

                  {/* Prompt Text Preview Box */}
                  <div className="p-3.5 rounded-xl bg-[#0D0D10] border border-zinc-800/80 font-mono text-xs text-zinc-300 line-clamp-6 leading-relaxed select-none relative group-hover:border-zinc-700 transition-colors">
                    {prompt.promptText}
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0D0D10] to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                    <span>Used {prompt.usageCount || 0}x</span>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleCopyWithContext(e, prompt)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Copy prompt with origin comments"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span className="hidden sm:inline">Context</span>
                    </button>

                    <button
                      onClick={(e) => handleCopyRaw(e, prompt)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all hover:scale-[1.02]"
                      title="Copy raw prompt"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
