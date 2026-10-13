import React from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Star,
  SlidersHorizontal,
  X,
  Folder,
  Hash,
  ArrowUpDown,
} from 'lucide-react';
import { ResourceType, SortOption, ViewMode, Collection } from '../../types/resource';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: ResourceType | 'all';
  onTypeChange: (type: ResourceType | 'all') => void;
  selectedCollectionId: string;
  onCollectionChange: (id: string) => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  collections: Collection[];
  availableTags: { tag: string; count: number }[];
  resultCount: number;
  totalCount: number;
  onClearFilters: () => void;
}

const CATEGORIES: { id: ResourceType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'component', label: 'Components' },
  { id: 'prompt', label: 'Prompts' },
  { id: 'website', label: 'Websites' },
  { id: 'template', label: 'Templates' },
  { id: 'animation', label: 'Animations' },
  { id: 'screenshot', label: 'Screenshots' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCollectionId,
  onCollectionChange,
  selectedTag,
  onTagChange,
  favoritesOnly,
  onToggleFavoritesOnly,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  collections,
  availableTags,
  resultCount,
  totalCount,
  onClearFilters,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedType !== 'all' ||
    selectedCollectionId !== 'all' ||
    selectedTag !== 'all' ||
    favoritesOnly;

  return (
    <div className="space-y-3.5 mb-6">
      {/* Top Row: Search Input, View Mode Toggle & Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search titles, full prompts, tags, notes, or URLs..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#151518] border border-[#242428] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls: Sort, Favorites toggle, Grid/List */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Favorites Filter */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors shrink-0 ${
              favoritesOnly
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-[#151518] border-[#242428] text-zinc-400 hover:text-zinc-200'
            }`}
            title="Filter starred favorites"
          >
            <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-current' : ''}`} />
            <span>Favorites</span>
          </button>

          {/* Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none pl-7 pr-8 py-2 rounded-xl bg-[#151518] border border-[#242428] text-xs text-zinc-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="recent_added">Recently Added</option>
              <option value="recent_updated">Recently Updated</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
              <option value="most_used">Most Used</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Collection Filter Dropdown */}
          {collections.length > 0 && (
            <div className="relative shrink-0">
              <select
                value={selectedCollectionId}
                onChange={(e) => onCollectionChange(e.target.value)}
                className="appearance-none pl-7 pr-8 py-2 rounded-xl bg-[#151518] border border-[#242428] text-xs text-zinc-300 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Collections</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Folder className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Grid / List View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#151518] border border-[#242428] shrink-0">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Category Pills & Status count */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedType === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onTypeChange(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#151518] text-zinc-400 hover:text-zinc-200 border border-[#242428] hover:border-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results Info & Clear Action */}
        <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-mono">
          <span>
            Showing <strong className="text-white">{resultCount}</strong> of {totalCount}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
