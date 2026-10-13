import React, { useState } from 'react';
import {
  Download,
  Upload,
  RefreshCw,
  Trash2,
  HardDrive,
  ShieldCheck,
  FileJson,
  Layers,
  Terminal,
  Folder,
  Hash,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { storage } from '../lib/storage';
import { useToast } from '../components/layout/Toast';
import { DeleteConfirmModal } from '../components/library/DeleteConfirmModal';

interface SettingsPageProps {
  onDataChanged: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onDataChanged }) => {
  const { toast } = useToast();
  const stats = storage.getStorageStats();
  const settings = storage.getSettings();

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Handle Export
  const handleExportJSON = () => {
    try {
      const json = storage.exportDataAsJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vault-library-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast('Library backup exported successfully!', 'success');
    } catch {
      toast('Failed to export library JSON.', 'error');
    }
  };

  // Handle File Input for Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
      setImportModalOpen(true);
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  // Execute Import
  const handleExecuteImport = () => {
    if (!importJsonText.trim()) {
      setImportStatus({ success: false, message: 'Please provide valid JSON text or upload a file.' });
      return;
    }

    const res = storage.importDataFromJSON(importJsonText, importMode);
    setImportStatus(res);

    if (res.success) {
      toast(res.message, 'success');
      onDataChanged();
      setTimeout(() => {
        setImportModalOpen(false);
        setImportJsonText('');
        setImportStatus(null);
      }, 1500);
    } else {
      toast(res.message, 'error');
    }
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    storage.resetDemoData();
    onDataChanged();
    setConfirmResetOpen(false);
    toast('Demo library restored to initial state!', 'success');
  };

  // Clear Library
  const handleClearLibrary = () => {
    storage.clearLibrary();
    onDataChanged();
    setConfirmClearOpen(false);
    toast('Library completely wiped from local storage.', 'info');
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#141418] border border-[#242428]">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Settings &amp; Data Management
        </h2>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Manage local storage retention, export portable backups, import JSON datasets, and inspect library footprint.
        </p>
      </div>

      {/* Storage & Library Statistics */}
      <div className="rounded-2xl bg-[#141418] border border-[#242428] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#242428] pb-4">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              Storage Footprint &amp; Counts
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Browser LocalStorage ({stats.storageKb} KB)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-xl bg-[#17171C] border border-[#27272C]">
            <span className="text-[11px] text-zinc-500 font-mono block mb-1">Total Assets</span>
            <span className="text-xl font-bold text-white font-mono">{stats.totalResources}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#17171C] border border-[#27272C]">
            <span className="text-[11px] text-zinc-500 font-mono block mb-1">AI Prompts</span>
            <span className="text-xl font-bold text-amber-400 font-mono">{stats.byType['prompt'] || 0}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#17171C] border border-[#27272C]">
            <span className="text-[11px] text-zinc-500 font-mono block mb-1">Collections</span>
            <span className="text-xl font-bold text-indigo-400 font-mono">{stats.totalCollections}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#17171C] border border-[#27272C]">
            <span className="text-[11px] text-zinc-500 font-mono block mb-1">Prompt Words</span>
            <span className="text-xl font-bold text-blue-400 font-mono">{stats.totalPromptWords.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Backup, Export & Import */}
      <div className="rounded-2xl bg-[#141418] border border-[#242428] p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <FileJson className="w-4 h-4 text-zinc-400" />
          <span>Data Portability &amp; Backups</span>
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your saved items live entirely inside this browser profile. Export a JSON backup periodically so you can restore or move your vault to any machine.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-950/40 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Library as JSON</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17171C] hover:bg-[#202026] border border-[#27272C] text-zinc-200 text-xs font-medium cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-zinc-400" />
            <span>Import JSON File...</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              setImportJsonText('');
              setImportStatus(null);
              setImportModalOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Paste JSON Manually
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset & Clear */}
      <div className="rounded-2xl bg-[#161314] border border-rose-950/50 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone</span>
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Restore initial sample data or wipe all resources currently saved in your browser storage.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Demo Library</span>
          </button>

          <button
            onClick={() => setConfirmClearOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Library</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 rounded-xl bg-[#121215] border border-[#222226] flex items-start gap-3 text-xs text-zinc-400 leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-zinc-200 block mb-0.5">Privacy First &amp; Account Free</strong>
          Vault runs 100% client-side in your browser. No authentication tokens, external database synchronizers, telemetry, or remote API trackers are used.
        </div>
      </div>

      {/* Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setImportModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#141418] border border-[#27272A] rounded-2xl shadow-2xl p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-semibold text-white">Import Library JSON</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Paste the exported JSON data or review your selected file. Choose between merging with existing data or replacing your current vault.
            </p>

            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setImportMode('merge')}
                className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                  importMode === 'merge'
                    ? 'bg-blue-600/15 border-blue-500 text-white'
                    : 'bg-[#18181D] border-[#242428] text-zinc-400'
                }`}
              >
                <strong className="block text-white mb-0.5">Merge (Recommended)</strong>
                Adds new items and preserves existing records.
              </button>

              <button
                type="button"
                onClick={() => setImportMode('replace')}
                className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                  importMode === 'replace'
                    ? 'bg-amber-600/15 border-amber-500 text-white'
                    : 'bg-[#18181D] border-[#242428] text-zinc-400'
                }`}
              >
                <strong className="block text-white mb-0.5">Replace Entirely</strong>
                Replaces current library with the imported JSON.
              </button>
            </div>

            {/* Textarea */}
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              rows={8}
              placeholder="Paste JSON here..."
              className="w-full p-3 rounded-xl bg-[#0D0D10] border border-zinc-800 text-xs text-zinc-200 font-mono focus:outline-none focus:border-blue-500"
            />

            {importStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  importStatus.success
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                {importStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{importStatus.message}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#242428]">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteImport}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-950/40"
              >
                Confirm Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <DeleteConfirmModal
        isOpen={confirmResetOpen}
        title="Restore Demo Library"
        itemName="Sample Resources"
        message="This will reset your library back to the initial set of 16+ curated components and AI prompts. Any custom items created might be replaced."
        onConfirm={handleResetDemoData}
        onCancel={() => setConfirmResetOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={confirmClearOpen}
        title="Wipe Entire Creative Library"
        itemName="All Resources & Collections"
        message="Are you sure you want to permanently erase every resource and collection from your browser? This action cannot be reversed without a JSON backup."
        onConfirm={handleClearLibrary}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
};
