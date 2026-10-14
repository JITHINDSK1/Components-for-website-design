import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  Terminal,
  Globe,
  Layers,
  Folder,
} from 'lucide-react';
import { Resource } from '../../types/resource';
import { ResourceImage } from '../common/ResourceImage';
import { copyToClipboard } from '../../lib/clipboard';
import { useToast } from '../layout/Toast';

interface ResourceDetailModalProps {
  isOpen: boolean;
  resource: Resource | null;
  onClose: () => void;
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  isOpen,
  resource,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

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
      setCopied(true);
      toast('Prompt copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTypeBadge = () => {
    switch (resource.type) {
      case 'component':
        return { label: 'Component', icon: Layers, pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'prompt':
        return { label: 'Prompt', icon: Terminal, pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'website':
        return { label: 'Website', icon: Globe, pill: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      default:
        return { label: 'Other', icon: Folder, pill: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' };
    }
  };

  const badge = getTypeBadge();
  const BadgeIcon = badge.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#121215] border border-[#26262B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full Image Banner (if available) */}
        {resource.previewImageUrl && (
          <div className="relative w-full max-h-72 bg-[#0C0C0E] border-b border-[#242428] overflow-hidden flex items-center justify-center">
            <ResourceImage
              src={resource.previewImageUrl}
              alt={resource.title}
              type={resource.type}
              aspectClass="max-h-72 w-full object-contain"
            />
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-3 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${badge.pill}`}>
                <BadgeIcon className="w-3.5 h-3.5" />
                {badge.label}
              </span>

              {resource.sourceWebsiteName && (
                <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50">
                  {resource.sourceWebsiteName}
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-white leading-snug">
              {resource.title}
            </h2>

            {resource.description && (
              <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                {resource.description}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: Prompt & Metadata */}
        <div className="px-6 py-3 overflow-y-auto flex-1 space-y-4">
          {/* Complete prompt if available */}
          {resource.promptText ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Saved Prompt</span>
                </span>
                <button
                  onClick={handleCopyPrompt}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0B0E] border border-[#232328] font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap select-text max-h-60 overflow-y-auto">
                {resource.promptText}
              </div>
            </div>
          ) : null}

          {/* Source Link Information */}
          {resource.sourceUrl && (
            <div className="p-3 rounded-xl bg-[#16161A] border border-[#26262B] flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0 flex-1">
                <span className="text-[11px] text-zinc-500 block">Original Source</span>
                <a
                  href={resource.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 truncate block underline-offset-2 hover:underline"
                >
                  {resource.sourceUrl}
                </a>
              </div>
              <a
                href={resource.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit Site</span>
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-[#222226] bg-[#101012] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(resource);
              }}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/50 flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                onDelete(resource);
                onClose();
              }}
              className="px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 border border-rose-900/30 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {resource.promptText && (
              <button
                onClick={handleCopyPrompt}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/25 flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
