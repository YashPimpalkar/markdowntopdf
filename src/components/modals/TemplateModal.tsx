import React from 'react';
import { X, BookOpen, Cpu, Briefcase, GraduationCap, User, ArrowRight } from 'lucide-react';
import { DOCUMENT_TEMPLATES } from '../../services/templates';
import type { DocumentTemplate, ThemeId } from '../../types/document';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DocumentTemplate) => void;
}

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5 text-indigo-400" />,
  Briefcase: <Briefcase className="w-5 h-5 text-amber-400" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-sky-400" />,
  User: <User className="w-5 h-5 text-emerald-400" />,
};

const THEME_NAMES: Record<ThemeId, string> = {
  tech: 'Tech Theme',
  executive: 'Executive Theme',
  academic: 'Academic Theme',
  editorial: 'Editorial Theme',
  minimal: 'Minimal Theme',
};

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Starter Document Templates</h2>
              <p className="text-xs text-slate-400">
                Choose a pre-formatted template with math, code, tables, and curated styling.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-5 overflow-y-auto pr-1">
          {DOCUMENT_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => {
                onSelectTemplate(tmpl);
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    {TEMPLATE_ICONS[tmpl.icon] || <Cpu className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {THEME_NAMES[tmpl.defaultTheme]}
                  </span>
                </div>

                <h3 className="font-semibold text-sm text-white group-hover:text-indigo-400 transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
                <span>Load Template</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Note: Loading a template replaces current editor text.</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
