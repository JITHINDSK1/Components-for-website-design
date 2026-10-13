import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider, useToast } from './components/layout/Toast';
import { Sidebar, NavItem } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { AllSavedPage } from './pages/AllSavedPage';
import { PromptsPage } from './pages/PromptsPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { TagsPage } from './pages/TagsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ResourceDetailModal } from './components/library/ResourceDetailModal';
import { AddResourceModal } from './components/library/AddResourceModal';
import { DeleteConfirmModal } from './components/library/DeleteConfirmModal';
import { CollectionModal } from './components/collections/CollectionModal';
import { CommandPalette } from './components/search/CommandPalette';
import { storage } from './lib/storage';
import { Resource, Collection, ResourceType } from './types/resource';

function VaultApp() {
  const { toast } = useToast();

  // Primary Data State
  const [resources, setResources] = useState<Resource[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavItem>('home');
  const [activeCollectionId, setActiveCollectionId] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string>('all');

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals State
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);

  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingTarget, setDeletingTarget] = useState<{
    type: 'resource' | 'collection';
    item: Resource | Collection;
  } | null>(null);

  // Reload data from storage
  const refreshData = useCallback(() => {
    setResources(storage.getResources());
    setCollections(storage.getCollections());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Global Keyboard Shortcuts (Ctrl+K, Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CRUD Handler: Save Resource
  const handleSaveResource = (res: Resource) => {
    storage.saveResource(res);
    refreshData();
    // Update currently viewed resource if open
    if (viewingResource && viewingResource.id === res.id) {
      setViewingResource(res);
    }
  };

  // CRUD Handler: Delete Resource Request
  const handleRequestDeleteResource = (res: Resource) => {
    setDeletingTarget({ type: 'resource', item: res });
    setDeleteConfirmOpen(true);
  };

  // CRUD Handler: Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    const isFav = storage.toggleFavorite(id);
    refreshData();
    if (viewingResource && viewingResource.id === id) {
      setViewingResource((prev) => (prev ? { ...prev, isFavorite: isFav } : null));
    }
    toast(isFav ? 'Added to favorites' : 'Removed from favorites', 'info');
  };

  // CRUD Handler: Mark Prompt as Used
  const handleMarkAsUsed = (id: string) => {
    storage.incrementUsage(id);
    refreshData();
    if (viewingResource && viewingResource.id === id) {
      setViewingResource((prev) =>
        prev
          ? {
              ...prev,
              usageCount: (prev.usageCount || 0) + 1,
              lastOpenedAt: new Date().toISOString(),
            }
          : null
      );
    }
  };

  // CRUD Handler: Update Notes
  const handleUpdateNotes = (id: string, notes: string) => {
    storage.updateNotes(id, notes);
    refreshData();
    if (viewingResource && viewingResource.id === id) {
      setViewingResource((prev) => (prev ? { ...prev, notes } : null));
    }
  };

  // CRUD Handler: Save Collection
  const handleSaveCollection = (col: Collection) => {
    storage.saveCollection(col);
    refreshData();
  };

  // CRUD Handler: Delete Collection Request
  const handleRequestDeleteCollection = (col: Collection) => {
    setDeletingTarget({ type: 'collection', item: col });
    setDeleteConfirmOpen(true);
  };

  // Confirmation Delete Execution
  const handleConfirmDelete = () => {
    if (!deletingTarget) return;

    if (deletingTarget.type === 'resource') {
      const targetRes = deletingTarget.item as Resource;
      storage.deleteResource(targetRes.id);
      refreshData();
      if (viewingResource?.id === targetRes.id) {
        setDetailModalOpen(false);
      }
      toast(`Deleted resource: "${targetRes.title}"`, 'info');
    } else {
      const targetCol = deletingTarget.item as Collection;
      storage.deleteCollection(targetCol.id);
      refreshData();
      if (activeCollectionId === targetCol.id) {
        setActiveCollectionId('all');
      }
      toast(`Deleted collection: "${targetCol.name}"`, 'info');
    }

    setDeleteConfirmOpen(false);
    setDeletingTarget(null);
  };

  // Open Details Modal with usage increment
  const handleOpenDetails = (res: Resource) => {
    setViewingResource(res);
    setDetailModalOpen(true);
  };

  // Open Edit Modal
  const handleEditResource = (res: Resource) => {
    setEditingResource(res);
    setAddModalOpen(true);
  };

  // Select collection from any page
  const handleSelectCollection = (colId: string) => {
    setActiveCollectionId(colId);
    setCurrentTab('collections');
  };

  // Select tag from any page
  const handleSelectTag = (tag: string) => {
    setActiveTag(tag);
    setCurrentTab('tags');
  };

  const availableTags = storage.getAllTags();

  const stats = {
    total: resources.length,
    favorites: resources.filter((r) => r.isFavorite).length,
    prompts: resources.filter((r) => r.type === 'prompt' || Boolean(r.promptText)).length,
  };

  // Render Current Page
  const renderPage = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomePage
            resources={resources}
            collections={collections}
            onOpenDetails={handleOpenDetails}
            onEditResource={handleEditResource}
            onDeleteResource={handleRequestDeleteResource}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddModal={() => {
              setEditingResource(null);
              setAddModalOpen(true);
            }}
            onOpenSearch={() => setCommandPaletteOpen(true)}
            onNavigate={setCurrentTab}
            onSelectCollection={handleSelectCollection}
            onSelectTag={handleSelectTag}
            onResetDemo={() => {
              storage.resetDemoData();
              refreshData();
              toast('Restored demo resources', 'success');
            }}
          />
        );

      case 'all-saved':
      case 'components':
      case 'websites':
      case 'templates':
      case 'animations':
      case 'screenshots':
      case 'favorites':
      case 'recent': {
        const typeFilterMap: Record<string, ResourceType | 'all'> = {
          components: 'component',
          websites: 'website',
          templates: 'template',
          animations: 'animation',
          screenshots: 'screenshot',
        };

        const initialType = typeFilterMap[currentTab] || 'all';
        const initialFavorites = currentTab === 'favorites';

        return (
          <AllSavedPage
            key={currentTab}
            resources={resources}
            collections={collections}
            availableTags={availableTags}
            initialTypeFilter={initialType}
            initialFavoritesOnly={initialFavorites}
            onOpenDetails={handleOpenDetails}
            onEditResource={handleEditResource}
            onDeleteResource={handleRequestDeleteResource}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddModal={() => {
              setEditingResource(null);
              setAddModalOpen(true);
            }}
            onSelectTag={handleSelectTag}
            onSelectCollection={handleSelectCollection}
          />
        );
      }

      case 'prompts':
        return (
          <PromptsPage
            resources={resources}
            collections={collections}
            onOpenDetails={handleOpenDetails}
            onEditResource={handleEditResource}
            onDeleteResource={handleRequestDeleteResource}
            onToggleFavorite={handleToggleFavorite}
            onMarkAsUsed={handleMarkAsUsed}
            onOpenAddModal={() => {
              setEditingResource(null);
              setAddModalOpen(true);
            }}
          />
        );

      case 'collections':
        return (
          <CollectionsPage
            collections={collections}
            resources={resources}
            activeCollectionId={activeCollectionId}
            onSelectCollection={setActiveCollectionId}
            onOpenCreateModal={() => {
              setEditingCollection(null);
              setCollectionModalOpen(true);
            }}
            onEditCollection={(col) => {
              setEditingCollection(col);
              setCollectionModalOpen(true);
            }}
            onDeleteCollection={handleRequestDeleteCollection}
            onOpenDetails={handleOpenDetails}
            onEditResource={handleEditResource}
            onDeleteResource={handleRequestDeleteResource}
            onToggleFavorite={handleToggleFavorite}
            onSelectTag={handleSelectTag}
          />
        );

      case 'tags':
        return (
          <TagsPage
            resources={resources}
            collections={collections}
            availableTags={availableTags}
            activeTag={activeTag}
            onSelectTag={setActiveTag}
            onOpenDetails={handleOpenDetails}
            onEditResource={handleEditResource}
            onDeleteResource={handleRequestDeleteResource}
            onToggleFavorite={handleToggleFavorite}
            onSelectCollection={handleSelectCollection}
          />
        );

      case 'settings':
        return <SettingsPage onDataChanged={refreshData} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#EDEDEF] flex">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={(tab) => {
          if (tab === 'collections') setActiveCollectionId('all');
          if (tab === 'tags') setActiveTag('all');
          setCurrentTab(tab);
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenSearch={() => setCommandPaletteOpen(true)}
        onOpenAddModal={() => {
          setEditingResource(null);
          setAddModalOpen(true);
        }}
        stats={stats}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-18' : 'lg:pl-64'
        }`}
      >
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onOpenAddModal={() => {
            setEditingResource(null);
            setAddModalOpen(true);
          }}
          itemCount={currentTab === 'all-saved' ? resources.length : undefined}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        resources={resources}
        collections={collections}
        onSelectResource={(res) => {
          handleOpenDetails(res);
        }}
        onSelectCollection={(colId) => {
          handleSelectCollection(colId);
        }}
      />

      <AddResourceModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingResource(null);
        }}
        onSave={handleSaveResource}
        collections={collections}
        initialData={editingResource}
      />

      <ResourceDetailModal
        isOpen={detailModalOpen}
        resource={viewingResource}
        allResources={resources}
        collections={collections}
        onClose={() => {
          setDetailModalOpen(false);
          setViewingResource(null);
        }}
        onEdit={(res) => {
          setDetailModalOpen(false);
          handleEditResource(res);
        }}
        onDelete={(res) => {
          handleRequestDeleteResource(res);
        }}
        onToggleFavorite={handleToggleFavorite}
        onMarkAsUsed={handleMarkAsUsed}
        onUpdateNotes={handleUpdateNotes}
        onOpenResource={(res) => {
          setViewingResource(res);
        }}
      />

      <CollectionModal
        isOpen={collectionModalOpen}
        onClose={() => {
          setCollectionModalOpen(false);
          setEditingCollection(null);
        }}
        onSave={handleSaveCollection}
        initialData={editingCollection}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        title={
          deletingTarget?.type === 'resource'
            ? 'Delete Resource'
            : 'Delete Collection'
        }
        itemName={
          deletingTarget
            ? deletingTarget.type === 'resource'
              ? (deletingTarget.item as Resource).title
              : (deletingTarget.item as Collection).name
            : ''
        }
        message={
          deletingTarget?.type === 'collection'
            ? 'Deleting this collection will NOT remove your saved resources. It will only remove the collection label.'
            : undefined
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setDeletingTarget(null);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <VaultApp />
    </ToastProvider>
  );
}
