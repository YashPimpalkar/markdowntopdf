import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import mermaid from 'mermaid';
import type { PageLayoutConfig, ThemeId } from '../../types/document';
import { generateInlineStyles } from '../../services/styleGenerator';
import { sanitizeMermaidCode } from '../../services/markdownService';

interface MarkdownPreviewProps {
  html: string;
  themeId: ThemeId;
  config: PageLayoutConfig;
  title: string;
  printableRef: React.RefObject<HTMLDivElement | null>;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  html,
  themeId,
  config,
  title,
  printableRef,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate complete inline styles for this theme and page layout
  const inlineStyles = generateInlineStyles(themeId, config);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(175, Math.max(50, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  // Render Mermaid Flowcharts and Diagrams whenever HTML changes
  useEffect(() => {
    let isCancelled = false;

    const renderMermaid = async () => {
      if (!printableRef.current) return;
      const nodes = printableRef.current.querySelectorAll<HTMLElement>(
        '.mermaid-diagram:not([data-processed="true"])'
      );
      if (nodes.length === 0) return;

      const isAcademic = themeId === 'academic';
      const isTech = themeId === 'tech';
      const isExecutive = themeId === 'executive';
      const isEditorial = themeId === 'editorial';

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: isAcademic ? '"Merriweather", Georgia, serif' : 'Inter, system-ui, sans-serif',
          themeVariables: {
            primaryColor: isTech ? '#d1fae5' : isExecutive ? '#e0e7ff' : isEditorial ? '#fed7aa' : '#f1f5f9',
            primaryTextColor: '#0f172a',
            primaryBorderColor: isTech ? '#059669' : isExecutive ? '#4f46e5' : isEditorial ? '#ea580c' : '#475569',
            lineColor: '#64748b',
            secondaryColor: '#f8fafc',
            tertiaryColor: '#ffffff',
            fontSize: '13px',
          },
        });
      } catch {
        // Ignore initialization warning
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const raw = node.getAttribute('data-code') || node.textContent || '';
        const id = `mermaid-svg-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
        const sanitized = sanitizeMermaidCode(raw.trim());

        try {
          const { svg } = await mermaid.render(id, sanitized);
          if (!isCancelled) {
            node.innerHTML = svg;
            node.setAttribute('data-processed', 'true');
            const svgElement = node.querySelector('svg');
            if (svgElement) {
              svgElement.style.maxWidth = '100%';
              svgElement.style.height = 'auto';
              svgElement.style.display = 'block';
              svgElement.style.margin = '0 auto';
            }
          }
        } catch {
          // If initial render fails, try filtering out problematic non-core lines (like broken classDef)
          try {
            const fallbackCode = sanitized
              .split('\n')
              .filter((line) => {
                const tr = line.trim();
                if (tr.startsWith('classDef') && (!tr.includes(':') || !tr.includes(';'))) return false;
                return true;
              })
              .join('\n');

            const fallbackId = `${id}-fb`;
            const { svg } = await mermaid.render(fallbackId, fallbackCode);
            if (!isCancelled) {
              node.innerHTML = svg;
              node.setAttribute('data-processed', 'true');
              const svgElement = node.querySelector('svg');
              if (svgElement) {
                svgElement.style.maxWidth = '100%';
                svgElement.style.height = 'auto';
                svgElement.style.display = 'block';
                svgElement.style.margin = '0 auto';
              }
            }
          } catch (fallbackError) {
            console.warn('Mermaid render issue:', fallbackError);
            node.setAttribute('data-processed', 'error');
            const tmp = document.getElementById(id);
            if (tmp) tmp.remove();
            const dTmp = document.getElementById('d' + id);
            if (dTmp) dTmp.remove();
          }
        }
      }
    };

    const timer = setTimeout(renderMermaid, 50);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [html, printableRef]);

  return (
    <div
      ref={containerRef}
      className="preview-wrapper relative flex-1 h-full bg-slate-900/90 overflow-y-auto overflow-x-auto flex flex-col items-center py-8 px-4"
    >
      {/* Dynamic Inline CSS Style Injection */}
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />

      {/* Floating Zoom & Canvas Controls */}
      <div className="no-print fixed bottom-6 right-8 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-xl z-20 text-slate-300">
        <button
          onClick={() => handleZoom(-10)}
          className="p-1 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono font-medium min-w-[3rem] text-center select-none text-slate-200">
          {zoomLevel}%
        </span>

        <button
          onClick={() => handleZoom(10)}
          className="p-1 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-700" />

        <button
          onClick={handleResetZoom}
          className="p-1 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title="Reset Zoom to 100%"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Printable Paper Sheet Canvas */}
      <div
        className="paper-sheet-zoom-wrapper print:transform-none! print:block!"
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div
          ref={printableRef}
          id="pdf-printable-area"
          className="paper-sheet flex flex-col justify-between print:block!"
        >
          {/* Running Header */}
          {config.showHeader && (
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-6 text-[10px] text-slate-500 font-sans tracking-wide uppercase select-none">
              <span>{config.headerText || title || 'Document'}</span>
              <span>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          )}

          {/* Rendered Markdown Body */}
          <div
            className="markdown-body flex-1"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Running Footer */}
          {config.showFooter && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-8 text-[10px] text-slate-500 font-sans select-none">
              <span>{config.footerText || 'Confidential & Proprietary'}</span>
              {config.showPageNumbers && (
                <span className="font-mono">Page 1</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
