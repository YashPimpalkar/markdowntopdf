import type { PageLayoutConfig, ThemeId } from '../types/document';

export interface PaperDimensions {
  widthMm: number;
  heightMm: number;
}

export const PAGE_SIZES: Record<string, PaperDimensions> = {
  a4: { widthMm: 210, heightMm: 297 },
  letter: { widthMm: 215.9, heightMm: 279.4 },
  legal: { widthMm: 215.9, heightMm: 355.6 },
  a5: { widthMm: 148, heightMm: 210 },
};

export const MARGIN_VALUES_MM: Record<string, number> = {
  compact: 15,
  normal: 22,
  relaxed: 30,
};

/**
 * Returns theme variable configurations for inline styling
 */
export function getThemeTokens(themeId: ThemeId) {
  switch (themeId) {
    case 'academic':
      return {
        fontFamily: "'Merriweather', Georgia, serif",
        headingFont: "'Merriweather', Georgia, serif",
        headingColor: '#0f172a',
        textColor: '#1e293b',
        accentColor: '#1e40af',
        borderColor: '#e2e8f0',
        tableHeaderBg: '#f8fafc',
        tableZebraBg: '#fbfcfe',
        quoteBg: '#f8fafc',
        h1Align: 'center',
        h1Border: '2px solid #0f172a',
        h2Border: '1px solid #cbd5e1',
      };
    case 'executive':
      return {
        fontFamily: "'Inter', system-ui, sans-serif",
        headingFont: "'Inter', system-ui, sans-serif",
        headingColor: '#0f172a',
        textColor: '#334155',
        accentColor: '#b45309',
        borderColor: '#e2e8f0',
        tableHeaderBg: '#0f172a',
        tableZebraBg: '#fafaf9',
        quoteBg: '#fffbeb',
        h1Align: 'left',
        h1Border: 'none',
        h1BorderLeft: '6px solid #b45309',
        h2Border: '2px solid #b45309',
      };
    case 'tech':
      return {
        fontFamily: "'Inter', system-ui, sans-serif",
        headingFont: "'Inter', system-ui, sans-serif",
        headingColor: '#09090b',
        textColor: '#27272a',
        accentColor: '#6366f1',
        borderColor: '#e4e4e7',
        tableHeaderBg: '#f4f4f5',
        tableZebraBg: '#fafafa',
        quoteBg: '#f4f4f5',
        h1Align: 'left',
        h1Border: '2px solid #6366f1',
        h2Border: '1px dashed #e4e4e7',
      };
    case 'editorial':
      return {
        fontFamily: "'Playfair Display', Georgia, serif",
        headingFont: "'Playfair Display', Georgia, serif",
        headingColor: '#1c1917',
        textColor: '#292524',
        accentColor: '#991b1b',
        borderColor: '#e7e5e4',
        tableHeaderBg: '#f5f5f4',
        tableZebraBg: '#fafaf9',
        quoteBg: '#fef2f2',
        h1Align: 'center',
        h1Border: '3px double #991b1b',
        h2Border: '1px solid #e7e5e4',
      };
    case 'minimal':
    default:
      return {
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        headingFont: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        headingColor: '#000000',
        textColor: '#171717',
        accentColor: '#059669',
        borderColor: '#e5e5e5',
        tableHeaderBg: '#fafafa',
        tableZebraBg: '#ffffff',
        quoteBg: '#f5f5f5',
        h1Align: 'left',
        h1Border: '1px solid #000000',
        h2Border: '1px solid #e5e5e5',
      };
  }
}

/**
 * Generates an inline CSS string incorporating typography, print rules,
 * page-break controls, theme tokens, and markdown element styling.
 */
export function generateInlineStyles(themeId: ThemeId, config: PageLayoutConfig): string {
  const theme = getThemeTokens(themeId);
  const marginMm = config.customMarginMm ?? MARGIN_VALUES_MM[config.margin] ?? 20;
  const isLandscape = config.orientation === 'landscape';
  const paper = PAGE_SIZES[config.pageSize] || PAGE_SIZES.a4;
  const sheetWidthMm = isLandscape ? paper.heightMm : paper.widthMm;
  const sheetHeightMm = isLandscape ? paper.widthMm : paper.heightMm;

  return `
    /* --- CSS Variables & Theme Tokens --- */
    :root {
      --doc-font-family: ${theme.fontFamily};
      --doc-heading-font: ${theme.headingFont};
      --doc-heading-color: ${theme.headingColor};
      --doc-text: ${theme.textColor};
      --doc-accent-color: ${theme.accentColor};
      --doc-border-color: ${theme.borderColor};
      --doc-table-header-bg: ${theme.tableHeaderBg};
      --doc-table-zebra-bg: ${theme.tableZebraBg};
      --doc-quote-bg: ${theme.quoteBg};
      --doc-font-size: ${config.baseFontSize}pt;
      --doc-line-height: ${config.lineHeight};
    }

    /* --- Paper Sheet Base Styles --- */
    .paper-sheet {
      width: ${sheetWidthMm}mm;
      min-height: ${sheetHeightMm}mm;
      padding: ${marginMm}mm;
      background: #ffffff;
      color: var(--doc-text);
      font-family: var(--doc-font-family);
      font-size: var(--doc-font-size);
      line-height: var(--doc-line-height);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      position: relative;
      margin: 0 auto;
      box-sizing: border-box;
      transition: all 0.2s ease-in-out;
    }

    /* --- Markdown Content Styles --- */
    .markdown-body {
      word-wrap: break-word;
    }

    .markdown-body h1,
    .markdown-body h2,
    .markdown-body h3,
    .markdown-body h4,
    .markdown-body h5,
    .markdown-body h6 {
      font-family: var(--doc-heading-font);
      color: var(--doc-heading-color);
      font-weight: 700;
      line-height: 1.25;
      margin-top: 1.4em;
      margin-bottom: 0.5em;
      break-after: avoid;
      page-break-after: avoid;
    }

    .markdown-body h1 {
      font-size: 2.1em;
      letter-spacing: -0.025em;
      text-align: ${theme.h1Align};
      border-bottom: ${theme.h1Border};
      ${theme.h1BorderLeft ? `border-left: ${theme.h1BorderLeft}; padding-left: 0.5em;` : ''}
      padding-bottom: 0.3em;
      margin-top: 0;
    }

    .markdown-body h2 {
      font-size: 1.5em;
      letter-spacing: -0.015em;
      border-bottom: ${theme.h2Border};
      padding-bottom: 0.25em;
    }

    .markdown-body h3 {
      font-size: 1.25em;
    }

    .markdown-body h4 {
      font-size: 1.1em;
    }

    .markdown-body p {
      margin-top: 0;
      margin-bottom: 1em;
    }

    .markdown-body a {
      color: var(--doc-accent-color);
      text-decoration: underline;
      text-underline-offset: 3px;
      font-weight: 500;
    }

    .markdown-body ul,
    .markdown-body ol {
      margin-top: 0;
      margin-bottom: 1em;
      padding-left: 1.75em;
    }

    .markdown-body li {
      margin-bottom: 0.35em;
    }

    .markdown-body blockquote {
      margin: 1.25em 0;
      padding: 0.75em 1.25em;
      color: var(--doc-text);
      border-left: 4px solid var(--doc-accent-color);
      background-color: var(--doc-quote-bg);
      border-radius: 0 6px 6px 0;
      font-style: italic;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .markdown-body hr {
      border: 0;
      height: 1px;
      background: var(--doc-border-color);
      margin: 1.8em 0;
    }

    /* --- Table Styles --- */
    .markdown-body .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 1.25em 0;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .markdown-body table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.95em;
    }

    .markdown-body th {
      background-color: var(--doc-table-header-bg);
      color: ${themeId === 'executive' ? '#ffffff' : 'var(--doc-heading-color)'};
      font-weight: 600;
      padding: 0.75em 1em;
      border-bottom: 2px solid var(--doc-border-color);
    }

    .markdown-body td {
      padding: 0.65em 1em;
      border-bottom: 1px solid var(--doc-border-color);
    }

    .markdown-body tr:nth-child(even) td {
      background-color: var(--doc-table-zebra-bg);
    }

    /* --- Code Blocks & Syntax Colors --- */
    .markdown-body code:not([class*="language-"]) {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 0.88em;
      background: #f1f5f9;
      color: #0f172a;
      padding: 0.2em 0.45em;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .markdown-body .code-block-wrapper {
      margin: 1.25em 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #334155;
      background: #1e293b;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .markdown-body .code-block-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.45em 0.85em;
      background: #0f172a;
      border-bottom: 1px solid #334155;
    }

    .markdown-body .window-dots {
      display: flex;
      gap: 5px;
    }

    .markdown-body .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }

    .markdown-body .dot-red { background-color: #ef4444; }
    .markdown-body .dot-yellow { background-color: #f59e0b; }
    .markdown-body .dot-green { background-color: #10b981; }

    .markdown-body .code-lang {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .markdown-body pre[class*="language-"] {
      margin: 0;
      padding: 1em 1.25em;
      background: #1e293b;
      color: #f8fafc;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 0.88em;
      line-height: 1.5;
      overflow-x: auto;
    }

    /* Prism.js Inline Syntax Highlighting Tokens */
    .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #64748b; font-style: italic; }
    .token.punctuation { color: #cbd5e1; }
    .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol { color: #f43f5e; }
    .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin { color: #34d399; }
    .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string { color: #38bdf8; }
    .token.atrule, .token.attr-value, .token.keyword { color: #a78bfa; font-weight: 600; }
    .token.function, .token.class-name { color: #fbbf24; }
    .token.regex, .token.important, .token.variable { color: #f97316; }

    /* --- Callouts & Admonitions --- */
    .callout-box {
      margin: 1.25em 0;
      padding: 1em 1.25em;
      border-radius: 8px;
      border-left: 5px solid;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .callout-title {
      display: flex;
      align-items: center;
      gap: 0.5em;
      font-weight: 700;
      font-size: 0.95em;
      margin-bottom: 0.35em;
    }

    .callout-content p:last-child {
      margin-bottom: 0;
    }

    .callout-note { background-color: #eff6ff; border-color: #3b82f6; color: #1e40af; }
    .callout-tip { background-color: #f0fdf4; border-color: #22c55e; color: #15803d; }
    .callout-important { background-color: #faf5ff; border-color: #a855f7; color: #6b21a8; }
    .callout-warning { background-color: #fffbeb; border-color: #f59e0b; color: #b45309; }
    .callout-caution { background-color: #fef2f2; border-color: #ef4444; color: #b91c1c; }

    /* --- Page Break Divider (Preview only) --- */
    .page-break-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2rem 0;
      position: relative;
    }

    .page-break-divider::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      height: 1px;
      border-top: 2px dashed #93c5fd;
    }

    .page-break-badge {
      position: relative;
      background: #ffffff;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #3b82f6;
      border: 1px solid #bfdbfe;
      border-radius: 9999px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    /* --- Robust Multi-Page Print Stylesheet (@media print) --- */
    @media print {
      @page {
        size: ${config.pageSize} ${config.orientation};
        margin: ${marginMm}mm;
      }

      *, *::before, *::after {
        transform: none !important;
        animation: none !important;
        transition: none !important;
      }

      html, body, #root, .app-container, .preview-wrapper {
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        overflow: visible !important;
        position: static !important;
        display: block !important;
        float: none !important;
        background: #ffffff !important;
        color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .no-print,
      nav,
      aside,
      header,
      .app-toolbar,
      .editor-pane,
      .resizer-divider,
      .settings-drawer,
      .page-break-divider,
      .modal-overlay {
        display: none !important;
      }

      #pdf-printable-area,
      .paper-sheet {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
        min-height: 0 !important;
        height: auto !important;
        overflow: visible !important;
        position: static !important;
        float: none !important;
      }

      .markdown-body {
        display: block !important;
        width: 100% !important;
      }

      .print-page-break,
      .html2pdf__page-break {
        display: block !important;
        clear: both !important;
        page-break-before: always !important;
        break-before: page !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
      }

      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      pre, blockquote, table, tr, img, figure, .callout-box, .code-block-wrapper, .table-container {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      a {
        text-decoration: underline !important;
        color: inherit !important;
      }
    }
  `;
}
