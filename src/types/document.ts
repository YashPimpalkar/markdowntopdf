export type PageSize = 'a4' | 'letter' | 'legal' | 'a5';
export type Orientation = 'portrait' | 'landscape';
export type MarginOption = 'compact' | 'normal' | 'relaxed';
export type ThemeId = 'academic' | 'executive' | 'tech' | 'editorial' | 'minimal';
export type ViewMode = 'split' | 'editor' | 'preview';

export interface DocumentMetadata {
  title: string;
  author: string;
  date: string;
  subject?: string;
  keywords?: string[];
}

export interface PageLayoutConfig {
  pageSize: PageSize;
  orientation: Orientation;
  margin: MarginOption;
  customMarginMm?: number;
  showPageNumbers: boolean;
  showHeader: boolean;
  showFooter: boolean;
  headerText: string;
  footerText: string;
  baseFontSize: number; // in pt or px (e.g. 10.5pt, 12pt)
  lineHeight: number; // e.g. 1.6
  fontFamily: 'sans' | 'serif' | 'mono';
}

export interface DocumentTheme {
  id: ThemeId;
  name: string;
  description: string;
  fontFamily: string;
  headingFont: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  previewBg: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultTheme: ThemeId;
  content: string;
}
