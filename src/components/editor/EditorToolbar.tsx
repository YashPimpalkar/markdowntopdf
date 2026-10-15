import React from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  FileCode,
  Table,
  Sigma,
  AlertCircle,
  Scissors,
  Link,
  Image,
  Workflow,
} from 'lucide-react';

interface EditorToolbarProps {
  onInsertMarkdown: (prefix: string, suffix?: string, placeholder?: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ onInsertMarkdown }) => {
  return (
    <div className="no-print h-11 bg-slate-900 border-b border-slate-800 px-3 flex items-center gap-1 overflow-x-auto scrollbar-none select-none text-slate-300">
      {/* Inline Formatting */}
      <button
        type="button"
        onClick={() => onInsertMarkdown('**', '**', 'bold text')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('*', '*', 'italic text')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('~~', '~~', 'strikethrough')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-800 mx-1" />

      {/* Headings */}
      <button
        type="button"
        onClick={() => onInsertMarkdown('# ', '', 'Heading 1')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer font-bold text-xs"
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('## ', '', 'Heading 2')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer text-xs"
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('### ', '', 'Heading 3')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer text-xs"
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-800 mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => onInsertMarkdown('- ', '', 'List item')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Bulleted List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('1. ', '', 'Numbered item')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('- [ ] ', '', 'Task item')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Task Checklist"
      >
        <CheckSquare className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-800 mx-1" />

      {/* Quotes & Code */}
      <button
        type="button"
        onClick={() => onInsertMarkdown('> ', '', 'Quote text')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('`', '`', 'inlineCode')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Inline Code"
      >
        <Code className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('```typescript\n', '\n```', '// Code block\nconst greeting = "Hello World";')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Code Block"
      >
        <FileCode className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-800 mx-1" />

      {/* Advanced Tools */}
      <button
        type="button"
        onClick={() => onInsertMarkdown('\n| Column 1 | Column 2 | Column 3 |\n| :--- | :--- | :--- |\n| Row 1 A | Row 1 B | Row 1 C |\n| Row 2 A | Row 2 B | Row 2 C |\n\n')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Insert Markdown Table"
      >
        <Table className="w-4 h-4 text-emerald-400" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('$$\n', '\n$$', 'E = mc^2')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="LaTeX / KaTeX Math Equation"
      >
        <Sigma className="w-4 h-4 text-sky-400" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('\n```mermaid\nflowchart TD\n    A([Start]) --> B[Process]\n    B --> C{Decision?}\n    C -->|Yes| D[Success]\n    C -->|No| E[Retry]\n    D --> F([End])\n```\n\n')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Insert Mermaid Flowchart Diagram"
      >
        <Workflow className="w-4 h-4 text-violet-400" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('> [!NOTE]\n> ', '', 'Important notification or note here')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Callout Box (Admonition)"
      >
        <AlertCircle className="w-4 h-4 text-amber-400" />
      </button>

      {/* Page Break Inserter */}
      <button
        type="button"
        onClick={() => onInsertMarkdown('\n\n<!-- pagebreak -->\n\n')}
        className="flex items-center gap-1 px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-xs transition-colors cursor-pointer ml-auto"
        title="Insert Page Break"
      >
        <Scissors className="w-3.5 h-3.5 text-indigo-400" />
        <span className="font-medium text-[11px]">Page Break</span>
      </button>

      <div className="w-px h-5 bg-slate-800 mx-1" />

      <button
        type="button"
        onClick={() => onInsertMarkdown('[', '](https://example.com)', 'Link text')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Hyperlink"
      >
        <Link className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onInsertMarkdown('![', '](https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800)', 'Image caption')}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors cursor-pointer"
        title="Image"
      >
        <Image className="w-4 h-4" />
      </button>
    </div>
  );
};
