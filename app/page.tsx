'use client';

import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import GeneratorHero from '../components/GeneratorHero';
import SpreadsheetGrid from '../components/SpreadsheetGrid';
import KPIWidget from '../components/KPIWidget';
import ColumnArchitect from '../components/ColumnArchitect';
import FormulaAssistantDrawer from '../components/FormulaAssistantDrawer';
import BlueprintsDrawer from '../components/BlueprintsDrawer';
import DesktopPackagingModal from '../components/DesktopPackagingModal';
import { ExcelProject, GeneratorOptions } from '../types/excel';
import { CURATED_BLUEPRINTS, generateProjectOffline } from '../lib/excelGeneratorEngine';
import { exportToXLSX } from '../lib/excelExporter';
import { Sparkles, Layers, BookOpen, Download, Laptop, FileSpreadsheet, ArrowRight } from 'lucide-react';

export default function Home() {
  const [project, setProject] = useState<ExcelProject>(CURATED_BLUEPRINTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPackagingModal, setShowPackagingModal] = useState(false);
  const [showFormulaGuide, setShowFormulaGuide] = useState(false);
  const [showBlueprints, setShowBlueprints] = useState(false);

  // Global Keyboard Shortcuts (Ctrl/Cmd+S to export, Ctrl/Cmd+N to focus generator)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        exportToXLSX(project);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        const inputElem = document.querySelector('input[type="text"]') as HTMLInputElement | null;
        inputElem?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project]);

  // Handle Offline Project Generation
  const handleGenerate = (options: GeneratorOptions) => {
    setIsGenerating(true);
    // Instant local heuristic synthesis with small smooth frame
    setTimeout(() => {
      const generated = generateProjectOffline(options);
      setProject(generated);
      setIsGenerating(false);

      // Smooth scroll to studio
      const studioElem = document.getElementById('studio-section');
      if (studioElem) {
        studioElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 280);
  };

  const activeSheet = project.sheets[project.activeSheetIndex] || project.sheets[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Header Navigation Bar */}
      <TopNavbar
        project={project}
        onProjectLoad={setProject}
        onOpenPackaging={() => setShowPackagingModal(true)}
        onOpenFormulaGuide={() => setShowFormulaGuide(true)}
        onOpenBlueprints={() => setShowBlueprints(true)}
      />

      {/* 2. Main Bento Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Bento Row 1: Intelligent Generator Hero + Desktop Packaging Card */}
        <GeneratorHero
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          onOpenPackaging={() => setShowPackagingModal(true)}
        />

        {/* Bento Row 2: Interactive Excel Studio (Primary Grid) */}
        <SpreadsheetGrid
          project={project}
          onUpdateProject={setProject}
          onOpenFormulaGuide={() => setShowFormulaGuide(true)}
        />

        {/* Bento Row 3: Automated KPI Indicators & Column Architect */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <KPIWidget
              kpis={activeSheet?.kpis || []}
              projectTitle={project.title}
            />
          </div>
          <div className="lg:col-span-5">
            <ColumnArchitect
              project={project}
              activeSheet={activeSheet}
            />
          </div>
        </div>

        {/* Bento Row 4: Offline Blueprint Hub Banner */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Explore 24+ Pre-Configured Industry Blueprints
              </h3>
              <p className="text-xs text-slate-400">
                P&L models, agile velocity burndowns, SKU unit economics, real estate cash flow, and more.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setShowBlueprints(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Browse All Blueprints</span>
            </button>
            <button
              onClick={() => setShowFormulaGuide(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Formula Guide</span>
            </button>
          </div>
        </div>

      </main>

      {/* 3. Quiet Editorial Footer */}
      <footer className="border-t border-slate-850 bg-slate-950 py-6 px-4 sm:px-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Offline Excel Guider</span>
            <span>·</span>
            <span>Cross-Platform Client Engine</span>
            <span>·</span>
            <span>Windows, macOS, Linux Compatible</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>No internet required</span>
            <span>·</span>
            <span>Air-gapped safety</span>
            <span>·</span>
            <button
              onClick={() => setShowPackagingModal(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Desktop Package Scripts
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Modals and Drawers */}
      <FormulaAssistantDrawer
        isOpen={showFormulaGuide}
        onClose={() => setShowFormulaGuide(false)}
      />

      <BlueprintsDrawer
        isOpen={showBlueprints}
        onClose={() => setShowBlueprints(false)}
        onSelectBlueprint={(bp) => setProject(bp)}
      />

      <DesktopPackagingModal
        isOpen={showPackagingModal}
        onClose={() => setShowPackagingModal(false)}
      />
    </div>
  );
}
