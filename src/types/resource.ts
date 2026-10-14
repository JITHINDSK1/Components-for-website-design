export type ResourceType = 'component' | 'prompt' | 'website' | 'other';

export interface Resource {
  id: string;
  title: string;
  sourceUrl?: string;
  sourceWebsiteName?: string;
  promptText?: string;
  previewImageUrl?: string;
  description?: string;
  type: ResourceType;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type FilterCategory = 'all' | 'component' | 'prompt' | 'website' | 'other';
