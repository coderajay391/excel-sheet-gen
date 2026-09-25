'use client';

import React, { useRef } from 'react';
import { Download, Upload, Monitor, ShieldCheck, FileSpreadsheet, Sparkles, BookOpen, Layers } from 'lucide-react';
import { ExcelProject } from '../types/excel';
import { exportToXLSX, parseImportedFile } from '../lib/excelExporter';

interface TopNavbarProps {
  project: ExcelProject;
  onProjectLoad: (p: ExcelProject) => void;
  onOpenPackaging: () => void;
  onOpenFormulaGuide: () => void;
  onOpenBlueprints: () => void;
}

export default function TopNavbar({
  project,
  onProjectLoad,
  onOpenPackaging,
  onOpenFormulaGuide,
  onOpenBlueprints,
}: TopNavbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await parseImportedFile(file);
      onProjectLoad(imported);
    } catch (err) {
      console.error('Import failed', err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleQuickExport = () => {
    exportToXLSX(project, false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark + subtle unboxed offline indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-2.5 text-slate-100 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:bg-emerald-500 transition-colors">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              Offline Excel Guider
            </span>
          </a>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            100% Offline
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#generator-section" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Generator
          </a>
          <a href="#studio-section" className="hover:text-white transition-colors flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            Studio Grid
          </a>
          <button
            onClick={onOpenBlueprints}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Blueprints
          </button>
          <button
            onClick={onOpenFormulaGuide}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            Formulas
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import existing .xlsx or .csv offline"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Import File
          </button>

          <button
            onClick={onOpenPackaging}
            title="Cross-platform desktop build (Win, Mac, Linux)"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5 text-blue-400" />
            Desktop Packaging
          </button>

          <button
            onClick={handleQuickExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-600/30 transition-all cursor-pointer whitespace-nowrap active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .XLSX</span>
          </button>
        </div>
      </div>
    </header>
  );
}
