import { Resource, SortOption, ResourceType } from '../types/resource';

export interface FilterOptions {
  query?: string;
  type?: ResourceType | 'all';
  collectionId?: string;
  tag?: string;
  favoritesOnly?: boolean;
  sortBy?: SortOption;
}

export function filterAndSortResources(
  resources: Resource[],
  filters: FilterOptions
): Resource[] {
  let result = [...resources];

  // 1. Text Query Search (title, description, promptText, tags, notes, source)
  if (filters.query && filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    result = result.filter((r) => {
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q);
      const matchPrompt = r.promptText?.toLowerCase().includes(q);
      const matchSource = r.sourceWebsiteName?.toLowerCase().includes(q) || r.sourceUrl?.toLowerCase().includes(q);
      const matchNotes = r.notes?.toLowerCase().includes(q);
      const matchTags = r.tags?.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchPrompt || matchSource || matchNotes || matchTags;
    });
  }

  // 2. Resource Type
  if (filters.type && filters.type !== 'all') {
    result = result.filter((r) => r.type === filters.type);
  }

  // 3. Collection
  if (filters.collectionId && filters.collectionId !== 'all') {
    result = result.filter((r) => r.collectionIds?.includes(filters.collectionId!));
  }

  // 4. Tag
  if (filters.tag && filters.tag !== 'all') {
    const targetTag = filters.tag.toLowerCase();
    result = result.filter((r) => r.tags?.some((t) => t.toLowerCase() === targetTag));
  }

  // 5. Favorites Only
  if (filters.favoritesOnly) {
    result = result.filter((r) => r.isFavorite);
  }

  // 6. Sorting
  const sortBy = filters.sortBy || 'recent_added';
  result.sort((a, b) => {
    switch (sortBy) {
      case 'recent_added':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'recent_updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'most_used':
        return (b.usageCount || 0) - (a.usageCount || 0);
      default:
        return 0;
    }
  });

  return result;
}
