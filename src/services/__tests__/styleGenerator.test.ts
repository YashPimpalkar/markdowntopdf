import { describe, it, expect } from 'vitest';
import { generateInlineStyles, getThemeTokens, PAGE_SIZES } from '../styleGenerator';
import type { PageLayoutConfig, ThemeId } from '../../types/document';

describe('styleGenerator', () => {
  const baseConfig: PageLayoutConfig = {
    pageSize: 'a4',
    orientation: 'portrait',
    margin: 'normal',
    showPageNumbers: true,
    showHeader: true,
    showFooter: true,
    headerText: 'Test Spec',
    footerText: 'Confidential',
    baseFontSize: 11,
    lineHeight: 1.6,
    fontFamily: 'sans',
  };

  it('should return theme tokens for all supported themes', () => {
    const themes: ThemeId[] = ['academic', 'executive', 'tech', 'editorial', 'minimal'];
    themes.forEach((theme) => {
      const tokens = getThemeTokens(theme);
      expect(tokens).toBeDefined();
      expect(tokens.fontFamily).toBeTypeOf('string');
      expect(tokens.accentColor).toBeTypeOf('string');
      expect(tokens.headingColor).toBeTypeOf('string');
    });
  });

  it('should produce inline CSS containing theme tokens and print rules', () => {
    const css = generateInlineStyles('tech', baseConfig);
    expect(css).toContain('--doc-font-size: 11pt');
    expect(css).toContain('--doc-line-height: 1.6');
    expect(css).toContain('@media print');
    expect(css).toContain('@page');
    expect(css).toContain('size: a4 portrait');
    expect(css).toContain('margin: 22mm');
    expect(css).toContain('.paper-sheet');
    expect(css).toContain('.markdown-body');
  });

  it('should adjust paper dimensions for landscape orientation', () => {
    const landscapeConfig = { ...baseConfig, orientation: 'landscape' as const };
    const css = generateInlineStyles('executive', landscapeConfig);
    expect(css).toContain('size: a4 landscape');
    // In landscape A4: width is 297mm, height is 210mm
    expect(css).toContain(`width: ${PAGE_SIZES.a4.heightMm}mm`);
  });

  it('should correctly apply custom margins', () => {
    const customConfig = { ...baseConfig, customMarginMm: 35 };
    const css = generateInlineStyles('minimal', customConfig);
    expect(css).toContain('margin: 35mm');
  });

  it('should include print styles for mermaid-wrapper and diagram svg', () => {
    const css = generateInlineStyles('tech', baseConfig);
    expect(css).toContain('.mermaid-wrapper');
    expect(css).toContain('.mermaid-diagram svg');
    expect(css).toContain('break-inside: auto !important');
  });
});
