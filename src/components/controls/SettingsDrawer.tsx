import React from 'react';
import {
  X,
  Palette,
  Layout,
  Type,
  FileCheck,
  Check,
} from 'lucide-react';
import type {
  PageLayoutConfig,
  ThemeId,
  PageSize,
  Orientation,
  MarginOption,
  DocumentTheme,
} from '../../types/document';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  config: PageLayoutConfig;
  onConfigChange: (newConfig: PageLayoutConfig) => void;
}

const THEME_OPTIONS: DocumentTheme[] = [
  {
    id: 'tech',
    name: 'Tech & Dev',
    description: 'Modern developer spec with indigo accents and JetBrains Mono code cards.',
    fontFamily: 'Inter',
    headingFont: 'Inter',
    primaryColor: '#09090b',
    accentColor: '#6366f1',
    backgroundColor: '#ffffff',
    previewBg: 'from-indigo-900/40 to-slate-900',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Corporate business report with deep navy headers and warm amber accents.',
    fontFamily: 'Inter',
    headingFont: 'Inter',
    primaryColor: '#0f172a',
    accentColor: '#b45309',
    backgroundColor: '#ffffff',
    previewBg: 'from-amber-900/40 to-slate-900',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Traditional research paper with Merriweather serif, Oxford blue, and centered titles.',
    fontFamily: 'Merriweather',
    headingFont: 'Merriweather',
    primaryColor: '#0f172a',
    accentColor: '#1e40af',
    backgroundColor: '#ffffff',
    previewBg: 'from-blue-900/40 to-slate-900',
  },
  {
    id: 'editorial',
    name: 'Editorial / Book',
    description: 'Literary elegance with Playfair Display headings and crimson accents.',
    fontFamily: 'Playfair Display',
    headingFont: 'Playfair Display',
    primaryColor: '#1c1917',
    accentColor: '#991b1b',
    backgroundColor: '#ffffff',
    previewBg: 'from-rose-900/40 to-slate-900',
  },
  {
    id: 'minimal',
    name: 'Swiss Minimal',
    description: 'High-contrast monochrome typography with clean emerald touches.',
    fontFamily: 'System Sans',
    headingFont: 'System Sans',
    primaryColor: '#000000',
    accentColor: '#059669',
    backgroundColor: '#ffffff',
    previewBg: 'from-emerald-900/40 to-slate-900',
  },
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  selectedTheme,
  onSelectTheme,
  config,
  onConfigChange,
}) => {
  if (!isOpen) return null;

  const updateConfig = (partial: Partial<PageLayoutConfig>) => {
    onConfigChange({ ...config, ...partial });
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl z-10 text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Theme & Document Layout</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section: Themes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              Document Style Themes
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onSelectTheme(theme.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/30 shadow-md ring-1 ring-indigo-500/50'
                        : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                        <span className="font-semibold text-sm text-white">{theme.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                          {theme.fontFamily}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pr-2">
                        {theme.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Paper Size & Orientation */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <Layout className="w-3.5 h-3.5 text-emerald-400" />
              Paper & Geometry
            </label>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-xs text-slate-400 block mb-1.5">Page Size</span>
                <select
                  value={config.pageSize}
                  onChange={(e) => updateConfig({ pageSize: e.target.value as PageSize })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="a4">A4 (210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="legal">Legal (8.5 × 14 in)</option>
                  <option value="a5">A5 (148 × 210 mm)</option>
                </select>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1.5">Orientation</span>
                <select
                  value={config.orientation}
                  onChange={(e) => updateConfig({ orientation: e.target.value as Orientation })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1.5">Page Margins</span>
              <div className="grid grid-cols-3 gap-2">
                {(['compact', 'normal', 'relaxed'] as MarginOption[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateConfig({ margin: m })}
                    className={`py-1.5 px-2 text-xs rounded-lg border font-medium capitalize transition-all cursor-pointer ${
                      config.margin === m
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Typography */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <Type className="w-3.5 h-3.5 text-sky-400" />
              Typography & Spacing
            </label>

            <div className="space-y-4 bg-slate-800/30 p-3.5 rounded-xl border border-slate-800">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Base Font Size</span>
                  <span className="font-mono text-white font-medium">{config.baseFontSize} pt</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="14"
                  step="0.5"
                  value={config.baseFontSize}
                  onChange={(e) => updateConfig({ baseFontSize: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Line Spacing</span>
                  <span className="font-mono text-white font-medium">{config.lineHeight}x</span>
                </div>
                <input
                  type="range"
                  min="1.3"
                  max="2.0"
                  step="0.1"
                  value={config.lineHeight}
                  onChange={(e) => updateConfig({ lineHeight: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section: Running Headers & Footers */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              Headers & Footers
            </label>

            <div className="space-y-3 bg-slate-800/30 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={config.showHeader}
                    onChange={(e) => updateConfig({ showHeader: e.target.checked })}
                    className="rounded accent-indigo-500"
                  />
                  <span className="text-slate-200 font-medium">Show Running Header</span>
                </label>
                {config.showHeader && (
                  <input
                    type="text"
                    value={config.headerText}
                    onChange={(e) => updateConfig({ headerText: e.target.value })}
                    placeholder="Custom Header Text (defaults to Title)"
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                )}
              </div>

              <div className="pt-2 border-t border-slate-700/60">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={config.showFooter}
                    onChange={(e) => updateConfig({ showFooter: e.target.checked })}
                    className="rounded accent-indigo-500"
                  />
                  <span className="text-slate-200 font-medium">Show Running Footer</span>
                </label>
                {config.showFooter && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={config.footerText}
                      onChange={(e) => updateConfig({ footerText: e.target.value })}
                      placeholder="Footer Text (e.g. Confidential)"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={config.showPageNumbers}
                        onChange={(e) => updateConfig({ showPageNumbers: e.target.checked })}
                        className="rounded accent-indigo-500"
                      />
                      <span className="text-slate-400">Include Page Numbers</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-md"
          >
            Apply & Close
          </button>
        </div>
      </aside>
    </div>
  );
};
