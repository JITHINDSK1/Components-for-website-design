export type ResourceType =
  | 'component'
  | 'prompt'
  | 'website'
  | 'template'
  | 'animation'
  | 'screenshot'
  | 'other';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  sourceUrl: string;
  sourceWebsiteName: string;
  promptText?: string;
  previewImageUrl?: string;
  tags: string[];
  collectionIds: string[];
  notes?: string;
  isFavorite: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  lastOpenedAt?: string;
  usageCount: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string; // hex or tailwind color name
  icon: string; // Lucide icon name
  createdAt: string;
}

export type SortOption =
  | 'recent_added'
  | 'recent_updated'
  | 'alphabetical'
  | 'most_used';

export type ViewMode = 'grid' | 'list';

export interface VaultSettings {
  defaultView: ViewMode;
  autoCopyCloseModal: boolean;
  theme: 'dark';
}
