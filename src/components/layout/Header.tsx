import React from 'react';
import { Menu, Search, Plus, Sparkles } from 'lucide-react';
import { NavItem } from './Sidebar';

interface HeaderProps {
  currentTab: NavItem;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenAddModal: () => void;
  itemCount?: number;
}

const TAB_TITLES: Record<NavItem, { title: string; subtitle: string }> = {
  home: {
    title: 'Your Creative Library',
    subtitle: 'Everything worth saving, all in one place.',
  },
  'all-saved': {
    title: 'All Saved Resources',
    subtitle: 'Browse, filter, and search your personal design & prompt repository.',
  },
  components: {
    title: 'UI Components',
    subtitle: 'Interactive widgets, layouts, bento grids, and design primitives.',
  },
  prompts: {
    title: 'AI Prompt Library',
    subtitle: 'Copy-paste ready system prompts, engineering patterns, and design specs.',
  },
  websites: {
    title: 'Website Inspiration',
    subtitle: 'Curated references of cutting-edge web design and typography.',
  },
  templates: {
    title: 'Templates & Blueprints',
    subtitle: 'Starter boilerplates, project architectures, and layout structures.',
  },
  animations: {
    title: 'Motion & Animations',
    subtitle: 'Framer Motion physics, CSS micro-interactions, and visual transitions.',
  },
  screenshots: {
    title: 'Screenshots & UI Audits',
    subtitle: 'Visual captures of real-world interfaces, forms, and flows.',
  },
  favorites: {
    title: 'Starred Favorites',
    subtitle: 'Your most cherished and frequently referenced assets.',
  },
  recent: {
    title: 'Recently Added',
    subtitle: 'Fresh resources saved into your vault in reverse chronological order.',
  },
  collections: {
    title: 'Collections',
    subtitle: 'Custom thematic groups to structure your inspiration and workflows.',
  },
  tags: {
    title: 'Tag Explorer',
    subtitle: 'Browse resources organized by contextual keywords and technologies.',
  },
  settings: {
    title: 'Settings & Data Backup',
    subtitle: 'Manage local storage, export JSON backups, or restore demo states.',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenAddModal,
  itemCount,
}) => {
  const currentMeta = TAB_TITLES[currentTab] || {
    title: 'Creative Vault',
    subtitle: 'Personal Resource Management',
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0D0D0F]/85 backdrop-blur-md border-b border-[#242428] px-4 sm:px-8 py-4 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white flex items-center gap-2">
                {currentMeta.title}
                {itemCount !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono font-normal">
                    {itemCount}
                  </span>
                )}
              </h1>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block mt-0.5">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Search CTA & Add Resource */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151518] border border-[#242428] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs transition-all"
            title="Global Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Quick Search</span>
            <kbd className="hidden sm:inline-block text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1 py-0.2 rounded font-mono">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add to library</span>
          </button>
        </div>
      </div>
    </header>
  );
};
