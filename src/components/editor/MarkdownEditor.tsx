import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

export interface MarkdownEditorHandle {
  insertText: (prefix: string, suffix?: string, placeholder?: string) => void;
}

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
}

export const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
  ({ value, onChange, onScroll }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Provide imperative methods to the parent / toolbar
    useImperativeHandle(ref, () => ({
      insertText(prefix: string, suffix = '', placeholder = '') {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.substring(start, end);
        const textToInsert = selected || placeholder;
        const replacement = `${prefix}${textToInsert}${suffix}`;

        const newValue = value.substring(0, start) + replacement + value.substring(end);
        onChange(newValue);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + prefix.length,
            start + prefix.length + textToInsert.length
          );
        }, 10);
      },
    }));

    // Handle Tab key indentation and markdown hotkeys
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.substring(start, end) || 'bold text';
        const replacement = `**${selected}**`;
        onChange(value.substring(0, start) + replacement + value.substring(end));
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.substring(start, end) || 'italic text';
        const replacement = `*${selected}*`;
        onChange(value.substring(0, start) + replacement + value.substring(end));
      }
    };

    // File Drag & Drop support
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt') || file.type.includes('text'))) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            onChange(content);
          }
        };
        reader.readAsText(file);
      }
    };

    const lineCount = value.split('\n').length;
    const lineNumbers = Array.from({ length: Math.max(lineCount, 30) }, (_, i) => i + 1);

    return (
      <div
        className="relative flex-1 h-full flex bg-slate-950 text-slate-100 font-mono text-sm overflow-hidden"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Line Numbers Sidebar */}
        <div className="w-12 py-4 select-none text-right pr-3 text-slate-600 bg-slate-950 border-r border-slate-900 overflow-hidden shrink-0 text-xs leading-[1.6]">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Textarea Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={onScroll}
          spellCheck={false}
          placeholder="Type or paste your Markdown here... You can also drag & drop .md files."
          className="flex-1 h-full py-4 px-4 bg-transparent resize-none focus:outline-none text-slate-200 placeholder:text-slate-600 font-mono text-sm leading-[1.6] overflow-y-auto"
        />

        {/* Drag & Drop Visual Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm border-2 border-dashed border-indigo-400 flex flex-col items-center justify-center gap-3 z-20 pointer-events-none text-indigo-200">
            <UploadCloud className="w-12 h-12 animate-bounce text-indigo-300" />
            <p className="text-base font-semibold">Drop Markdown file to import</p>
          </div>
        )}
      </div>
    );
  }
);

MarkdownEditor.displayName = 'MarkdownEditor';
