import { Resource, Collection, VaultSettings } from '../types/resource';
import { INITIAL_COLLECTIONS, INITIAL_RESOURCES } from '../data/demo-resources';

const STORAGE_KEYS = {
  RESOURCES: 'vault_resources_v1',
  COLLECTIONS: 'vault_collections_v1',
  SETTINGS: 'vault_settings_v1',
};

const DEFAULT_SETTINGS: VaultSettings = {
  defaultView: 'grid',
  autoCopyCloseModal: false,
  theme: 'dark',
};

export const storage = {
  // Resources
  getResources(): Resource[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      if (!raw) {
        // Seed initial demo data
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
        return INITIAL_RESOURCES;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to parse resources from localStorage:', err);
      return INITIAL_RESOURCES;
    }
  },

  saveResource(resource: Resource): void {
    const resources = this.getResources();
    const existingIndex = resources.findIndex((r) => r.id === resource.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      resources[existingIndex] = {
        ...resources[existingIndex],
        ...resource,
        updatedAt: now,
      };
    } else {
      resources.unshift({
        ...resource,
        createdAt: resource.createdAt || now,
        updatedAt: now,
      });
    }

    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  },

  deleteResource(id: string): void {
    const resources = this.getResources().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  },

  toggleFavorite(id: string): boolean {
    const resources = this.getResources();
    let newFavoriteState = false;
    const updated = resources.map((r) => {
      if (r.id === id) {
        newFavoriteState = !r.isFavorite;
        return { ...r, isFavorite: newFavoriteState, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(updated));
    return newFavoriteState;
  },

  incrementUsage(id: string): void {
    const resources = this.getResources();
    const now = new Date().toISOString();
    const updated = resources.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          usageCount: (r.usageCount || 0) + 1,
          lastOpenedAt: now,
          updatedAt: now,
        };
      }
      return r;
    });
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(updated));
  },

  updateNotes(id: string, notes: string): void {
    const resources = this.getResources();
    const updated = resources.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          notes,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(updated));
  },

  // Collections
  getCollections(): Collection[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(INITIAL_COLLECTIONS));
        return INITIAL_COLLECTIONS;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to parse collections from localStorage:', err);
      return INITIAL_COLLECTIONS;
    }
  },

  saveCollection(collection: Collection): void {
    const collections = this.getCollections();
    const existingIndex = collections.findIndex((c) => c.id === collection.id);

    if (existingIndex >= 0) {
      collections[existingIndex] = collection;
    } else {
      collections.push(collection);
    }

    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  },

  deleteCollection(id: string): void {
    // 1. Remove from collections
    const collections = this.getCollections().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));

    // 2. Remove collection association from all resources without deleting resources
    const resources = this.getResources();
    const updatedResources = resources.map((r) => ({
      ...r,
      collectionIds: r.collectionIds.filter((colId) => colId !== id),
    }));
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(updatedResources));
  },

  // Tags
  getAllTags(): { tag: string; count: number }[] {
    const resources = this.getResources();
    const tagMap = new Map<string, number>();

    resources.forEach((r) => {
      r.tags?.forEach((t) => {
        const normalized = t.trim().toLowerCase();
        if (normalized) {
          tagMap.set(normalized, (tagMap.get(normalized) || 0) + 1);
        }
      });
    });

    return Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  },

  // Settings
  getSettings(): VaultSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<VaultSettings>): void {
    const current = this.getSettings();
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
  },

  // Reset & Clear
  resetDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(INITIAL_COLLECTIONS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  },

  clearLibrary(): void {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify([]));
  },

  // Export / Import
  exportDataAsJSON(): string {
    const data = {
      version: 'vault_v1',
      exportedAt: new Date().toISOString(),
      resources: this.getResources(),
      collections: this.getCollections(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  importDataFromJSON(
    jsonString: string,
    mode: 'merge' | 'replace'
  ): { success: boolean; message: string; count?: number } {
    try {
      const parsed = JSON.parse(jsonString);

      if (!parsed || (!Array.isArray(parsed.resources) && !Array.isArray(parsed))) {
        return { success: false, message: 'Invalid format: JSON does not contain valid resources list.' };
      }

      const importedResources: Resource[] = Array.isArray(parsed.resources) ? parsed.resources : parsed;
      const importedCollections: Collection[] = Array.isArray(parsed.collections) ? parsed.collections : [];

      // Validate resources structure
      const validResources = importedResources.filter(
        (r) => r && typeof r.id === 'string' && typeof r.title === 'string'
      );

      if (validResources.length === 0) {
        return { success: false, message: 'No valid resources found in imported data.' };
      }

      if (mode === 'replace') {
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(validResources));
        if (importedCollections.length > 0) {
          localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(importedCollections));
        }
        return {
          success: true,
          message: `Successfully replaced library with ${validResources.length} resources.`,
          count: validResources.length,
        };
      } else {
        // Merge mode: Add missing items or update existing by id
        const currentResources = this.getResources();
        const resourceMap = new Map(currentResources.map((r) => [r.id, r]));

        validResources.forEach((item) => {
          resourceMap.set(item.id, item);
        });

        const mergedResources = Array.from(resourceMap.values());
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(mergedResources));

        if (importedCollections.length > 0) {
          const currentCollections = this.getCollections();
          const colMap = new Map(currentCollections.map((c) => [c.id, c]));
          importedCollections.forEach((c) => {
            if (c.id && c.name) colMap.set(c.id, c);
          });
          localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(Array.from(colMap.values())));
        }

        return {
          success: true,
          message: `Successfully merged ${validResources.length} items. Total resources: ${mergedResources.length}.`,
          count: mergedResources.length,
        };
      }
    } catch (err: any) {
      return { success: false, message: `Import error: ${err.message || 'Corrupted JSON'}` };
    }
  },

  // Stats
  getStorageStats() {
    const resources = this.getResources();
    const collections = this.getCollections();
    const tags = this.getAllTags();

    const byType: Record<string, number> = {};
    let totalPromptWords = 0;

    resources.forEach((r) => {
      byType[r.type] = (byType[r.type] || 0) + 1;
      if (r.promptText) {
        totalPromptWords += r.promptText.trim().split(/\s+/).length;
      }
    });

    const rawSize =
      (localStorage.getItem(STORAGE_KEYS.RESOURCES)?.length || 0) +
      (localStorage.getItem(STORAGE_KEYS.COLLECTIONS)?.length || 0);

    return {
      totalResources: resources.length,
      byType,
      totalCollections: collections.length,
      totalTags: tags.length,
      totalPromptWords,
      storageKb: Number((rawSize / 1024).toFixed(1)),
    };
  },
};
