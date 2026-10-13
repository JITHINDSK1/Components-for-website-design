import React, { useState } from 'react';
import { Hash, Search, ArrowRight, Layers, Tag as TagIcon, X } from 'lucide-react';
import { Resource, Collection } from '../types/resource';
import { ResourceCard } from '../components/library/ResourceCard';

interface TagsPageProps {
  resources: Resource[];
  collections: Collection[];
  availableTags: { tag: string; count: number }[];
  activeTag?: string;
  onSelectTag: (tag: string) => void;
  onOpenDetails: (resource: Resource) => void;
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resource: Resource) => void;
  onToggleFavorite: (id: string) => void;
  onSelectCollection: (colId: string) => void;
}

export const TagsPage: React.FC<TagsPageProps> = ({
  resources,
  collections,
  availableTags,
  activeTag,
  onSelectTag,
  onOpenDetails,
  onEditResource,
  onDeleteResource,
  onToggleFavorite,
  onSelectCollection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // If a tag is active (not 'all'), show resources matching that tag
  if (activeTag && activeTag !== 'all') {
    const taggedResources = resources.filter((r) =>
      r.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase())
    );

    return (
      <div className="space-y-6 pb-16">
        <div className="p-6 rounded-2xl bg-[#141418] border border-[#242428] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-lg">
              #
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  #{activeTag}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                  {taggedResources.length} items
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Resources tagged with #{activeTag}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTag('all')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Show all tags</span>
          </button>
        </div>

        {taggedResources.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-[#141417] border border-[#242428] max-w-md mx-auto">
            <Hash className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
            <p className="text-xs text-zinc-400">No resources found with this tag.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {taggedResources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
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
        )}
      </div>
    );
  }

  // ALL TAGS BROWSER
  const filteredTags = searchQuery.trim()
    ? availableTags.filter((t) =>
        t.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableTags;

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-[#141418] border border-[#242428]">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Tag Explorer
        </h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed">
          Browse items by keyword taxonomy. Case-insensitive tags keep your creative repository structured without duplicate variations.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter tags..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#151518] border border-[#242428] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Tag Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredTags.map(({ tag, count }) => (
          <div
            key={tag}
            onClick={() => onSelectTag(tag)}
            className="group p-3.5 rounded-xl bg-[#151518] border border-[#242428] hover:border-[#383842] hover:bg-[#18181D] transition-all cursor-pointer flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Hash className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors truncate font-mono">
                {tag}
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono shrink-0">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
