import { Resource } from '../types/resource';
import { INITIAL_RESOURCES } from '../data/demo-resources';
import { imageDB } from './image-db';

const STORAGE_KEYS = {
  RESOURCES: 'vault_resources_minimal_v1',
  INITIALIZED: 'vault_initialized_v1',
};

export function extractDomain(url?: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.split('/')[0] || '';
  }
}

export function generateTitleFromPrompt(prompt?: string): string {
  if (!prompt || !prompt.trim()) return 'Untitled Resource';
  const firstLine = prompt.trim().split('\n')[0].trim();
  // Strip common markdown headers or prefixes
  const clean = firstLine.replace(/^#+\s*/, '').replace(/^[-*]\s*/, '').trim();
  if (clean.length > 55) {
    return clean.slice(0, 52) + '...';
  }
  return clean || 'Untitled Prompt';
}

export const storage = {
  getResources(): Resource[] {
    try {
      const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
      const raw = localStorage.getItem(STORAGE_KEYS.RESOURCES);

      if (!isInitialized) {
        // First run: seed initial demo resources
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
        return INITIAL_RESOURCES;
      }

      if (!raw) {
        return [];
      }

      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to read resources from storage:', err);
      return [];
    }
  },

  saveResource(resource: Partial<Resource> & { id?: string }): Resource {
    const resources = this.getResources();
    const now = new Date().toISOString();

    const title =
      resource.title && resource.title.trim()
        ? resource.title.trim()
        : resource.promptText
        ? generateTitleFromPrompt(resource.promptText)
        : resource.sourceUrl
        ? extractDomain(resource.sourceUrl)
        : 'Untitled Resource';

    const sourceWebsiteName =
      resource.sourceWebsiteName ||
      (resource.sourceUrl ? extractDomain(resource.sourceUrl) : '');

    let savedItem: Resource;

    if (resource.id) {
      const existingIndex = resources.findIndex((r) => r.id === resource.id);
      if (existingIndex >= 0) {
        savedItem = {
          ...resources[existingIndex],
          ...resource,
          id: resource.id,
          title,
          sourceWebsiteName,
          updatedAt: now,
        };
        resources[existingIndex] = savedItem;
      } else {
        savedItem = {
          id: resource.id,
          title,
          description: resource.description || '',
          type: resource.type || 'component',
          sourceUrl: resource.sourceUrl || '',
          sourceWebsiteName,
          promptText: resource.promptText || '',
          previewImageUrl: resource.previewImageUrl || '',
          createdAt: resource.createdAt || now,
          updatedAt: now,
        };
        resources.unshift(savedItem);
      }
    } else {
      const id = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      savedItem = {
        id,
        title,
        description: resource.description || '',
        type: resource.type || 'component',
        sourceUrl: resource.sourceUrl || '',
        sourceWebsiteName,
        promptText: resource.promptText || '',
        previewImageUrl: resource.previewImageUrl || '',
        createdAt: now,
        updatedAt: now,
      };
      resources.unshift(savedItem);
    }

    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    return savedItem;
  },

  deleteResource(id: string): void {
    const resources = this.getResources();
    const target = resources.find((r) => r.id === id);
    const updated = resources.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(updated));

    // If resource has an IndexedDB image, clean it up
    if (target?.previewImageUrl?.startsWith('idb:')) {
      imageDB.deleteImage(target.previewImageUrl);
    }
  },

  clearLibrary(): void {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify([]));
    imageDB.clearAll();
  },

  resetDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
  },
};
