import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { EditorToolbar } from './components/editor/EditorToolbar';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import type { MarkdownEditorHandle } from './components/editor/MarkdownEditor';
import { MarkdownPreview } from './components/preview/MarkdownPreview';
import { SettingsDrawer } from './components/controls/SettingsDrawer';
import { TemplateModal } from './components/modals/TemplateModal';
import { renderMarkdown, calculateDocumentMetrics } from './services/markdownService';
import { DOCUMENT_TEMPLATES } from './services/templates';
import {
  printDocument,
  downloadDirectPdf,
  exportStandaloneHtml,
  exportMarkdownFile,
} from './services/pdfService';
import type {
  ViewMode,
  ThemeId,
  PageLayoutConfig,
  DocumentTemplate,
} from './types/document';

export function App() {
  // Initial default template (Technical Spec)
  const defaultTemplate = DOCUMENT_TEMPLATES[0];

  const [markdown, setMarkdown] = useState<string>(defaultTemplate.content);
  const [documentTitle, setDocumentTitle] = useState<string>('Distributed Consensus Engine Spec');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('tech');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [splitRatio, setSplitRatio] = useState<number>(50); // percentage (50%)
  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);

  const [layoutConfig, setLayoutConfig] = useState<PageLayoutConfig>({
    pageSize: 'a4',
    orientation: 'portrait',
    margin: 'normal',
    showPageNumbers: true,
    showHeader: true,
    showFooter: true,
    headerText: 'Distributed Consensus Engine Spec',
    footerText: 'Confidential & Proprietary',
    baseFontSize: 10.5,
    lineHeight: 1.6,
    fontFamily: 'sans',
  });

  const editorRef = useRef<MarkdownEditorHandle>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  // Render markdown to styled HTML
  const renderedHtml = useMemo(() => renderMarkdown(markdown), [markdown]);

  // Compute document statistics (words, pages, reading time)
  const metrics = useMemo(() => calculateDocumentMetrics(markdown), [markdown]);

  // Toolbar action dispatcher
  const handleInsertMarkdown = (prefix: string, suffix?: string, placeholder?: string) => {
    editorRef.current?.insertText(prefix, suffix, placeholder);
  };

  // Load a chosen template
  const handleSelectTemplate = (template: DocumentTemplate) => {
    setMarkdown(template.content);
    setDocumentTitle(template.name);
    setSelectedTheme(template.defaultTheme);
    setLayoutConfig((prev) => ({
      ...prev,
      headerText: template.name,
    }));
  };

  // Export handlers
  const handlePrint = useCallback(() => {
    printDocument();
  }, []);

  const handleDirectPdf = useCallback(async () => {
    if (!printableRef.current) return;
    await downloadDirectPdf(printableRef.current, {
      filename: documentTitle.replace(/\s+/g, '_').toLowerCase(),
      themeId: selectedTheme,
      config: layoutConfig,
    });
  }, [documentTitle, selectedTheme, layoutConfig]);

  const handleExportHtml = useCallback(() => {
    exportStandaloneHtml(renderedHtml, selectedTheme, layoutConfig, documentTitle);
  }, [renderedHtml, selectedTheme, layoutConfig, documentTitle]);

  const handleExportMarkdown = useCallback(() => {
    exportMarkdownFile(markdown, documentTitle.replace(/\s+/g, '_').toLowerCase());
  }, [markdown, documentTitle]);

  // Handle draggable split-view resizer
  const handleMouseDownOnResizer = () => {
    setIsDraggingSplitter(true);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingSplitter) return;
      const newRatio = (e.clientX / window.innerWidth) * 100;
      if (newRatio >= 25 && newRatio <= 75) {
        setSplitRatio(newRatio);
      }
    },
    [isDraggingSplitter]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingSplitter(false);
  }, []);

  return (
    <div
      className="app-container w-full h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Application Bar */}
      <Header
        title={documentTitle}
        onTitleChange={setDocumentTitle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        metrics={metrics}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
        isSettingsOpen={isSettingsOpen}
        onPrint={handlePrint}
        onDirectPdfDownload={handleDirectPdf}
        onExportHtml={handleExportHtml}
        onExportMarkdown={handleExportMarkdown}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Markdown Editor */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div
            className="editor-pane flex flex-col h-full overflow-hidden transition-all"
            style={{
              width: viewMode === 'split' ? `${splitRatio}%` : '100%',
            }}
          >
            {/* Formatting Toolbar */}
            <EditorToolbar onInsertMarkdown={handleInsertMarkdown} />

            {/* Code / Text Editor */}
            <MarkdownEditor
              ref={editorRef}
              value={markdown}
              onChange={setMarkdown}
            />
          </div>
        )}

        {/* Draggable Divider (Split view only) */}
        {viewMode === 'split' && (
          <div
            onMouseDown={handleMouseDownOnResizer}
            className={`resizer-divider w-1 hover:w-1.5 bg-slate-800 hover:bg-indigo-500 cursor-col-resize transition-all z-20 shrink-0 relative flex items-center justify-center ${
              isDraggingSplitter ? 'bg-indigo-600 w-1.5' : ''
            }`}
          >
            <div className="w-3 h-8 rounded-full bg-slate-700 hover:bg-indigo-400 absolute flex items-center justify-center pointer-events-none">
              <div className="w-0.5 h-3 bg-slate-400" />
            </div>
          </div>
        )}

        {/* Right Column: High-Fidelity Paper Simulation & Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            className="flex-1 h-full overflow-hidden flex flex-col"
            style={{
              width: viewMode === 'split' ? `${100 - splitRatio}%` : '100%',
            }}
          >
            <MarkdownPreview
              html={renderedHtml}
              themeId={selectedTheme}
              config={layoutConfig}
              title={documentTitle}
              printableRef={printableRef}
            />
          </div>
        )}
      </div>

      {/* Theme & Layout Configuration Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedTheme={selectedTheme}
        onSelectTheme={setSelectedTheme}
        config={layoutConfig}
        onConfigChange={setLayoutConfig}
      />

      {/* Template Selection Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

export default App;
