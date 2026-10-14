import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  Globe,
  Terminal,
} from 'lucide-react';
import { Resource } from '../../types/resource';
import { ResourceImage } from '../common/ResourceImage';
import { copyToClipboard } from '../../lib/clipboard';
import { useToast } from '../layout/Toast';

interface ResourceCardProps {
  resource: Resource;
  onOpenDetails: (resource: Resource) => void;
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onOpenDetails,
  onEdit,
  onDelete,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

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

  const handleOpenSource = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(resource);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(resource);
  };

  return (
    <div
      onClick={() => onOpenDetails(resource)}
      className="group relative flex flex-col rounded-xl bg-[#111114] border border-[#202024] hover:border-[#383840] transition-all duration-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-black/70 flex-shrink-0"
    >
      {/* Prominent Screenshot Preview */}
      <div className="relative w-full aspect-[16/10] bg-[#0A0A0D] overflow-hidden">
        <ResourceImage
          src={resource.previewImageUrl}
          alt={resource.title}
          type={resource.type}
          aspectClass="w-full h-full"
        />

        {/* Hover overlay with action buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 pointer-events-none">
          {/* Top row actions */}
          <div className="flex items-center justify-between pointer-events-auto">
            {resource.sourceWebsiteName ? (
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-zinc-300 border border-zinc-700/60 font-mono flex items-center gap-1">
                <Globe className="w-2.5 h-2.5 text-zinc-400" />
                <span className="truncate max-w-[120px]">{resource.sourceWebsiteName}</span>
              </span>
            ) : <div />}

            <div className="flex items-center gap-1">
              <button
                onClick={handleEdit}
                className="p-1.5 rounded-lg bg-black/75 hover:bg-black text-zinc-300 hover:text-white border border-zinc-700/80 transition-colors shadow-sm"
                title="Edit resource"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg bg-black/75 hover:bg-rose-950/80 text-zinc-400 hover:text-rose-400 border border-zinc-700/80 hover:border-rose-900/60 transition-colors shadow-sm"
                title="Delete resource"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom row actions: Copy prompt & Open site */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {resource.promptText && (
              <button
                onClick={handleCopyPrompt}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md backdrop-blur-md border transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-black/80 hover:bg-black text-white border-zinc-700/80 hover:border-blue-500'
                }`}
                title="Copy full prompt"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-zinc-300" />}
                <span>{copied ? 'Copied' : 'Prompt'}</span>
              </button>
            )}

            {resource.sourceUrl && (
              <a
                href={resource.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOpenSource}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-black/80 hover:bg-black text-zinc-200 hover:text-white border border-zinc-700/80 flex items-center gap-1.5 transition-colors shadow-md"
                title="Visit website"
              >
                <ExternalLink className="w-3 h-3 text-zinc-400" />
                <span>Visit</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Card Info Below Image */}
      <div className="p-3 bg-[#111114] border-t border-[#1C1C20] flex flex-col gap-1">
        <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors truncate">
          {resource.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span className="truncate">{resource.sourceWebsiteName || 'Saved bookmark'}</span>
          {resource.promptText && (
            <span className="flex items-center gap-1 text-[10px] text-amber-500/80 font-mono">
              <Terminal className="w-2.5 h-2.5" />
              <span>Prompt</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
