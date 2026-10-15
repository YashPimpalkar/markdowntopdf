import { describe, it, expect } from 'vitest';
import { renderMarkdown, calculateDocumentMetrics } from '../markdownService';

describe('markdownService', () => {
  describe('renderMarkdown', () => {
    it('should return empty string for empty input', () => {
      expect(renderMarkdown('')).toBe('');
    });

    it('should render basic markdown elements', () => {
      const md = '# Document Title\n\nThis is **bold** and *italic* text.';
      const html = renderMarkdown(md);
      expect(html).toContain('<h1');
      expect(html).toContain('Document Title');
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<em>italic</em>');
    });

    it('should render GFM tables properly', () => {
      const md = `| Header 1 | Header 2 |\n| :--- | :--- |\n| Val 1 | Val 2 |`;
      const html = renderMarkdown(md);
      expect(html).toContain('table-container');
      expect(html).toContain('<table>');
      expect(html).toContain('Header 1');
      expect(html).toContain('Val 1');
    });

    it('should render KaTeX block and inline equations', () => {
      const md = 'The mass-energy equivalence is $E=mc^2$.\n\n$$\\int_0^\\infty e^{-x} dx = 1$$';
      const html = renderMarkdown(md);
      expect(html).toContain('katex');
      expect(html).not.toContain('%%%MATH_');
    });

    it('should render code blocks with syntax highlighting', () => {
      const md = '```typescript\nconst x: number = 42;\n```';
      const html = renderMarkdown(md);
      expect(html).toContain('code-block-wrapper');
      expect(html).toContain('window-dots');
      expect(html).toContain('language-typescript');
      expect(html).toContain('token');
    });

    it('should convert pagebreak markers into printable break elements', () => {
      const md = 'First page\n\n<!-- pagebreak -->\n\nSecond page';
      const html = renderMarkdown(md);
      expect(html).toContain('page-break-divider');
      expect(html).toContain('print-page-break');
    });

    it('should transform GitHub callout blocks into styled admonitions', () => {
      const md = '> [!NOTE]\n> Keep in mind that performance scales logarithmically.';
      const html = renderMarkdown(md);
      expect(html).toContain('callout-box');
      expect(html).toContain('callout-note');
      expect(html).toContain('Note');
    });

    it('should render fenced and unfenced Mermaid flowcharts into diagram wrappers', () => {
      const fenced = '```mermaid\nflowchart TD\n    A([Start]) --> B[Open Website]\n```';
      const htmlFenced = renderMarkdown(fenced);
      expect(htmlFenced).toContain('mermaid-wrapper');
      expect(htmlFenced).toContain('mermaid-diagram');
      expect(htmlFenced).toContain('flowchart TD');

      const unfenced = '# Process\n\nflowchart TD\n    A([Start]) --> B[Step 1]\n\n2. Next Section';
      const htmlUnfenced = renderMarkdown(unfenced);
      expect(htmlUnfenced).toContain('mermaid-wrapper');
      expect(htmlUnfenced).toContain('mermaid-diagram');
    });
  });

  describe('calculateDocumentMetrics', () => {
    it('should correctly count words, chars, and estimates for normal text', () => {
      const md = 'Hello world, this is a test document with several words.';
      const metrics = calculateDocumentMetrics(md);
      expect(metrics.words).toBe(10);
      expect(metrics.chars).toBe(md.length);
      expect(metrics.readingTimeMin).toBeGreaterThanOrEqual(1);
      expect(metrics.estimatedPages).toBe(1);
    });

    it('should handle empty input cleanly', () => {
      const metrics = calculateDocumentMetrics('');
      expect(metrics.words).toBe(0);
      expect(metrics.chars).toBe(0);
      expect(metrics.readingTimeMin).toBe(1);
      expect(metrics.estimatedPages).toBe(1);
    });
  });
});
