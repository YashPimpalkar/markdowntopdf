import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Settings,
  BookOpen,
  Columns,
  Maximize2,
  FileDown,
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';
import type { ViewMode } from '../../types/document';

interface HeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  metrics: {
    words: number;
    chars: number;
    readingTimeMin: number;
    estimatedPages: number;
  };
  onOpenTemplates: () => void;
  onToggleSettings: () => void;
  isSettingsOpen: boolean;
  onPrint: () => void;
  onDirectPdfDownload: () => Promise<void>;
  onExportHtml: () => void;
  onExportMarkdown: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onTitleChange,
  viewMode,
  onViewModeChange,
  metrics,
  onOpenTemplates,
  onToggleSettings,
  isSettingsOpen,
  onPrint,
  onDirectPdfDownload,
  onExportHtml,
  onExportMarkdown,
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDirectDownload = async () => {
    try {
      setIsDownloading(true);
      await onDirectPdfDownload();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <header className="no-print h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between select-none z-30 relative shadow-sm">
      {/* Left: Brand & Document Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 text-white shrink-0">
          <FileText className="w-5 h-5" />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Untitled Document"
              className="bg-transparent hover:bg-slate-800/60 focus:bg-slate-800 border border-transparent focus:border-slate-700 rounded px-2 py-0.5 text-sm font-semibold text-slate-100 focus:outline-none transition-all truncate max-w-[200px] sm:max-w-[280px]"
            />
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Studio
            </span>
          </div>
          <div className="text-[11px] text-slate-400 px-2 flex items-center gap-2">
            <span>{metrics.words.toLocaleString()} words</span>
            <span>•</span>
            <span>~{metrics.estimatedPages} {metrics.estimatedPages === 1 ? 'page' : 'pages'}</span>
            <span>•</span>
            <span>{metrics.readingTimeMin} min read</span>
          </div>
        </div>
      </div>

      {/* Center: View Switcher */}
      <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
        <button
          onClick={() => onViewModeChange('editor')}
          title="Editor Only"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            viewMode === 'editor'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>

        <button
          onClick={() => onViewModeChange('split')}
          title="Split View"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            viewMode === 'split'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Split</span>
        </button>

        <button
          onClick={() => onViewModeChange('preview')}
          title="Preview Only"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            viewMode === 'preview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Templates Button */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/70 rounded-lg border border-slate-700 transition-all cursor-pointer shadow-sm"
          title="Browse Sample Templates"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Templates</span>
        </button>

        {/* Theme & Page Settings Toggle */}
        <button
          onClick={onToggleSettings}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer shadow-sm ${
            isSettingsOpen
              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
              : 'bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 hover:text-white border-slate-700'
          }`}
          title="Customize Theme & Layout"
        >
          <Settings className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Theme & Layout</span>
        </button>

        {/* Direct PDF Download Button */}
        <button
          onClick={handleDirectDownload}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          title="Download PDF directly"
        >
          {isDownloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : downloadSuccess ? (
            <Check className="w-3.5 h-3.5 text-white" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{downloadSuccess ? 'Downloaded!' : 'Download PDF'}</span>
        </button>

        {/* Vector Print / Browser PDF Button */}
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer active:scale-95"
          title="Print or Save via Browser (Highest Vector Quality)"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Print / Vector PDF</span>
        </button>

        {/* More Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/70 rounded-lg border border-slate-700 transition-all cursor-pointer"
            title="More Export Options"
          >
            <FileDown className="w-4 h-4" />
          </button>

          {isExportMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsExportMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    onExportHtml();
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export Standalone HTML</span>
                </button>
                <button
                  onClick={() => {
                    onExportMarkdown();
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>Export Raw Markdown (.md)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
