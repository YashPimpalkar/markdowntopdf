import { Marked } from 'marked';
import katex from 'katex';
import Prism from 'prismjs';

// Load commonly used Prism language grammars
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-yaml.js';
import 'prismjs/components/prism-markdown.js';

export interface ParseOptions {
  sanitize?: boolean;
}

/**
 * Escapes HTML characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Highlights a block of code using Prism.js
 */
function highlightCode(code: string, language?: string): string {
  const cleanLang = (language || '').trim().toLowerCase();
  const grammar = Prism.languages[cleanLang];

  if (grammar) {
    try {
      return Prism.highlight(code, grammar, cleanLang);
    } catch {
      return escapeHtml(code);
    }
  }
  return escapeHtml(code);
}

/**
 * Transforms Markdown into styled HTML with KaTeX math, Prism syntax highlighting,
 * callout admonitions, and page breaks.
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';

  const mathPlaceholders: { [key: string]: string } = {};
  let placeholderCount = 0;

  // 1. Extract Display Math ($$...$$)
  let processed = markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_, equation) => {
    const key = `%%%MATH_BLOCK_${placeholderCount++}%%%`;
    try {
      mathPlaceholders[key] = katex.renderToString(equation.trim(), {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      mathPlaceholders[key] = `<pre class="katex-error">${escapeHtml(equation)}</pre>`;
    }
    return key;
  });

  // 2. Extract Inline Math ($...$) - ensure no escaped or empty dollars
  processed = processed.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (_, prefix, equation) => {
    const key = `%%%MATH_INLINE_${placeholderCount++}%%%`;
    try {
      mathPlaceholders[key] = katex.renderToString(equation.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      mathPlaceholders[key] = `<code>${escapeHtml(equation)}</code>`;
    }
    return `${prefix}${key}`;
  });

  // 3. Process Page Breaks (<!-- pagebreak -->, \pagebreak, ===pagebreak===)
  processed = processed.replace(
    /(<!--\s*pagebreak\s*-->|\\pagebreak|===pagebreak===)/gi,
    '\n\n<div class="page-break-divider print:hidden"><span class="page-break-badge">Page Break</span></div><div class="html2pdf__page-break print-page-break"></div>\n\n'
  );

  // 4. Configure Marked instance with custom code renderer
  const marked = new Marked({
    gfm: true,
    breaks: false,
  });

  // Custom renderer for code blocks
  marked.use({
    renderer: {
      code({ text, lang }) {
        const language = (lang || '').split(/\s+/)[0] || 'text';
        const highlighted = highlightCode(text, language);
        return `<div class="code-block-wrapper">
          <div class="code-block-header">
            <div class="window-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="code-lang">${escapeHtml(language)}</span>
          </div>
          <pre class="language-${escapeHtml(language)}"><code class="language-${escapeHtml(language)}">${highlighted}</code></pre>
        </div>`;
      },
    },
  });

  let html = marked.parse(processed) as string;

  // Wrap tables with responsive container
  html = html.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table-container"><table>$1</table></div>');

  // 5. Restore Math formulas
  Object.entries(mathPlaceholders).forEach(([token, mathHtml]) => {
    html = html.split(token).join(mathHtml);
  });

  // 6. Transform Callouts / Admonitions:
  // Matches: <blockquote><p>[!NOTE] ... </p></blockquote>
  const calloutMap: { [key: string]: { label: string; class: string; icon: string } } = {
    NOTE: {
      label: 'Note',
      class: 'callout-note',
      icon: 'ℹ️',
    },
    TIP: {
      label: 'Tip',
      class: 'callout-tip',
      icon: '💡',
    },
    IMPORTANT: {
      label: 'Important',
      class: 'callout-important',
      icon: '📌',
    },
    WARNING: {
      label: 'Warning',
      class: 'callout-warning',
      icon: '⚠️',
    },
    CAUTION: {
      label: 'Caution',
      class: 'callout-caution',
      icon: '🛑',
    },
  };

  html = html.replace(
    /<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]([\s\S]*?)<\/blockquote>/gi,
    (_, type, content) => {
      const config = calloutMap[type.toUpperCase()] || calloutMap.NOTE;
      // Strip initial br or space if needed
      const cleanContent = content.replace(/^\s*(<br\s*\/?>|\n)/, '');
      return `<div class="callout-box ${config.class}">
        <div class="callout-title">
          <span class="callout-icon">${config.icon}</span>
          <span class="callout-heading">${config.label}</span>
        </div>
        <div class="callout-content"><p>${cleanContent}</div>
      </div>`;
    }
  );

  return html;
}

/**
 * Calculates metrics from markdown content
 */
export function calculateDocumentMetrics(markdown: string) {
  const words = markdown.trim() ? (markdown.match(/\b\S+\b/g) || []).length : 0;
  const chars = markdown.length;
  const readingTimeMin = Math.max(1, Math.ceil(words / 200));
  // Rough estimate of A4 pages based on ~450 words per full text page or 2500 chars
  const estimatedPages = Math.max(1, Math.ceil(words / 400));

  return {
    words,
    chars,
    readingTimeMin,
    estimatedPages,
  };
}
