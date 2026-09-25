'use client';

import React, { useState } from 'react';
import { Columns, Code2, CheckCircle2, Lightbulb, Copy, Check } from 'lucide-react';
import { ExcelProject, ExcelSheet } from '../types/excel';

interface ColumnArchitectProps {
  project: ExcelProject;
  activeSheet: ExcelSheet;
  onInsertFormula?: (formula: string) => void;
}

export default function ColumnArchitect({ project, activeSheet, onInsertFormula }: ColumnArchitectProps) {
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const handleCopy = (formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormula(formula);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Columns className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Schema & Recommended Formulas
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {activeSheet.columns.length} Fields Defined
          </span>
        </div>

        {/* Recommended Formulas */}
        <div className="mb-4">
          <span className="text-xs font-medium text-slate-400 block mb-2">
            Formulas Tailored for this Sheet:
          </span>
          <div className="space-y-1.5">
            {project.recommendedFormulas.slice(0, 4).map((f, idx) => (
              <div
                key={`rec_f_${idx}`}
                className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/90 text-xs font-mono group"
              >
                <span className="text-emerald-400 truncate mr-2">{f}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(f)}
                  className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Copy formula"
                >
                  {copiedFormula === f ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices Section */}
        <div>
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Architectural Best Practices:
          </span>
          <ul className="space-y-2 text-xs text-slate-300">
            {project.bestPractices.map((bp, idx) => (
              <li key={`bp_${idx}`} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{bp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span>Created: {project.createdAt}</span>
        <span className="font-mono text-[11px] text-slate-400">SheetJS · Offline Engine</span>
      </div>
    </div>
  );
}
