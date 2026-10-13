import React, { useState, useEffect } from 'react';
import {
  X,
  Folder,
  Layout,
  Sparkles,
  Gauge,
  Play,
  CodeXml,
  Terminal,
  Bookmark,
  Layers,
  Palette,
  Check,
} from 'lucide-react';
import { Collection } from '../../types/resource';
import { useToast } from '../layout/Toast';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collection: Collection) => void;
  initialData?: Collection | null;
}

const AVAILABLE_ICONS = [
  { name: 'layout', icon: Layout, label: 'Layout' },
  { name: 'sparkles', icon: Sparkles, label: 'Sparkles' },
  { name: 'gauge', icon: Gauge, label: 'Dashboard' },
  { name: 'play', icon: Play, label: 'Animation' },
  { name: 'code-xml', icon: CodeXml, label: 'Code' },
  { name: 'terminal', icon: Terminal, label: 'Terminal' },
  { name: 'folder', icon: Folder, label: 'Folder' },
  { name: 'palette', icon: Palette, label: 'Palette' },
];

const AVAILABLE_COLORS = [
  { hex: '#3B82F6', label: 'Blue' },
  { hex: '#8B5CF6', label: 'Purple' },
  { hex: '#EC4899', label: 'Pink' },
  { hex: '#10B981', label: 'Emerald' },
  { hex: '#F59E0B', label: 'Amber' },
  { hex: '#06B6D4', label: 'Cyan' },
  { hex: '#EF4444', label: 'Red' },
  { hex: '#71717A', label: 'Zinc' },
];

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('folder');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setColor(initialData.color || '#3B82F6');
      setIcon(initialData.icon || 'folder');
    } else {
      setName('');
      setDescription('');
      setColor('#3B82F6');
      setIcon('folder');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Collection name is required.');
      return;
    }

    const col: Collection = {
      id: initialData ? initialData.id : `col-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
    };

    onSave(col);
    toast(initialData ? 'Collection updated!' : 'Collection created successfully!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#131316] border border-[#27272A] rounded-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#242428]">
          <h3 className="text-base font-semibold text-white">
            {initialData ? 'Edit Collection' : 'Create New Collection'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Collection Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Hero Sections, SaaS Dashboards..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#27272A] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short explanation of what assets belong here..."
              className="w-full p-3 rounded-xl bg-[#16161A] border border-[#27272A] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                >
                  {color === c.hex && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Collection Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((i) => {
                const IconComp = i.icon;
                const isSelected = icon === i.name;
                return (
                  <button
                    key={i.name}
                    type="button"
                    onClick={() => setIcon(i.name)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 text-blue-400'
                        : 'bg-[#16161A] border-[#242428] text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{i.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#242428]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-950/40"
            >
              {initialData ? 'Update Collection' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
