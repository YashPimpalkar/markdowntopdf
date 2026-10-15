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

    it('should parse all 5 user test flowcharts correctly', () => {
      const userSample = `Flowchart Test
1. Basic Flowchart
flowchart TD
    A([Start]) --> B[Open Website]
    B --> C[Enter Markdown]
    C --> D[Click Convert to PDF]
    D --> E{Conversion Successful?}
    E -->|Yes| F[Download PDF]
    E -->|No| G[Display Error]
    F --> H([End])
    G --> C

2. User Login Flowchart
flowchart TD
    A([Start]) --> B[Enter Email and Password]
    B --> C{Credentials Valid?}
    C -->|Yes| D[Open Dashboard]
    C -->|No| E[Show Error Message]
    E --> F{Retry Login?}
    F -->|Yes| B
    F -->|No| G([Exit])
    D --> H[Choose Action]
    H --> I[Upload Markdown File]
    H --> J[Write Markdown]
    I --> K[Generate PDF]
    J --> K
    K --> L([Finish])

3. Horizontal Flowchart
flowchart LR
    A[Markdown Input] --> B[Parse Markdown]
    B --> C[Generate HTML]
    C --> D[Apply CSS]
    D --> E[Create PDF]
    E --> F[Download PDF]

4. Flowchart with Multiple Decisions
flowchart TD
    A([Start]) --> B{User Logged In?}
    B -->|No| C[Show Login Page]
    C --> D[Authenticate User]
    D --> B
    B -->|Yes| E{Input Type?}
    E -->|Text| F[Markdown Editor]
    E -->|File| G[Upload File]
    F --> H[Validate Markdown]
    G --> H
    H --> I{Valid Input?}
    I -->|No| J[Show Validation Error]
    J --> H
    I -->|Yes| K[Convert to PDF]
    K --> L[Preview PDF]
    L --> M([Complete])

5. Styled Flowchart
flowchart TD
    A([Start]) --> B[Write Markdown]
    B --> C[Preview Document]
    C --> D{Looks Correct?}
    D -->|Yes| E[Export PDF]
    D -->|No| B
    E --> F([Download])

    classDef  add makeing  makrdown flowchart to  proepr flowchart
`;
      const html = renderMarkdown(userSample);
      const matches = html.match(/class="mermaid-diagram/g);
      expect(matches?.length).toBe(5);
      const allCodes = [...html.matchAll(/data-code="([^"]+)"/g)].map(m => m[1]);
      expect(allCodes[4]).toContain('Download');
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
