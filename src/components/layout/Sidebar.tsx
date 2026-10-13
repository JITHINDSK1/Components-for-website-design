import React from 'react';
import {
  Home,
  LayoutGrid,
  Layers,
  Terminal,
  Globe,
  PanelsTopLeft,
  Activity,
  Image,
  Star,
  Clock,
  Folder,
  Hash,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Plus,
} from 'lucide-react';

export type NavItem =
  | 'home'
  | 'all-saved'
  | 'components'
  | 'prompts'
  | 'websites'
  | 'templates'
  | 'animations'
  | 'screenshots'
  | 'favorites'
  | 'recent'
  | 'collections'
  | 'tags'
  | 'settings';

interface SidebarProps {
  currentTab: NavItem;
  onNavigate: (tab: NavItem) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSearch: () => void;
  onOpenAddModal: () => void;
  stats: {
    total: number;
    favorites: number;
    prompts: number;
  };
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onOpenSearch,
  onOpenAddModal,
  stats,
  isMobileOpen,
  onCloseMobile,
}) => {
  const mainNav = [
    { id: 'home' as NavItem, label: 'Home', icon: Home },
    { id: 'all-saved' as NavItem, label: 'All Saved', icon: LayoutGrid, count: stats.total },
    { id: 'components' as NavItem, label: 'Components', icon: Layers },
    { id: 'prompts' as NavItem, label: 'Prompts', icon: Terminal, count: stats.prompts },
    { id: 'websites' as NavItem, label: 'Websites', icon: Globe },
    { id: 'templates' as NavItem, label: 'Templates', icon: PanelsTopLeft },
    { id: 'animations' as NavItem, label: 'Animations', icon: Activity },
    { id: 'screenshots' as NavItem, label: 'Screenshots', icon: Image },
  ];

  const orgNav = [
    { id: 'favorites' as NavItem, label: 'Favorites', icon: Star, count: stats.favorites },
    { id: 'recent' as NavItem, label: 'Recently Added', icon: Clock },
    { id: 'collections' as NavItem, label: 'Collections', icon: Folder },
    { id: 'tags' as NavItem, label: 'Tags', icon: Hash },
  ];

  const handleNavClick = (tab: NavItem) => {
    onNavigate(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#101012] border-r border-[#242428] transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-18' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Header & Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#242428] shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">v.</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                vault<span className="text-blue-500">.</span>
              </span>
              <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 ml-1">
                Local
              </span>
            </div>
          ) : (
            <div
              className="w-8 h-8 mx-auto rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center cursor-pointer"
              onClick={() => handleNavClick('home')}
            >
              <span className="text-blue-400 font-bold text-sm">v.</span>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Action: Quick Search & Add Resource Buttons */}
        <div className="p-3 border-b border-[#242428] space-y-2 shrink-0">
          <button
            onClick={onOpenSearch}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#151518] hover:bg-[#1A1A1E] text-zinc-400 hover:text-zinc-200 border border-[#242428] hover:border-zinc-700 text-xs transition-all ${
              isCollapsed ? 'justify-center px-0' : 'justify-between'
            }`}
            title="Search resources (Ctrl+K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              {!isCollapsed && <span>Search vault...</span>}
            </div>
            {!isCollapsed && (
              <kbd className="text-[10px] bg-zinc-900 border border-zinc-700/80 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                Ctrl K
              </kbd>
            )}
          </button>

          <button
            onClick={onOpenAddModal}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-950/40 transition-all ${
              isCollapsed ? 'px-0' : ''
            }`}
            title="Add new resource"
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && <span>Add to library</span>}
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5">
          {/* Main Navigation */}
          <div>
            {!isCollapsed && (
              <p className="px-2.5 mb-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
                Explore
              </p>
            )}
            <nav className="space-y-0.5">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 border border-transparent'
                    } ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-zinc-400'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && item.count !== undefined && (
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                          isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-zinc-800/60 text-zinc-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Organization */}
          <div>
            {!isCollapsed && (
              <p className="px-2.5 mb-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
                Organize
              </p>
            )}
            <nav className="space-y-0.5">
              {orgNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 border border-transparent'
                    } ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-zinc-400'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && item.count !== undefined && (
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                          isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-zinc-800/60 text-zinc-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: Stats & Settings */}
        <div className="p-3 border-t border-[#242428] shrink-0 space-y-2 bg-[#0E0E10]">
          {!isCollapsed && (
            <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1 font-mono">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3 h-3 text-zinc-500" />
                <span>{stats.total} items</span>
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Local storage
              </span>
            </div>
          )}

          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'settings'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Vault Settings & Backup"
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Settings & Data</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
