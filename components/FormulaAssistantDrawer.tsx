'use client';

import React, { useState } from 'react';
import { X, Search, BookOpen, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { FORMULA_CATALOG } from '../lib/formulaGuide';
import { FormulaReference } from '../types/excel';

interface FormulaAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertFormula?: (formula: string) => void;
}

const CATEGORIES = ['All', 'Lookup & Reference', 'Math & Trig', 'Logical', 'Financial', 'Text', 'Date & Time'];

export default function FormulaAssistantDrawer({ isOpen, onClose, onInsertFormula }: FormulaAssistantDrawerProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredFormulas = FORMULA_CATALOG.filter((f) => {
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase()) ||
      f.syntax.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (formulaSyntax: string) => {
    navigator.clipboard.writeText(formulaSyntax);
    setCopiedFormula(formulaSyntax);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Offline Formula Encyclopedia
              </h3>
              <p className="text-xs text-slate-400">
                Full syntax guidelines, edge cases, and high-performance Excel formulas.
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

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by formula name or function (e.g. XLOOKUP, PMT, SUMIFS)..."
              className="w-full h-10 pl-9 pr-4 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer font-medium ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Formula List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {filteredFormulas.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No formulas matching &quot;{search}&quot;.
            </div>
          ) : (
            filteredFormulas.map((formula) => (
              <div
                key={formula.name}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-purple-400">
                        {formula.name}
                      </span>
                      <span className="text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono">
                        {formula.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {formula.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(formula.syntax)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-700 rounded-md transition-colors cursor-pointer shrink-0"
                    title="Copy Syntax"
                  >
                    {copiedFormula === formula.syntax ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Syntax Code block */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                  {formula.syntax}
                </div>

                {/* Practical Example */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-850">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-0.5">Example</span>
                    <span className="font-mono text-slate-300">{formula.example}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-850">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-0.5">Result</span>
                    <span className="text-slate-300">{formula.outputExample}</span>
                  </div>
                </div>

                {/* Pro-Tip */}
                <div className="text-[11px] text-slate-400 bg-purple-950/20 border border-purple-900/30 p-2 rounded text-slate-300">
                  <span className="text-purple-400 font-semibold">Pro Tip: </span>
                  {formula.tip}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>{filteredFormulas.length} formulas available</span>
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
