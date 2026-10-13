import React, { useState } from 'react';
import {
  Layers,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Resource, Collection, ResourceType, SortOption, ViewMode } from '../types/resource';
import { ResourceCard } from '../components/library/ResourceCard';
import { FilterBar } from '../components/library/FilterBar';
import { filterAndSortResources } from '../lib/search';

interface AllSavedPageProps {
  resources: Resource[];
  collections: Collection[];
  availableTags: { tag: string; count: number }[];
  initialTypeFilter?: ResourceType | 'all';
  initialCollectionFilter?: string;
  initialTagFilter?: string;
  initialFavoritesOnly?: boolean;
  onOpenDetails: (resource: Resource) => void;
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resource: Resource) => void;
  onToggleFavorite: (id: string) => void;
  onOpenAddModal: () => void;
  onSelectTag: (tag: string) => void;
  onSelectCollection: (colId: string) => void;
}

export const AllSavedPage: React.FC<AllSavedPageProps> = ({
  resources,
  collections,
  availableTags,
  initialTypeFilter = 'all',
  initialCollectionFilter = 'all',
  initialTagFilter = 'all',
  initialFavoritesOnly = false,
  onOpenDetails,
  onEditResource,
  onDeleteResource,
  onToggleFavorite,
  onOpenAddModal,
  onSelectTag,
  onSelectCollection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>(initialTypeFilter);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(initialCollectionFilter);
  const [selectedTag, setSelectedTag] = useState<string>(initialTagFilter);
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(initialFavoritesOnly);
  const [sortBy, setSortBy] = useState<SortOption>('recent_added');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredResources = filterAndSortResources(resources, {
    query: searchQuery,
    type: selectedType,
    collectionId: selectedCollectionId,
    tag: selectedTag,
    favoritesOnly,
    sortBy,
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCollectionId('all');
    setSelectedTag('all');
    setFavoritesOnly(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCollectionId={selectedCollectionId}
        onCollectionChange={setSelectedCollectionId}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        favoritesOnly={favoritesOnly}
        onToggleFavoritesOnly={() => setFavoritesOnly(!favoritesOnly)}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        collections={collections}
        availableTags={availableTags}
        resultCount={filteredResources.length}
        totalCount={resources.length}
        onClearFilters={handleClearFilters}
      />

      {/* Resource Grid / List */}
      {filteredResources.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#141417] border border-[#242428] max-w-lg mx-auto">
          <Layers className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">
            No matching resources found
          </h3>
          <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
            Try adjusting your search criteria, clearing filter categories, or saving a new resource.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Resource</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredResources.map((item) => (
            <ResourceCard
              key={item.id}
              resource={item}
              collections={collections}
              viewMode="grid"
              onOpenDetails={onOpenDetails}
              onEdit={onEditResource}
              onDelete={onDeleteResource}
              onToggleFavorite={onToggleFavorite}
              onSelectTag={onSelectTag}
              onSelectCollection={onSelectCollection}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredResources.map((item) => (
            <ResourceCard
              key={item.id}
              resource={item}
              collections={collections}
              viewMode="list"
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
};
