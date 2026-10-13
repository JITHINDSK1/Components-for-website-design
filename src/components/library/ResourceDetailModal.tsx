import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  Terminal,
  Layers,
  Globe,
  PanelsTopLeft,
  Activity,
  Image as ImageIcon,
  Folder,
  Calendar,
  Clock,
  Sparkles,
  Save,
  CheckCircle,
} from 'lucide-react';
import { Resource, Collection } from '../../types/resource';
import { copyToClipboard, formatCopyWithContext } from '../../lib/clipboard';
import { useToast } from '../layout/Toast';

interface ResourceDetailModalProps {
  resource: Resource | null;
  allResources: Resource[];
  collections: Collection[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
  onToggleFavorite: (id: string) => void;
  onMarkAsUsed: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onOpenResource: (resource: Resource) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  allResources,
  collections,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onMarkAsUsed,
  onUpdateNotes,
  onOpenResource,
}) => {
  const { toast } = useToast();
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedContext, setCopiedContext] = useState(false);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    if (resource) {
      setNotes(resource.notes || '');
      setIsEditingNotes(false);
    }
  }, [resource]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !resource) return null;

  const handleCopyPrompt = async () => {
    if (!resource.promptText) return;
    const ok = await copyToClipboard(resource.promptText, true);
    if (ok) {
      setCopiedPrompt(true);
      onMarkAsUsed(resource.id);
      toast('Prompt copied to clipboard!', 'success');
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleCopyWithContext = async () => {
    if (!resource.promptText) return;
    const formatted = formatCopyWithContext(
      resource.title,
      resource.sourceUrl,
      resource.promptText
    );
    const ok = await copyToClipboard(formatted, true);
    if (ok) {
      setCopiedContext(true);
      onMarkAsUsed(resource.id);
      toast('Prompt copied with context headers!', 'success');
      setTimeout(() => setCopiedContext(false), 2000);
    }
  };

  const handleSaveNotes = () => {
    onUpdateNotes(resource.id, notes);
    setIsEditingNotes(false);
    toast('Personal notes updated', 'info');
  };

  const resourceCollections = collections.filter((c) =>
    resource.collectionIds?.includes(c.id)
  );

  // Find related resources by matching tags or same type
  const relatedResources = allResources
    .filter(
      (r) =>
        r.id !== resource.id &&
        (r.type === resource.type ||
          r.tags?.some((t) => resource.tags?.includes(t)))
    )
    .slice(0, 3);

  const formattedCreated = new Date(resource.createdAt).toLocaleDateString(
    'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#121215] border border-[#27272A] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242428] bg-[#16161A] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xs uppercase font-mono tracking-wider px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              {resource.type}
            </span>
            {resource.sourceWebsiteName && (
              <span className="text-xs text-zinc-400 font-mono">
                from <span className="text-zinc-200">{resource.sourceWebsiteName}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(resource.id)}
              className={`p-2 rounded-lg border transition-colors ${
                resource.isFavorite
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
              title={resource.isFavorite ? 'Starred' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${resource.isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(resource);
              }}
              className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Edit resource"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                onDelete(resource);
              }}
              className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-rose-400 hover:border-rose-800 transition-colors"
              title="Delete resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-zinc-800 mx-1" />

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Description */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              {resource.title}
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {resource.description || 'No description provided.'}
            </p>
          </div>

          {/* Large Preview Media (If Image exists) */}
          {resource.previewImageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-[#27272A] bg-zinc-950 max-h-80 flex items-center justify-center">
              <img
                src={resource.previewImageUrl}
                alt={resource.title}
                className="w-full h-full object-cover max-h-80"
              />
              {resource.sourceUrl && (
                <a
                  href={resource.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black backdrop-blur-md border border-zinc-700 text-xs text-white font-medium shadow-lg transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visit original website
                </a>
              )}
            </div>
          )}

          {/* If prompt exists: High-precision Prompt Box & Action Bar */}
          {resource.promptText && (
            <div className="rounded-xl border border-[#27272A] bg-[#0E0E11] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#151518] border-b border-[#242428]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-zinc-200">
                    Reusable Prompt Spec
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    ({resource.promptText.trim().split(/\s+/).length} words)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyWithContext}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                    title="Copy prompt with origin comments"
                  >
                    {copiedContext ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    <span>Copy with Context</span>
                  </button>

                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-950/40 transition-colors"
                    title="Copy raw prompt"
                  >
                    {copiedPrompt ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy Prompt</span>
                  </button>
                </div>
              </div>

              {/* Prompt Text Monospace Area */}
              <div className="p-4 overflow-x-auto max-h-72">
                <pre className="font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed select-text">
                  {resource.promptText}
                </pre>
              </div>

              {/* Prompt Usage Footer */}
              <div className="px-4 py-2.5 bg-[#121215] border-t border-[#242428] flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-3">
                  <span>
                    Used <strong className="text-zinc-200">{resource.usageCount || 0}</strong> times
                  </span>
                  {resource.lastOpenedAt && (
                    <span>
                      • Last used {new Date(resource.lastOpenedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    onMarkAsUsed(resource.id);
                    toast('Marked prompt as used', 'info');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark as used
                </button>
              </div>
            </div>
          )}

          {/* Source Link if not shown on image */}
          {resource.sourceUrl && !resource.previewImageUrl && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#151518] border border-[#242428]">
              <div className="flex items-center gap-2 text-xs text-zinc-300 truncate">
                <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
                <span className="text-zinc-500">Source:</span>
                <span className="font-mono truncate">{resource.sourceUrl}</span>
              </div>
              <a
                href={resource.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors shrink-0"
              >
                <span>Visit site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Tags and Collections */}
          <div className="space-y-3">
            {/* Collections */}
            {resourceCollections.length > 0 && (
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono block mb-1.5">
                  Collections
                </span>
                <div className="flex flex-wrap gap-2">
                  {resourceCollections.map((col) => (
                    <span
                      key={col.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-200 font-medium"
                    >
                      <Folder className="w-3.5 h-3.5 text-blue-400" />
                      {col.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono block mb-1.5">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Personal Notes (Editable Section) */}
          <div className="rounded-xl border border-[#242428] bg-[#151518] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                Personal Notes & Implementation Tips
              </span>
              {!isEditingNotes ? (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit notes
                </button>
              ) : (
                <button
                  onClick={handleSaveNotes}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes, implementation quirks, keyboard shortcuts, or project ideas here..."
                  className="w-full h-24 p-2.5 rounded-lg bg-[#0E0E11] border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 leading-relaxed font-sans resize-y"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setNotes(resource.notes || '');
                      setIsEditingNotes(false);
                    }}
                    className="px-2.5 py-1 rounded text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs text-white"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 leading-relaxed italic">
                {notes ? notes : 'No personal notes added yet. Click edit to add implementation details.'}
              </p>
            )}
          </div>

          {/* Metadata Footer */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-3 border-t border-[#242428] font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Saved {formattedCreated}
            </span>
            <span>•</span>
            <span>ID: {resource.id}</span>
          </div>

          {/* Related Saved Resources */}
          {relatedResources.length > 0 && (
            <div className="pt-4 border-t border-[#242428]">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono mb-3">
                Related in Your Vault
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedResources.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onOpenResource(rel)}
                    className="p-3 rounded-xl bg-[#16161A] border border-[#242428] hover:border-zinc-600 transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-1">
                      {rel.type}
                    </span>
                    <h5 className="text-xs font-semibold text-zinc-200 group-hover:text-blue-400 truncate">
                      {rel.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
