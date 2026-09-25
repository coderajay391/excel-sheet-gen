'use client';

import React from 'react';
import { X, Layers, ArrowRight, CheckCircle2, Tag } from 'lucide-react';
import { CURATED_BLUEPRINTS } from '../lib/excelGeneratorEngine';
import { ExcelProject } from '../types/excel';

interface BlueprintsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlueprint: (bp: ExcelProject) => void;
}

export default function BlueprintsDrawer({ isOpen, onClose, onSelectBlueprint }: BlueprintsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Curated Project Blueprints
              </h3>
              <p className="text-xs text-slate-400">
                Pre-engineered, formula-verified Excel project models ready for immediate offline deployment.
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

        {/* Blueprint Cards Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {CURATED_BLUEPRINTS.map((bp) => (
            <div
              key={bp.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-amber-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                    {bp.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {bp.sheets[0].rows.length} Sample Rows
                  </span>
                </div>

                <h4 className="text-base font-semibold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                  {bp.title}
                </h4>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {bp.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {bp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-mono">
                  {bp.sheets[0].columns.length} Columns · Formulas Included
                </div>
                <button
                  onClick={() => {
                    onSelectBlueprint(JSON.parse(JSON.stringify(bp)));
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-lg transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  <span>Load Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>{CURATED_BLUEPRINTS.length} industry blueprints bundled offline</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md font-medium cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
