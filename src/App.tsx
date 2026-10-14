import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Plus,
  Menu,
  X,
  Bookmark,
  Layers,
  Terminal,
  Globe,
  Folder,
  SlidersHorizontal,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { ResourceCard } from './components/library/ResourceCard';
import { AddResourceModal } from './components/library/AddResourceModal';
import { ResourceDetailModal } from './components/library/ResourceDetailModal';
import { ToastProvider, useToast } from './components/layout/Toast';
import { storage } from './lib/storage';
import { Resource, FilterCategory } from './types/resource';

function VaultMain() {
  const { toast } = useToast();

  // Primary Data
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile/Desktop sidebar drawer toggle (hamburger)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);

  // Load resources from localStorage
  const loadResources = useCallback(() => {
    const data = storage.getResources();
    setResources(data);
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  // Compute counts for navigation badges
  const counts = useMemo(() => {
    const res = {
      all: resources.length,
      component: 0,
      prompt: 0,
      website: 0,
      other: 0,
    };
    resources.forEach((r) => {
      if (r.type === 'component') res.component++;
      else if (r.type === 'prompt') res.prompt++;
      else if (r.type === 'website') res.website++;
      else res.other++;
    });
    return res;
  }, [resources]);

  // Filter and live search calculation
  const searchFilteredResources = useMemo(() => {
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

  // Specific active category items
  const categoryResources = useMemo(() => {
    if (activeFilter === 'all') return searchFilteredResources;
    return searchFilteredResources.filter((r) => r.type === activeFilter);
  }, [searchFilteredResources, activeFilter]);

  // Grouped items by category for "All saves" view
  const groupedResources = useMemo(() => {
    const groups: {
      category: FilterCategory;
      title: string;
      icon: any;
      items: Resource[];
    }[] = [
      {
        category: 'component',
        title: 'Components',
        icon: Layers,
        items: searchFilteredResources.filter((r) => r.type === 'component'),
      },
      {
        category: 'prompt',
        title: 'Prompts',
        icon: Terminal,
        items: searchFilteredResources.filter((r) => r.type === 'prompt'),
      },
      {
        category: 'website',
        title: 'Websites',
        icon: Globe,
        items: searchFilteredResources.filter((r) => r.type === 'website'),
      },
      {
        category: 'other',
        title: 'Other',
        icon: Folder,
        items: searchFilteredResources.filter((r) => r.type === 'other'),
      },
    ];

    // Only return groups that have items or all if none
    return groups.filter((g) => g.items.length > 0);
  }, [searchFilteredResources]);

  // Handle Save (Add or Edit)
  const handleSaveResource = (payload: Partial<Resource> & { id?: string }) => {
    const saved = storage.saveResource(payload);
    loadResources();

    if (viewingResource && viewingResource.id === saved.id) {
      setViewingResource(saved);
    }
  };

  // Handle Delete
  const handleDeleteResource = (resource: Resource) => {
    if (window.confirm(`Delete "${resource.title}" from library?`)) {
      storage.deleteResource(resource.id);
      loadResources();
      if (viewingResource?.id === resource.id) {
        setIsDetailModalOpen(false);
        setViewingResource(null);
      }
      toast(`Deleted "${resource.title}"`, 'info');
    }
  };

  // Handle Edit trigger
  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setIsAddModalOpen(true);
  };

  // Handle Open Details
  const handleOpenDetails = (resource: Resource) => {
    setViewingResource(resource);
    setIsDetailModalOpen(true);
  };

  // Reset Demo
  const handleResetDemo = () => {
    storage.resetDemoData();
    loadResources();
    toast('Demo library restored', 'info');
  };

  // Clear All
  const handleClearAll = () => {
    storage.clearLibrary();
    loadResources();
    toast('Library cleared', 'info');
  };

  const filterTabs: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'All saves' },
    { id: 'component', label: 'Components' },
    { id: 'prompt', label: 'Prompts' },
    { id: 'website', label: 'Websites' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#EDEDEF] flex flex-col antialiased">
      {/* Sidebar Drawer (Opened via hamburger menu) */}
      <Sidebar
        activeFilter={activeFilter}
        onSelectFilter={(f) => {
          setActiveFilter(f);
          setIsSidebarOpen(false);
        }}
        onOpenAddModal={() => {
          setEditingResource(null);
          setIsAddModalOpen(true);
          setIsSidebarOpen(false);
        }}
        counts={counts}
        onResetDemo={handleResetDemo}
        onClearAll={handleClearAll}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Top Navbar Matching Screenshot */}
      <nav className="h-14 px-4 sm:px-8 border-b border-[#1A1A1E] bg-[#0A0A0C]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
        {/* Left: Hamburger Icon & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            title="Toggle Sidebar Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Center: "Bookmarks" Title */}
        <div className="text-xs sm:text-sm font-medium text-zinc-300 tracking-wide select-none">
          Bookmarks
        </div>

        {/* Right: Search + Electric Blue Add Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Box */}
          <div className="relative w-36 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-500">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full bg-[#141417] border border-[#202024] focus:border-blue-500 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-zinc-500 hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Electric Blue "+ Add to Library" Button (inspired by screenshot "+ New list") */}
          <button
            onClick={() => {
              setEditingResource(null);
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#1853DB] hover:bg-[#1D5BF0] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add to Library</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </nav>

      {/* Main Single-Page Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1680px] w-full mx-auto">
        {/* Main Page Header */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {activeFilter === 'all'
                ? 'Bookmarks'
                : activeFilter === 'component'
                ? 'Components'
                : activeFilter === 'prompt'
                ? 'Prompts'
                : activeFilter === 'website'
                ? 'Websites'
                : 'Other Resources'}
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            {resources.length} saves · personal library
          </p>

          {/* Capsule Filter Pills Matching Screenshot */}
          <div className="mt-4 inline-flex items-center p-1 rounded-xl bg-[#141417] border border-[#202024] gap-1">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#242429] text-white shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Rows & Cards */}
        {searchQuery ? (
          /* Search Results Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-[#1A1A1E]">
              <span>Search results for "{searchQuery}" ({searchFilteredResources.length})</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-400 hover:underline"
              >
                Clear search
              </button>
            </div>

            {searchFilteredResources.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {searchFilteredResources.map((item) => (
                  <ResourceCard
                    key={item.id}
                    resource={item}
                    onOpenDetails={handleOpenDetails}
                    onEdit={handleEditResource}
                    onDelete={handleDeleteResource}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-zinc-500 border border-dashed border-[#202024] rounded-xl">
                No visual bookmarks found matching "{searchQuery}".
              </div>
            )}
          </div>
        ) : activeFilter !== 'all' ? (
          /* Single Category Filter Grid */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1E]">
              <button
                onClick={() => setActiveFilter('all')}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All saves</span>
              </button>
              <span className="text-xs text-zinc-500 font-mono">
                {categoryResources.length} items
              </span>
            </div>

            {categoryResources.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {categoryResources.map((item) => (
                  <ResourceCard
                    key={item.id}
                    resource={item}
                    onOpenDetails={handleOpenDetails}
                    onEdit={handleEditResource}
                    onDelete={handleDeleteResource}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-zinc-500 border border-dashed border-[#202024] rounded-xl">
                No items in this category yet.
              </div>
            )}
          </div>
        ) : (
          /* "All saves" Grouped Horizontal Rows View (Exact Screenshot Style!) */
          <div className="space-y-10">
            {groupedResources.length > 0 ? (
              groupedResources.map((group) => (
                <section key={group.category} className="space-y-3">
                  {/* Section Title Header with subtle count and "View all" */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-white tracking-tight">
                        {group.title}
                      </h2>
                      <span className="text-xs text-zinc-500 font-mono">
                        {group.items.length}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveFilter(group.category)}
                      className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-0.5"
                    >
                      <span>View all</span>
                      <ChevronRight className="w-3 h-3 text-zinc-500" />
                    </button>
                  </div>

                  {/* Horizontal Visual Cards Grid/Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {group.items.slice(0, 5).map((item) => (
                      <ResourceCard
                        key={item.id}
                        resource={item}
                        onOpenDetails={handleOpenDetails}
                        onEdit={handleEditResource}
                        onDelete={handleDeleteResource}
                      />
                    ))}
                  </div>
                </section>
              ))
            ) : (
              /* Completely Empty Library */
              <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-[#111114] border border-dashed border-[#202024] max-w-md mx-auto mt-8">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Your library is empty</h3>
                <p className="text-xs text-zinc-400 mb-5 max-w-xs">
                  Save your first component reference, UI screenshot, or AI prompt.
                </p>
                <button
                  onClick={() => {
                    setEditingResource(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1853DB] hover:bg-[#1D5BF0] text-white shadow-sm shadow-blue-500/25 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Resource</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Resource Modal */}
      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingResource(null);
        }}
        onSave={handleSaveResource}
        initialData={editingResource}
      />

      {/* Resource Detail Modal */}
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
