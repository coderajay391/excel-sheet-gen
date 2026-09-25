'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Settings2, Sliders, Shield, Zap, Laptop, Terminal } from 'lucide-react';
import { GeneratorOptions } from '../types/excel';
import { CURRENCIES } from '../lib/excelGeneratorEngine';

interface GeneratorHeroProps {
  onGenerate: (options: GeneratorOptions) => void;
  isGenerating?: boolean;
  onOpenPackaging: () => void;
}

const SUGGESTED_IDEAS = [
  'Startup Financial Model & Runway',
  'Construction Budget & Draw Schedule',
  'E-Commerce Unit Economics & Margin',
  'Employee Shift Roster & Overtime',
  'Freelance Tax & Client Billing',
  'Real Estate Cap Rate & Cash Flow',
  'Agile Sprint Velocity & Burndown',
  'Restaurant Recipe Costing & Portion Scaler',
];

export default function GeneratorHero({ onGenerate, isGenerating = false, onOpenPackaging }: GeneratorHeroProps) {
  const [query, setQuery] = useState('');
  const [rowCount, setRowCount] = useState(10);
  const [currency, setCurrency] = useState('$');
  const [complexity, setComplexity] = useState<'essential' | 'standard' | 'advanced'>('standard');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onGenerate({
      projectName: query.trim(),
      rowCount,
      currency,
      complexity,
      includeKPIs: true,
    });
  };

  const handleSelectIdea = (idea: string) => {
    setQuery(idea);
    onGenerate({
      projectName: idea,
      rowCount,
      currency,
      complexity,
      includeKPIs: true,
    });
  };

  return (
    <section id="generator-section" className="w-full">
      {/* Bento Grid Top Layer: 8 Cols (Generator) + 4 Cols (Offline & Platform Terminal) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Bento Card 1: Intelligent Offline Generator (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Offline Spreadsheet Architect
              </span>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                {showAdvanced ? 'Hide Options' : 'Customize Generator'}
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 text-balance">
              Generate any production Excel sheet, completely offline.
            </h1>
            <p className="text-sm text-slate-400 mb-5 max-w-2xl">
              Type any project name, accounting model, schedule, or tracker. Our client-side heuristic engine synthesizes verified formulas, data validations, and analytical KPIs instantly.
            </p>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Solar Installation ROI, Gym Calorie Tracker, SaaS Churn Cohort..."
                    className="w-full h-12 pl-4 pr-10 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!query.trim() || isGenerating}
                  className="h-12 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-98"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Sheet</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Advanced Tuning Controls Drawer */}
            {showAdvanced && (
              <div className="mb-4 p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Initial Sample Rows</label>
                  <select
                    value={rowCount}
                    onChange={(e) => setRowCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 text-xs"
                  >
                    <option value={5}>5 Rows (Compact)</option>
                    <option value={10}>10 Rows (Standard)</option>
                    <option value={20}>20 Rows (Extended)</option>
                    <option value={35}>35 Rows (Heavy)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Primary Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 text-xs"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.symbol}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Formula Complexity</label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 text-xs"
                  >
                    <option value="essential">Essential (SUM, AVG, MIN, MAX)</option>
                    <option value="standard">Standard (IF, SUMIFS, Ratios)</option>
                    <option value="advanced">Advanced (Nested IFS, XLOOKUP, Multi-factor)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Curated Prompt Suggestions */}
            <div>
              <span className="text-xs text-slate-400 block mb-2 font-medium">
                Try a Blueprint or Custom Project:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_IDEAS.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => handleSelectIdea(idea)}
                    className="text-xs px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700/50 transition-colors text-left cursor-pointer"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bento Card 2: 100% Offline & Cross-Platform Packaging Hub (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5" />
                Cross-Platform Ready
              </span>
              <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
                Air-Gapped Local
              </span>
            </div>

            <h3 className="text-base font-semibold text-white mb-2">
              Runs on Windows, macOS & Linux
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Zero backend required. All calculations, formula evaluations, and XLSX binary compilation execute locally in memory.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 mb-4 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  Electron Packaging
                </span>
                <span className="text-[10px] text-slate-500">v1.0.0</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                $ npm run package:win <span className="text-slate-600">{"// .exe"}</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                $ npm run package:mac <span className="text-slate-600">{"// .dmg"}</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                $ npm run package:linux <span className="text-slate-600">{"// .AppImage"}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero data leaves your machine</span>
            </div>
            <button
              onClick={onOpenPackaging}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
            >
              Packaging Guide &rarr;
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
