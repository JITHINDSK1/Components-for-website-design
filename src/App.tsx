import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Plus,
  X,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { ResourceCard } from './components/library/ResourceCard';
import { AddResourceModal } from './components/library/AddResourceModal';
import { ResourceDetailModal } from './components/library/ResourceDetailModal';
import { ToastProvider, useToast } from './components/layout/Toast';
import { storage } from './lib/storage';
import { Resource } from './types/resource';

function VaultMain() {
  const { toast } = useToast();

  // Primary Data
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);

  // Load resources from local persistent database
  const loadResources = useCallback(() => {
    const data = storage.getResources();
    setResources(data);
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  // Live search filtering
  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return resources;

    return resources.filter((item) => {
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchSource = item.sourceWebsiteName?.toLowerCase().includes(q);
      const matchUrl = item.sourceUrl?.toLowerCase().includes(q);
      const matchPrompt = item.promptText?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);

      return matchTitle || matchSource || matchUrl || matchPrompt || matchDesc;
    });
  }, [resources, searchQuery]);

  // Handle Save (Add or Edit)
  const handleSaveResource = (payload: Partial<Resource> & { id?: string }) => {
    const saved = storage.saveResource({
      ...payload,
      type: 'component', // Default type is component
    });
    loadResources();

    if (viewingResource && viewingResource.id === saved.id) {
      setViewingResource(saved);
    }
  };

  // Handle Delete
  const handleDeleteResource = (resource: Resource) => {
    if (window.confirm(`Delete "${resource.title}"?`)) {
      storage.deleteResource(resource.id);
      loadResources();
      if (viewingResource?.id === resource.id) {
        setIsDetailModalOpen(false);
        setViewingResource(null);
      }
      toast(`Deleted "${resource.title}"`, 'info');
    }
  };

  // Handle Edit
  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setIsAddModalOpen(true);
  };

  // Handle Open Details
  const handleOpenDetails = (resource: Resource) => {
    setViewingResource(resource);
    setIsDetailModalOpen(true);
  };

  // Reset Demo Data
  const handleResetDemo = () => {
    if (window.confirm('Reset to initial sample components?')) {
      storage.resetDemoData();
      loadResources();
      toast('Sample components restored', 'info');
    }
  };

  // Clear All
  const handleClearAll = () => {
    if (window.confirm('Delete all saved components from your private library?')) {
      storage.clearLibrary();
      loadResources();
      toast('All saved components cleared', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#EDEDEF] flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Minimalist Header */}
      <header className="h-16 px-6 sm:px-12 border-b border-[#18181C] bg-[#0A0A0C]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1853DB] flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-500/20">
            V
          </div>
          <span className="text-sm font-bold tracking-tight text-white">Vault</span>
        </div>

        {/* Search & Add Component Button */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative w-44 sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components or prompts..."
              className="w-full bg-[#131316] border border-[#202024] focus:border-[#1853DB] rounded-lg pl-9 pr-7 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Add Component Button */}
          <button
            onClick={() => {
              setEditingResource(null);
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#1853DB] hover:bg-[#1D5BF0] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Component</span>
          </button>
        </div>
      </header>

      {/* Main Single Page */}
      <main className="flex-1 px-6 sm:px-12 py-8 max-w-[1720px] w-full mx-auto">
        {/* Section Header Matching Screenshot Style */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {searchQuery ? 'Search Results' : 'Top Components'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              {searchQuery
                ? `Showing ${filteredResources.length} result${filteredResources.length === 1 ? '' : 's'} matching "${searchQuery}"`
                : `${resources.length} saved component${resources.length === 1 ? '' : 's'} · private local library`}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <button
              onClick={handleResetDemo}
              className="hover:text-zinc-300 flex items-center gap-1 transition-colors"
              title="Reset sample components"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Samples</span>
            </button>
            <span className="text-zinc-700 hidden sm:inline">·</span>
            <button
              onClick={handleClearAll}
              className="hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Clear all saved components"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
        </div>

        {/* Visual Cards Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {filteredResources.map((item, idx) => (
              <div key={item.id} className="relative group">
                {/* Subtle ranking number behind card matching screenshot */}
                <span className="absolute -top-6 -left-3 text-5xl font-black text-white/[0.04] select-none pointer-events-none group-hover:text-white/[0.08] transition-colors font-mono">
                  {idx + 1}
                </span>

                <ResourceCard
                  resource={item}
                  onOpenDetails={handleOpenDetails}
                  onEdit={handleEditResource}
                  onDelete={handleDeleteResource}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-[#111114] border border-dashed border-[#202024] max-w-md mx-auto mt-12">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3.5">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              {searchQuery ? 'No matching components' : 'No components saved yet'}
            </h3>
            <p className="text-xs text-zinc-400 max-w-xs mb-6">
              {searchQuery
                ? `No components matched "${searchQuery}". Try a different keyword.`
                : 'Click "Add Component" to paste a prompt, upload a screenshot, or save a website reference.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingResource(null);
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1853DB] hover:bg-[#1D5BF0] text-white shadow-sm shadow-blue-500/25 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Component</span>
              </button>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Component Modal */}
      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingResource(null);
        }}
        onSave={handleSaveResource}
        initialData={editingResource}
      />

      {/* Component Detail Modal */}
      <ResourceDetailModal
        isOpen={isDetailModalOpen}
        resource={viewingResource}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingResource(null);
        }}
        onEdit={(res) => {
          setIsDetailModalOpen(false);
          handleEditResource(res);
        }}
        onDelete={handleDeleteResource}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <VaultMain />
    </ToastProvider>
  );
}
