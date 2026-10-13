import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Terminal,
  Layers,
  Globe,
  PanelsTopLeft,
  Activity,
  Image as ImageIcon,
  Star,
  Check,
  ClipboardPaste,
  Sparkles,
  Eye,
  Info,
} from 'lucide-react';
import { Resource, ResourceType, Collection } from '../../types/resource';
import { useToast } from '../layout/Toast';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resource: Resource) => void;
  collections: Collection[];
  initialData?: Resource | null; // For editing
}

const RESOURCE_TYPES: { type: ResourceType; label: string; icon: any }[] = [
  { type: 'component', label: 'UI Component', icon: Layers },
  { type: 'prompt', label: 'AI Prompt', icon: Terminal },
  { type: 'website', label: 'Website Ref', icon: Globe },
  { type: 'template', label: 'Template', icon: PanelsTopLeft },
  { type: 'animation', label: 'Animation', icon: Activity },
  { type: 'screenshot', label: 'Screenshot', icon: ImageIcon },
  { type: 'other', label: 'Other', icon: Layers },
];

const PRESET_IMAGE_SUGGESTIONS = [
  { label: 'Bento Grid', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dark Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' },
  { label: 'Aurora Gradient', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
  { label: 'Minimal Code', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Abstract Tech', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80' },
];

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  collections,
  initialData,
}) => {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'standard' | 'quick-prompt'>('standard');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('component');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceWebsiteName, setSourceWebsiteName] = useState('');
  const [description, setDescription] = useState('');
  const [promptText, setPromptText] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setType(initialData.type);
      setSourceUrl(initialData.sourceUrl || '');
      setSourceWebsiteName(initialData.sourceWebsiteName || '');
      setDescription(initialData.description || '');
      setPromptText(initialData.promptText || '');
      setPreviewImageUrl(initialData.previewImageUrl || '');
      setTags(initialData.tags || []);
      setSelectedCollectionIds(initialData.collectionIds || []);
      setNotes(initialData.notes || '');
      setIsFavorite(initialData.isFavorite || false);
      setActiveTab(initialData.type === 'prompt' ? 'quick-prompt' : 'standard');
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setTitle('');
    setType('component');
    setSourceUrl('');
    setSourceWebsiteName('');
    setDescription('');
    setPromptText('');
    setPreviewImageUrl('');
    setTagInput('');
    setTags([]);
    setSelectedCollectionIds([]);
    setNotes('');
    setIsFavorite(false);
    setErrors({});
    setShowPromptPreview(false);
  };

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const clean = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleToggleCollection = (colId: string) => {
    if (selectedCollectionIds.includes(colId)) {
      setSelectedCollectionIds(selectedCollectionIds.filter((id) => id !== colId));
    } else {
      setSelectedCollectionIds([...selectedCollectionIds, colId]);
    }
  };

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!title.trim()) {
      err.title = 'Resource title is required.';
    }
    if (type === 'prompt' && !promptText.trim()) {
      err.promptText = 'Prompt text cannot be empty for an AI Prompt resource.';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = (addAnother = false) => {
    if (!validate()) {
      toast('Please fill in required fields.', 'error');
      return;
    }

    const newResource: Resource = {
      id: initialData ? initialData.id : `res-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      type,
      sourceUrl: sourceUrl.trim(),
      sourceWebsiteName: sourceWebsiteName.trim() || (sourceUrl ? new URL(sourceUrl).hostname.replace('www.', '') : ''),
      description: description.trim(),
      promptText: promptText.trim() || undefined,
      previewImageUrl: previewImageUrl.trim() || undefined,
      tags,
      collectionIds: selectedCollectionIds,
      notes: notes.trim() || undefined,
      isFavorite,
      createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: initialData ? initialData.usageCount : 0,
    };

    onSave(newResource);
    toast(initialData ? 'Resource updated successfully!' : 'Saved to your creative vault!', 'success');

    if (addAnother) {
      resetForm();
    } else {
      onClose();
    }
  };

  const handleQuickPasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setPromptText(text);
        setType('prompt');
        setActiveTab('quick-prompt');
        if (!title) {
          // Auto-generate draft title from first line of prompt
          const firstLine = text.trim().split('\n')[0].slice(0, 50);
          setTitle(firstLine || 'Saved Prompt');
        }
        toast('Pasted prompt from clipboard!', 'info');
      }
    } catch {
      toast('Could not read clipboard. Please paste manually.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#121215] border border-[#27272A] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242428] bg-[#16161A] shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              {initialData ? 'Edit Saved Resource' : 'Add to Creative Library'}
            </h2>
            <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('standard');
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeTab === 'standard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('quick-prompt');
                  setType('prompt');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeTab === 'quick-prompt'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Paste Prompt</span>
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Quick Paste Prompt Banner */}
          {activeTab === 'quick-prompt' && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Optimized for saving AI prompts, system instructions, and LLM templates.</span>
              </div>
              <button
                type="button"
                onClick={handleQuickPasteFromClipboard}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium shrink-0 flex items-center gap-1.5 transition-colors"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Paste Clipboard
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Bento Grid with Interactive Glow Border, or Senior React System Prompt"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-colors ${
                errors.title
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-[#27272A] focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Resource Type Selection */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Resource Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RESOURCE_TYPES.map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setType(item.type)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 text-blue-400 shadow-sm'
                        : 'bg-[#16161A] border-[#242428] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source URL & Website Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Original Website URL
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => {
                  setSourceUrl(e.target.value);
                  if (!sourceWebsiteName && e.target.value) {
                    try {
                      const domain = new URL(e.target.value).hostname.replace('www.', '');
                      setSourceWebsiteName(domain);
                    } catch {}
                  }
                }}
                placeholder="https://21st.dev/r/aceternity/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#27272A] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Source Website Name
              </label>
              <input
                type="text"
                value={sourceWebsiteName}
                onChange={(e) => setSourceWebsiteName(e.target.value)}
                placeholder="e.g. 21st.dev, GitHub, Aceternity UI, Claude"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#27272A] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Brief Summary / Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key layout traits, technology stack, or reason for saving..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#27272A] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Prompt Text Field (Essential for prompts, optional for others) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Reusable Prompt / Spec Text</span>
                {type === 'prompt' && <span className="text-rose-400">*</span>}
              </label>

              {promptText && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {promptText.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPromptPreview(!showPromptPreview)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{showPromptPreview ? 'Edit raw' : 'Live preview'}</span>
                  </button>
                </div>
              )}
            </div>

            {showPromptPreview ? (
              <div className="w-full h-36 p-3.5 rounded-xl bg-[#0C0C0E] border border-[#27272A] text-xs text-zinc-200 font-mono overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {promptText}
              </div>
            ) : (
              <textarea
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value);
                  if (errors.promptText) setErrors((prev) => ({ ...prev, promptText: '' }));
                }}
                rows={5}
                placeholder="Paste the full, unmodified prompt text here. Supports unlimited lines..."
                className={`w-full p-3.5 rounded-xl bg-[#16161A] border text-xs text-white font-mono placeholder-zinc-500 focus:outline-none leading-relaxed resize-y ${
                  errors.promptText ? 'border-rose-500' : 'border-[#27272A] focus:border-blue-500'
                }`}
              />
            )}
            {errors.promptText && <p className="text-[11px] text-rose-400 mt-1">{errors.promptText}</p>}
          </div>

          {/* Preview Image URL & Quick Suggestions */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Preview Image URL (Optional)
            </label>
            <input
              type="url"
              value={previewImageUrl}
              onChange={(e) => setPreviewImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or direct screenshot link"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#27272A] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 mb-2"
            />

            {!previewImageUrl && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-zinc-500 font-mono">Suggested presets:</span>
                {PRESET_IMAGE_SUGGESTIONS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setPreviewImageUrl(preset.url)}
                    className="text-[11px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Tags (press Enter to add)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="e.g. bento-grid, tailwind, spring, dark-mode"
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#16161A] border border-[#27272A] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-medium transition-colors"
              >
                Add Tag
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-300 font-mono"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-zinc-500 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Collections Checkboxes */}
          {collections.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Assign to Collections
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {collections.map((col) => {
                  const isChecked = selectedCollectionIds.includes(col.id);
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => handleToggleCollection(col.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs border text-left transition-colors ${
                        isChecked
                          ? 'bg-blue-600/10 border-blue-500/50 text-white'
                          : 'bg-[#16161A] border-[#242428] text-zinc-400 hover:bg-zinc-800/40'
                      }`}
                    >
                      <span className="truncate">{col.name}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Personal Notes */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Personal Notes & Implementation Reminders
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Needs GPU optimization on mobile, or pair with Aceternity background"
              className="w-full p-3 rounded-xl bg-[#16161A] border border-[#27272A] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>

          {/* Star as Favorite toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#16161A] border border-[#242428]">
            <div className="flex items-center gap-2">
              <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-400 fill-current' : 'text-zinc-500'}`} />
              <span className="text-xs text-zinc-300 font-medium">Add to Favorites immediately</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                isFavorite ? 'bg-amber-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform transform absolute top-0.75 ${
                  isFavorite ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#242428] bg-[#16161A] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!initialData && (
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
              >
                Save & Add Another
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {initialData ? 'Update Resource' : 'Save to Library'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
