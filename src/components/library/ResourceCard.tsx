import React, { useState } from 'react';
import {
  Star,
  ExternalLink,
  Copy,
  Check,
  MoreVertical,
  Edit2,
  Trash2,
  Terminal,
  Layers,
  Globe,
  PanelsTopLeft,
  Activity,
  Image as ImageIcon,
  Folder,
  Eye,
} from 'lucide-react';
import { Resource, Collection, ViewMode } from '../../types/resource';
import { copyToClipboard } from '../../lib/clipboard';
import { useToast } from '../layout/Toast';

interface ResourceCardProps {
  resource: Resource;
  collections: Collection[];
  viewMode?: ViewMode;
  onOpenDetails: (resource: Resource) => void;
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
  onToggleFavorite: (id: string) => void;
  onSelectTag?: (tag: string) => void;
  onSelectCollection?: (colId: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  collections,
  viewMode = 'grid',
  onOpenDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
  onSelectTag,
  onSelectCollection,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!resource.promptText) return;
    const ok = await copyToClipboard(resource.promptText, true);
    if (ok) {
      setCopied(true);
      toast('Prompt copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTypeBadge = () => {
    switch (resource.type) {
      case 'component':
        return { label: 'Component', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Layers };
      case 'prompt':
        return { label: 'AI Prompt', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Terminal };
      case 'website':
        return { label: 'Website', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Globe };
      case 'template':
        return { label: 'Template', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: PanelsTopLeft };
      case 'animation':
        return { label: 'Animation', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20', icon: Activity };
      case 'screenshot':
        return { label: 'Screenshot', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: ImageIcon };
      default:
        return { label: 'Resource', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', icon: Layers };
    }
  };

  const badge = getTypeBadge();
  const BadgeIcon = badge.icon;

  const resourceCollections = collections.filter((c) =>
    resource.collectionIds?.includes(c.id)
  );

  const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  // LIST VIEW LAYOUT
  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onOpenDetails(resource)}
        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#151518] border border-[#242428] hover:border-[#383842] hover:bg-[#18181D] transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Thumbnail / Type avatar */}
          <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 overflow-hidden flex items-center justify-center relative">
            {resource.previewImageUrl ? (
              <img
                src={resource.previewImageUrl}
                alt={resource.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            ) : (
              <BadgeIcon className="w-5 h-5 text-zinc-500" />
            )}
          </div>

          {/* Title, description & badges */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${badge.color}`}>
                <BadgeIcon className="w-3 h-3" />
                {badge.label}
              </span>
              <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors truncate">
                {resource.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-xl">
              {resource.description || (resource.promptText ? resource.promptText.slice(0, 100) : '')}
            </p>
          </div>
        </div>

        {/* Metadata & Actions */}
        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t border-zinc-800/60 sm:border-t-0">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {resource.sourceWebsiteName && (
              <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {resource.sourceWebsiteName}
              </span>
            )}
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {resource.promptText && (
              <button
                onClick={handleCopyPrompt}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                title="Copy prompt"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}

            {resource.sourceUrl && (
              <a
                href={resource.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                title="Open original website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => onToggleFavorite(resource.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                resource.isFavorite
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
              title={resource.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              onClick={() => onEdit(resource)}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
              title="Edit resource"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(resource)}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-900 transition-colors"
              title="Delete resource"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW LAYOUT (Default 21st.dev Style Preview Card)
  return (
    <div
      onClick={() => onOpenDetails(resource)}
      className="group relative flex flex-col rounded-xl bg-[#151518] border border-[#242428] hover:border-[#383842] hover:bg-[#18181D] transition-all duration-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/40"
    >
      {/* Top Preview Area */}
      <div className="relative h-44 w-full bg-[#101012] border-b border-[#242428] overflow-hidden flex items-center justify-center">
        {resource.previewImageUrl ? (
          <img
            src={resource.previewImageUrl}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : resource.promptText ? (
          // Readable prompt preview box
          <div className="w-full h-full p-3.5 bg-[#0C0C0E] font-mono text-[11px] text-zinc-400 overflow-hidden select-none relative">
            <div className="text-zinc-500 text-[10px] mb-1 flex items-center gap-1 font-sans">
              <Terminal className="w-3 h-3 text-amber-400" />
              <span>Prompt preview:</span>
            </div>
            <p className="line-clamp-6 leading-relaxed text-zinc-300">
              {resource.promptText}
            </p>
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0C0C0E] to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-zinc-600">
            <BadgeIcon className="w-8 h-8 opacity-40" />
            <span className="text-xs uppercase tracking-wider font-mono">No Preview</span>
          </div>
        )}

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-md border shadow-md ${badge.color} bg-black/60`}>
            <BadgeIcon className="w-3 h-3" />
            {badge.label}
          </span>
        </div>

        {/* Floating Quick Action Buttons on Card Hover */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {resource.promptText && (
            <button
              onClick={handleCopyPrompt}
              className="p-1.5 rounded-lg bg-black/75 hover:bg-black backdrop-blur-md border border-zinc-700/80 text-zinc-200 hover:text-white transition-all shadow-md"
              title="Quick copy prompt"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={() => onToggleFavorite(resource.id)}
            className={`p-1.5 rounded-lg backdrop-blur-md border shadow-md transition-all ${
              resource.isFavorite
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'bg-black/75 hover:bg-black border-zinc-700/80 text-zinc-300 hover:text-amber-400'
            }`}
            title={resource.isFavorite ? 'Starred' : 'Star resource'}
          >
            <Star className={`w-3.5 h-3.5 ${resource.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Source link pill in bottom left of image */}
        {resource.sourceWebsiteName && (
          <div className="absolute bottom-2.5 left-3 text-[10px] px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-zinc-400 border border-zinc-800/80 font-mono">
            {resource.sourceWebsiteName}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
            {resource.title}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {resource.description || (resource.promptText ? resource.promptText.slice(0, 120) : 'No description provided.')}
          </p>
        </div>

        {/* Tags & Collection Pills */}
        <div className="mt-3.5 pt-3 border-t border-[#242428] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {resourceCollections.length > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCollection?.(resourceCollections[0].id);
                }}
                className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-mono shrink-0 cursor-pointer"
                title={`Collection: ${resourceCollections[0].name}`}
              >
                <Folder className="w-2.5 h-2.5 text-blue-400" />
                <span className="truncate max-w-[80px]">{resourceCollections[0].name}</span>
              </span>
            )}

            {resource.tags?.slice(0, 2).map((t) => (
              <span
                key={t}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTag?.(t);
                }}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono truncate cursor-pointer"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* More options menu */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/80 transition-colors"
              title="More actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 bottom-full mb-1 w-44 rounded-xl bg-[#1A1A1E] border border-zinc-700/80 shadow-2xl py-1 z-30 text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenDetails(resource);
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-zinc-800/80 text-left"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Open details
                  </button>

                  {resource.sourceUrl && (
                    <a
                      href={resource.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-3 py-1.5 flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-zinc-800/80 text-left"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit original source
                    </a>
                  )}

                  {resource.promptText && (
                    <button
                      onClick={(e) => {
                        setMenuOpen(false);
                        handleCopyPrompt(e);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-zinc-800/80 text-left"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy prompt
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(resource);
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-zinc-800/80 text-left"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit resource
                  </button>

                  <div className="my-1 border-t border-zinc-800" />

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(resource);
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
