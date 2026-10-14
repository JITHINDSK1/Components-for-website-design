import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Terminal,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { Resource } from '../../types/resource';
import { imageDB } from '../../lib/image-db';
import { useToast } from '../layout/Toast';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resource: Partial<Resource> & { id?: string }) => void;
  initialData?: Resource | null; // For editing
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [promptText, setPromptText] = useState('');
  const [description, setDescription] = useState('');

  // Image handling
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize or reset form
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSourceUrl(initialData.sourceUrl || '');
      setPromptText(initialData.promptText || '');
      setDescription(initialData.description || '');

      if (initialData.previewImageUrl) {
        if (initialData.previewImageUrl.startsWith('idb:')) {
          setImageMode('upload');
          imageDB.getImage(initialData.previewImageUrl).then((url) => {
            setPreviewDataUrl(url);
          });
        } else {
          setImageMode('url');
          setImageUrl(initialData.previewImageUrl);
          setPreviewDataUrl(initialData.previewImageUrl);
        }
      } else {
        setPreviewDataUrl(null);
        setImageUrl('');
      }
      setImageFile(null);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setTitle('');
    setSourceUrl('');
    setPromptText('');
    setDescription('');
    setImageMode('upload');
    setImageUrl('');
    setPreviewDataUrl(null);
    setImageFile(null);
    setIsSaving(false);
  };

  // Support pasting screenshot from clipboard directly
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleImageFileSelected(file);
            toast('Screenshot pasted from clipboard!', 'info');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  // Handle Ctrl+Enter or Cmd+Enter to save immediately
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleImageFileSelected = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('Please select an image file', 'error');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewDataUrl(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    try {
      let finalImageUrl = initialData?.previewImageUrl || '';

      // If user uploaded a new local file or pasted screenshot
      if (imageFile && previewDataUrl) {
        const imageId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        finalImageUrl = await imageDB.saveImage(imageId, previewDataUrl);
      } else if (imageMode === 'url' && imageUrl.trim()) {
        finalImageUrl = imageUrl.trim();
      } else if (!previewDataUrl && !imageUrl) {
        finalImageUrl = '';
      }

      const resourcePayload: Partial<Resource> & { id?: string } = {
        id: initialData?.id,
        title: title.trim(),
        sourceUrl: sourceUrl.trim(),
        promptText: promptText,
        description: description.trim(),
        type: 'component',
        previewImageUrl: finalImageUrl,
      };

      onSave(resourcePayload);
      toast(initialData ? 'Component updated!' : 'Component saved to library!', 'success');
      onClose();
    } catch (err) {
      console.error('Error saving component:', err);
      toast('Failed to save component', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl bg-[#111114] border border-[#222226] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E22]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1853DB]/20 border border-[#1853DB]/40 flex items-center justify-center text-blue-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {initialData ? 'Edit Component' : 'Add Component'}
              </h2>
              <p className="text-xs text-zinc-400">
                {initialData
                  ? 'Update component details and prompt'
                  : 'Save screenshot, prompt, and source URL in your local library'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Screenshot / Image Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">Screenshot / Image</label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`text-[11px] transition-colors ${
                    imageMode === 'upload' ? 'text-blue-400 font-medium' : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                >
                  Upload File
                </button>
                <span className="text-zinc-700">|</span>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`text-[11px] transition-colors ${
                    imageMode === 'url' ? 'text-blue-400 font-medium' : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {previewDataUrl ? (
              <div className="relative rounded-xl border border-[#222226] bg-[#16161A] p-2.5 flex items-center gap-3">
                <img
                  src={previewDataUrl}
                  alt="Preview"
                  className="w-16 h-14 object-cover rounded-lg border border-zinc-700/50 shrink-0"
                />
                <div className="min-w-0 flex-1 text-xs">
                  <p className="text-zinc-200 font-medium truncate">
                    {imageFile ? imageFile.name : 'Screenshot preview loaded'}
                  </p>
                  <p className="text-[10px] text-zinc-500">Stored persistently in private local database</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors shrink-0"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : imageMode === 'upload' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-[#28282F] hover:border-blue-500/50 bg-[#141417] hover:bg-[#18181D] rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className="p-2.5 rounded-xl bg-zinc-800/80 group-hover:bg-[#1853DB]/20 text-zinc-400 group-hover:text-blue-400 transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs text-zinc-200 font-medium">
                  Click to upload screenshot or drag image here
                </div>
                <div className="text-[11px] text-zinc-500">
                  Tip: You can also press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">Ctrl+V</kbd> to paste a screenshot directly
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFileSelected(file);
                  }}
                />
              </div>
            ) : (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewDataUrl(e.target.value);
                }}
                placeholder="https://images.unsplash.com/... or any image URL"
                className="w-full bg-[#16161A] border border-[#222226] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#1853DB] transition-colors"
              />
            )}
          </div>

          {/* Title field (optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">Title</label>
              <span className="text-[11px] text-zinc-500">Auto-generated if left empty</span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Halden Typography or Liquid Glass Button"
              className="w-full bg-[#16161A] border border-[#222226] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#1853DB] transition-colors"
            />
          </div>

          {/* Prompt field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Prompt / Code</span>
                <span className="text-[11px] text-zinc-500 font-normal">(Optional)</span>
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Press Ctrl+Enter to save</span>
            </div>
            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Paste complete prompt or code instructions here... formatting and line breaks are preserved."
              className="w-full bg-[#16161A] border border-[#222226] rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#1853DB] transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* Source URL field */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Source URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <LinkIcon className="w-3.5 h-3.5" />
              </div>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://21st.dev/... or https://github.com/..."
                className="w-full bg-[#16161A] border border-[#222226] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#1853DB] transition-colors"
              />
            </div>
          </div>

          {/* Description field (optional) */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Description <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short note about animation, tags, or usage context..."
              className="w-full bg-[#16161A] border border-[#222226] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#1853DB] transition-colors"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E1E22] bg-[#0E0E11]">
          <div className="text-[11px] text-zinc-500 hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">Ctrl+Enter</kbd> to save
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1853DB] hover:bg-[#1D5BF0] disabled:opacity-50 text-white shadow-sm shadow-blue-500/30 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{initialData ? 'Update Component' : 'Save Component'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
