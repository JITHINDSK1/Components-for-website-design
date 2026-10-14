import { Resource } from '../types/resource';
import { imageDB } from './image-db';

const STORAGE_KEYS = {
  RESOURCES: 'vault_components_v3',
  LEGACY_KEY: 'vault_resources_minimal_v1',
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
  if (!prompt || !prompt.trim()) return 'Untitled Component';
  const firstLine = prompt.trim().split('\n')[0].trim();
  const clean = firstLine.replace(/^#+\s*/, '').replace(/^[-*]\s*/, '').trim();
  if (clean.length > 55) {
    return clean.slice(0, 52) + '...';
  }
  return clean || 'Untitled Component';
}

export const storage = {
  getResources(): Resource[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      if (raw) {
        const parsed: Resource[] = JSON.parse(raw);
        // Exclude any legacy dummy items
        return parsed.filter((item) => !item.id.startsWith('res-'));
      }

      // Check if user already added items in previous key (without legacy demo items)
      const legacyRaw = localStorage.getItem(STORAGE_KEYS.LEGACY_KEY);
      if (legacyRaw) {
        const legacyParsed: Resource[] = JSON.parse(legacyRaw);
        // Keep ONLY user-created items (which start with 'res_') and discard 'res-1'...'res-8'
        const userItems = legacyParsed.filter((item) => !item.id.startsWith('res-'));
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(userItems));
        return userItems;
      }

      return [];
    } catch (err) {
      console.error('Failed to read components from storage:', err);
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
        : 'Untitled Component';

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
          type: 'component',
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
      const id = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      savedItem = {
        id,
        title,
        description: resource.description || '',
        type: 'component',
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

    if (target?.previewImageUrl?.startsWith('idb:')) {
      imageDB.deleteImage(target.previewImageUrl);
    }
  },

  clearLibrary(): void {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.LEGACY_KEY);
    imageDB.clearAll();
  },
};
