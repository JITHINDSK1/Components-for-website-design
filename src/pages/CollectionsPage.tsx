import React, { useState } from 'react';
import {
  Folder,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Layers,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { Collection, Resource } from '../types/resource';
import { ResourceCard } from '../components/library/ResourceCard';

interface CollectionsPageProps {
  collections: Collection[];
  resources: Resource[];
  activeCollectionId?: string;
  onSelectCollection: (colId: string) => void;
  onOpenCreateModal: () => void;
  onEditCollection: (col: Collection) => void;
  onDeleteCollection: (col: Collection) => void;
  onOpenDetails: (resource: Resource) => void;
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resource: Resource) => void;
  onToggleFavorite: (id: string) => void;
  onSelectTag: (tag: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  collections,
  resources,
  activeCollectionId,
  onSelectCollection,
  onOpenCreateModal,
  onEditCollection,
  onDeleteCollection,
  onOpenDetails,
  onEditResource,
  onDeleteResource,
  onToggleFavorite,
  onSelectTag,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // If a specific collection is selected, render its items with a back button
  const activeCol = collections.find((c) => c.id === activeCollectionId);

  if (activeCol) {
    const colResources = resources.filter((r) =>
      r.collectionIds?.includes(activeCol.id)
    );

    return (
      <div className="space-y-6 pb-16">
        {/* Collection Banner Header */}
        <div className="p-6 rounded-2xl bg-[#141418] border border-[#242428] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectCollection('all')}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Back to all collections"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 shrink-0"
              style={{ backgroundColor: `${activeCol.color}20` }}
            >
              <Folder className="w-6 h-6" style={{ color: activeCol.color }} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {activeCol.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                  {colResources.length} items
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{activeCol.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => onEditCollection(activeCol)}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Collection</span>
            </button>
            <button
              onClick={() => onDeleteCollection(activeCol)}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Resources list inside collection */}
        {colResources.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-[#141417] border border-[#242428] max-w-md mx-auto">
            <Folder className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">
              Collection is empty
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Edit any resource in your library to associate it with this collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {colResources.map((res) => (
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

  // ALL COLLECTIONS GRID VIEW
  const filteredCollections = searchQuery.trim()
    ? collections.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : collections;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141418] border border-[#242428]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Curated Collections
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed">
            Create custom groups to organize landing page inspiration, SaaS hero sections, animation physics, or coding prompts.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-950/40 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter collections by name or description..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#151518] border border-[#242428] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCollections.map((col) => {
          const count = resources.filter((r) =>
            r.collectionIds?.includes(col.id)
          ).length;

          return (
            <div
              key={col.id}
              onClick={() => onSelectCollection(col.id)}
              className="group p-5 rounded-2xl bg-[#141417] border border-[#242428] hover:border-[#383842] hover:bg-[#17171C] transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-black/50"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/10"
                    style={{ backgroundColor: `${col.color}20` }}
                  >
                    <Folder className="w-5 h-5" style={{ color: col.color }} />
                  </div>

                  <div
                    className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onEditCollection(col)}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                      title="Edit collection"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteCollection(col)}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400"
                      title="Delete collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                  {col.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {col.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>{count} resources</span>
                <span className="flex items-center gap-1 text-blue-400 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
