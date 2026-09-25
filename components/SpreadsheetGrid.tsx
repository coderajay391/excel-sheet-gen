'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  DollarSign, Percent, Hash, Copy, Check, Download, FileSpreadsheet,
  HelpCircle, Maximize2, Minimize2, Edit2
} from 'lucide-react';
import { ExcelProject, ExcelSheet, CellData, ColumnDefinition } from '../types/excel';
import { exportToXLSX, exportToCSV, exportToJSON, copyTableToClipboard } from '../lib/excelExporter';

interface SpreadsheetGridProps {
  project: ExcelProject;
  onUpdateProject: (updated: ExcelProject) => void;
  onOpenFormulaGuide: () => void;
}

function colLetter(index: number): string {
  let temp = index;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

export default function SpreadsheetGrid({
  project,
  onUpdateProject,
  onOpenFormulaGuide,
}: SpreadsheetGridProps) {
  const activeSheet = project.sheets[project.activeSheetIndex] || project.sheets[0];

  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [editingCell, setEditingCell] = useState<{ r: number; c: number } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [customFormulaInput, setCustomFormulaInput] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [renamingColumnIndex, setRenamingColumnIndex] = useState<number | null>(null);
  const [columnRenameValue, setColumnRenameValue] = useState('');
  const [renamingSheetIndex, setRenamingSheetIndex] = useState<number | null>(null);
  const [sheetRenameValue, setSheetRenameValue] = useState('');

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);

  const activeCellData: CellData | null =
    activeSheet?.rows?.[selectedCell.r]?.[selectedCell.c] ?? null;

  const activeCellDefaultText =
    activeCellData?.formula ||
    (activeCellData?.raw !== undefined && activeCellData?.raw !== null ? String(activeCellData.raw) : '');

  const formulaBarValue = customFormulaInput !== null ? customFormulaInput : activeCellDefaultText;

  // Focus input on edit start
  useEffect(() => {
    if (editingCell && inlineInputRef.current) {
      inlineInputRef.current.focus();
      inlineInputRef.current.select();
    }
  }, [editingCell]);

  const activeColLetter = colLetter(selectedCell.c);
  const activeCellCoord = `${activeColLetter}${selectedCell.r + 1}`;

  // Apply cell edit commit
  const commitCellEdit = (rowIdx: number, colIdx: number, value: string) => {
    const updatedSheets = [...project.sheets];
    const curSheet = { ...updatedSheets[project.activeSheetIndex] };
    const curRows = curSheet.rows.map((row) => [...row]);

    const isFormula = value.startsWith('=');
    let rawVal: any = value;
    let formattedVal = value;

    if (!isFormula) {
      const num = Number(value.replace(/[^0-9.-]/g, ''));
      if (!isNaN(num) && value.trim() !== '') {
        rawVal = num;
        const colType = curSheet.columns[colIdx]?.type;
        if (colType === 'currency') formattedVal = `$${num.toLocaleString()}`;
        else if (colType === 'percentage') formattedVal = `${(num * 100).toFixed(1)}%`;
        else formattedVal = num.toLocaleString();
      }
    }

    const existingCell = curRows[rowIdx]?.[colIdx] || { raw: '' };
    curRows[rowIdx][colIdx] = {
      ...existingCell,
      raw: rawVal,
      formula: isFormula ? value : undefined,
      formatted: isFormula ? value : formattedVal,
    };

    curSheet.rows = curRows;
    updatedSheets[project.activeSheetIndex] = curSheet;
    onUpdateProject({ ...project, sheets: updatedSheets });
    setEditingCell(null);
    setCustomFormulaInput(null);
  };

  const handleFormulaBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomFormulaInput(e.target.value);
  };

  const handleFormulaBarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitCellEdit(selectedCell.r, selectedCell.c, formulaBarValue);
    } else if (e.key === 'Escape') {
      setCustomFormulaInput(null);
    }
  };

  // Keyboard navigation on grid
  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    if (editingCell) return; // let inline input handle it

    const maxR = (activeSheet?.rows?.length || 1) - 1;
    const maxC = (activeSheet?.columns?.length || 1) - 1;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCell((prev) => ({ ...prev, r: Math.max(0, prev.r - 1) }));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCell((prev) => ({ ...prev, r: Math.min(maxR, prev.r + 1) }));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSelectedCell((prev) => ({ ...prev, c: Math.max(0, prev.c - 1) }));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSelectedCell((prev) => ({ ...prev, c: Math.min(maxC, prev.c + 1) }));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      startEditingCell(selectedCell.r, selectedCell.c);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (selectedCell.c < maxC) {
        setSelectedCell((prev) => ({ ...prev, c: prev.c + 1 }));
      } else if (selectedCell.r < maxR) {
        setSelectedCell((prev) => ({ r: prev.r + 1, c: 0 }));
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Start typing directly
      startEditingCell(selectedCell.r, selectedCell.c, e.key);
    }
  };

  const startEditingCell = (r: number, c: number, initialChar?: string) => {
    setSelectedCell({ r, c });
    setEditingCell({ r, c });
    const cell = activeSheet?.rows?.[r]?.[c];
    if (initialChar !== undefined) {
      setEditValue(initialChar);
    } else {
      setEditValue(cell?.formula || (cell?.raw !== undefined ? String(cell.raw) : ''));
    }
  };

  // Cell Formatting Actions
  const toggleCellFormat = (formatProp: 'bold' | 'italic', align?: 'left' | 'center' | 'right') => {
    const updatedSheets = [...project.sheets];
    const curSheet = { ...updatedSheets[project.activeSheetIndex] };
    const curRows = curSheet.rows.map((row) => [...row]);
    const cell = curRows[selectedCell.r]?.[selectedCell.c] || { raw: '' };

    if (align) {
      cell.align = align;
    } else if (formatProp === 'bold') {
      cell.bold = !cell.bold;
    } else if (formatProp === 'italic') {
      cell.italic = !cell.italic;
    }

    curRows[selectedCell.r][selectedCell.c] = cell;
    curSheet.rows = curRows;
    updatedSheets[project.activeSheetIndex] = curSheet;
    onUpdateProject({ ...project, sheets: updatedSheets });
  };

  const setCellNumberType = (type: 'currency' | 'percentage' | 'number') => {
    const updatedSheets = [...project.sheets];
    const curSheet = { ...updatedSheets[project.activeSheetIndex] };
    const curRows = curSheet.rows.map((row) => [...row]);
    const cell = curRows[selectedCell.r]?.[selectedCell.c] || { raw: 0 };

    const rawNum = typeof cell.raw === 'number' ? cell.raw : parseFloat(String(cell.raw).replace(/[^0-9.-]/g, '')) || 0;

    cell.raw = rawNum;
    cell.type = type;
    if (type === 'currency') cell.formatted = `$${rawNum.toLocaleString()}`;
    else if (type === 'percentage') cell.formatted = `${(rawNum * 100).toFixed(1)}%`;
    else cell.formatted = rawNum.toLocaleString();

    curRows[selectedCell.r][selectedCell.c] = cell;
    curSheet.rows = curRows;
    updatedSheets[project.activeSheetIndex] = curSheet;
    onUpdateProject({ ...project, sheets: updatedSheets });
  };

  // Row and Column Operations
  const handleAddRow = () => {
    const updatedSheets = [...project.sheets];
    const curSheet = { ...updatedSheets[project.activeSheetIndex] };
    const emptyRow: (CellData | null)[] = curSheet.columns.map((col) => ({
      raw: '',
      formatted: '',
      type: col.type,
    }));
    curSheet.rows = [...curSheet.rows, emptyRow];
    updatedSheets[project.activeSheetIndex] = curSheet;
    onUpdateProject({ ...project, sheets: updatedSheets });
    setSelectedCell({ r: curSheet.rows.length - 1, c: selectedCell.c });
  };

  const handleDeleteRow = () => {
    if (activeSheet.rows.length <= 1) return;
    const updatedSheets = [...project.sheets];
    const curSheet = { ...updatedSheets[project.activeSheetIndex] };
    curSheet.rows = curSheet.rows.filter((_, idx) => idx !== selectedCell.r);
    updatedSheets[project.activeSheetIndex] = curSheet;
    onUpdateProject({ ...project, sheets: updatedSheets });
    setSelectedCell((prev) => ({
      ...prev,
      r: Math.min(prev.r, curSheet.rows.length - 1),
    }));
  };

  const handleAddColumn = () => {
    const updatedSheets = [...project.sheets];
    const curSheet = { ...updatedSheets[project.activeSheetIndex] };
    const newIndex = curSheet.columns.length;
    const newCol: ColumnDefinition = {
      id: `col_${Date.now()}`,
      name: `Column ${colLetter(newIndex)}`,
      letter: colLetter(newIndex),
      type: 'text',
      width: 140,
    };
    curSheet.columns = [...curSheet.columns, newCol];
    curSheet.rows = curSheet.rows.map((row) => [...row, { raw: '', formatted: '', type: 'text' }]);
    updatedSheets[project.activeSheetIndex] = curSheet;
    onUpdateProject({ ...project, sheets: updatedSheets });
  };

  const handleDeleteColumn = () => {
    if (activeSheet.columns.length <= 1) return;
    const updatedSheets = [...project.sheets];
    const curSheet = { ...updatedSheets[project.activeSheetIndex] };
    const colIdx = selectedCell.c;
    curSheet.columns = curSheet.columns
      .filter((_, idx) => idx !== colIdx)
      .map((col, idx) => ({ ...col, letter: colLetter(idx) }));
    curSheet.rows = curSheet.rows.map((row) => row.filter((_, idx) => idx !== colIdx));
    updatedSheets[project.activeSheetIndex] = curSheet;
    onUpdateProject({ ...project, sheets: updatedSheets });
    setSelectedCell((prev) => ({
      ...prev,
      c: Math.min(prev.c, curSheet.columns.length - 1),
    }));
  };

  const handleCopyTSV = async () => {
    const ok = await copyTableToClipboard(activeSheet);
    if (ok) {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  const handleRenameColumnSubmit = (cIdx: number) => {
    if (!columnRenameValue.trim()) return;
    const updatedSheets = [...project.sheets];
    const curSheet = { ...updatedSheets[project.activeSheetIndex] };
    curSheet.columns[cIdx].name = columnRenameValue.trim();
    updatedSheets[project.activeSheetIndex] = curSheet;
    onUpdateProject({ ...project, sheets: updatedSheets });
    setRenamingColumnIndex(null);
  };

  // Sheet Tabs Management
  const handleAddSheet = () => {
    const updatedSheets = [...project.sheets];
    const newSheetIndex = updatedSheets.length + 1;
    const newSheet: ExcelSheet = {
      id: `sheet_${Date.now()}`,
      name: `Sheet ${newSheetIndex}`,
      columns: [
        { id: 'c1', name: 'Item Name', letter: 'A', type: 'text', width: 160 },
        { id: 'c2', name: 'Category', letter: 'B', type: 'text', width: 140 },
        { id: 'c3', name: 'Amount', letter: 'C', type: 'currency', width: 130 },
        { id: 'c4', name: 'Date', letter: 'D', type: 'date', width: 120 },
      ],
      rows: [
        [{ raw: 'Sample Entry 1' }, { raw: 'Operational' }, { raw: 1500, formatted: '$1,500' }, { raw: '2026-03-01' }],
        [{ raw: 'Sample Entry 2' }, { raw: 'Capital' }, { raw: 3200, formatted: '$3,200' }, { raw: '2026-03-10' }],
      ],
      kpis: [],
    };
    updatedSheets.push(newSheet);
    onUpdateProject({
      ...project,
      sheets: updatedSheets,
      activeSheetIndex: updatedSheets.length - 1,
    });
  };

  const handleRenameSheetSubmit = (sIdx: number) => {
    if (!sheetRenameValue.trim()) return;
    const updatedSheets = [...project.sheets];
    updatedSheets[sIdx].name = sheetRenameValue.trim();
    onUpdateProject({ ...project, sheets: updatedSheets });
    setRenamingSheetIndex(null);
  };

  return (
    <div
      id="studio-section"
      className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md flex flex-col ${
        isFullscreen ? 'fixed inset-2 z-50 bg-slate-900 border-slate-700' : 'w-full'
      }`}
    >
      {/* 1. Spreadsheet Header Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                {project.title}
              </h2>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                {project.category}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {activeSheet.rows.length} rows · {activeSheet.columns.length} columns · Active:{' '}
              <span className="font-mono text-emerald-400 font-semibold">{activeCellCoord}</span>
            </p>
          </div>
        </div>

        {/* Global Sheet Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyTSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-md border border-slate-700 transition-colors cursor-pointer"
            title="Copy as Tab-Separated Values for pasting into Excel or Google Sheets"
          >
            {copiedNotification ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied TSV!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy for Excel</span>
              </>
            )}
          </button>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-md p-0.5">
            <button
              onClick={() => exportToXLSX(project)}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:text-white hover:bg-emerald-600 rounded transition-colors cursor-pointer"
              title="Download real native .xlsx workbook"
            >
              .XLSX
            </button>
            <button
              onClick={() => exportToCSV(activeSheet, activeSheet.name)}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              title="Download .csv"
            >
              .CSV
            </button>
            <button
              onClick={() => exportToJSON(project)}
              className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              title="Export complete schema as JSON"
            >
              .JSON
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Spreadsheet Toolbar */}
      <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left Formatting Cluster */}
        <div className="flex items-center flex-wrap gap-1">
          {/* Add / Delete Rows */}
          <div className="flex items-center border-r border-slate-800 pr-2 mr-1 gap-1">
            <button
              onClick={handleAddRow}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white cursor-pointer"
              title="Insert Row Below"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Row</span>
            </button>
            <button
              onClick={handleDeleteRow}
              disabled={activeSheet.rows.length <= 1}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Delete Selected Row"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Row</span>
            </button>
          </div>

          {/* Add / Delete Columns */}
          <div className="flex items-center border-r border-slate-800 pr-2 mr-1 gap-1">
            <button
              onClick={handleAddColumn}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white cursor-pointer"
              title="Insert Column Right"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Col</span>
            </button>
            <button
              onClick={handleDeleteColumn}
              disabled={activeSheet.columns.length <= 1}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Delete Selected Column"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Col</span>
            </button>
          </div>

          {/* Text Style */}
          <div className="flex items-center border-r border-slate-800 pr-2 mr-1 gap-1">
            <button
              onClick={() => toggleCellFormat('bold')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                activeCellData?.bold ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => toggleCellFormat('italic')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                activeCellData?.italic ? 'bg-slate-700 text-white italic' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center border-r border-slate-800 pr-2 mr-1 gap-1">
            <button
              onClick={() => toggleCellFormat('bold', 'left')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                activeCellData?.align === 'left' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => toggleCellFormat('bold', 'center')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                activeCellData?.align === 'center' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => toggleCellFormat('bold', 'right')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                activeCellData?.align === 'right' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Number Formats */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCellNumberType('currency')}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Format as Currency ($)"
            >
              <DollarSign className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCellNumberType('percentage')}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Format as Percentage (%)"
            >
              <Percent className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCellNumberType('number')}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Format as Standard Number"
            >
              <Hash className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Help & Formula Guide Button */}
        <button
          onClick={onOpenFormulaGuide}
          className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 font-medium transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Formula Reference</span>
        </button>
      </div>

      {/* 3. Authentic Formula Bar */}
      <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800 flex items-center gap-2 text-xs">
        {/* Coordinate Name Box */}
        <div className="w-16 h-7 bg-slate-900 border border-slate-700 rounded flex items-center justify-center font-mono font-bold text-emerald-400 select-none">
          {activeCellCoord}
        </div>

        {/* fx Symbol */}
        <div className="text-slate-500 font-serif italic text-sm font-semibold select-none px-1">
          fx
        </div>

        {/* Formula Input Box */}
        <input
          type="text"
          value={formulaBarValue}
          onChange={handleFormulaBarChange}
          onKeyDown={handleFormulaBarKeyDown}
          placeholder="Enter a value or formula (e.g. =SUM(C2:C10) or =C2*D2)"
          className="flex-1 h-7 px-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:bg-slate-950 transition-colors"
        />

        {formulaBarValue !== (activeCellData?.formula || (activeCellData?.raw !== undefined ? String(activeCellData.raw) : '')) && (
          <button
            onClick={() => commitCellEdit(selectedCell.r, selectedCell.c, formulaBarValue)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded text-[11px] cursor-pointer"
          >
            Apply
          </button>
        )}
      </div>

      {/* 4. High-Density Spreadsheet Table Grid */}
      <div
        ref={gridContainerRef}
        tabIndex={0}
        onKeyDown={handleGridKeyDown}
        className="flex-1 overflow-auto max-h-[520px] focus:outline-none select-none bg-slate-950"
      >
        <table className="w-full border-collapse text-xs tabular-nums">
          {/* Table Header with Column Letters and Column Names */}
          <thead className="sticky top-0 z-20 bg-slate-900 shadow-sm border-b border-slate-800">
            <tr>
              {/* Top-left corner cell */}
              <th className="w-12 min-w-[48px] p-2 bg-slate-950 border-r border-b border-slate-800 text-center font-mono text-[11px] text-slate-500">
                #
              </th>

              {/* Column Headers */}
              {activeSheet.columns.map((col, cIdx) => (
                <th
                  key={col.id}
                  style={{ width: col.width || 130 }}
                  className="p-2 border-r border-b border-slate-800 text-left font-normal bg-slate-900 hover:bg-slate-850 group cursor-pointer"
                  onClick={() => setSelectedCell({ r: selectedCell.r, c: cIdx })}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-emerald-400 font-semibold text-[11px] shrink-0">
                        {col.letter}
                      </span>

                      {renamingColumnIndex === cIdx ? (
                        <input
                          type="text"
                          value={columnRenameValue}
                          onChange={(e) => setColumnRenameValue(e.target.value)}
                          onBlur={() => handleRenameColumnSubmit(cIdx)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameColumnSubmit(cIdx);
                            if (e.key === 'Escape') setRenamingColumnIndex(null);
                          }}
                          autoFocus
                          className="bg-slate-950 text-white font-semibold px-1 py-0.5 rounded border border-emerald-500 outline-none text-xs w-full"
                        />
                      ) : (
                        <span
                          onDoubleClick={() => {
                            setRenamingColumnIndex(cIdx);
                            setColumnRenameValue(col.name);
                          }}
                          className="font-medium text-slate-200 truncate group-hover:text-white"
                          title={`${col.name} (Double-click to rename)`}
                        >
                          {col.name}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 uppercase shrink-0 font-mono">
                      {col.type === 'currency' ? '$' : col.type === 'percentage' ? '%' : col.type === 'formula' ? 'fx' : ''}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/80">
            {activeSheet.rows.map((row, rIdx) => {
              const isRowSelected = selectedCell.r === rIdx;

              return (
                <tr
                  key={`row_${rIdx}`}
                  className={`hover:bg-slate-900/60 transition-colors ${
                    isRowSelected ? 'bg-slate-900/40' : ''
                  }`}
                >
                  {/* Row Index Column (1, 2, 3...) */}
                  <td
                    onClick={() => setSelectedCell({ r: rIdx, c: selectedCell.c })}
                    className={`w-12 min-w-[48px] p-2 border-r border-slate-800 font-mono text-[11px] text-center select-none cursor-pointer ${
                      isRowSelected ? 'bg-slate-800 text-emerald-400 font-bold' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    {rIdx + 1}
                  </td>

                  {/* Row Cells */}
                  {activeSheet.columns.map((col, cIdx) => {
                    const cell = row[cIdx];
                    const isSelected = selectedCell.r === rIdx && selectedCell.c === cIdx;
                    const isEditing = editingCell?.r === rIdx && editingCell?.c === cIdx;

                    const displayValue = cell
                      ? cell.formatted !== undefined
                        ? cell.formatted
                        : cell.raw !== undefined
                        ? String(cell.raw)
                        : ''
                      : '';

                    const alignmentClass =
                      cell?.align === 'center'
                        ? 'text-center'
                        : cell?.align === 'right'
                        ? 'text-right'
                        : col.type === 'number' || col.type === 'currency' || col.type === 'percentage'
                        ? 'text-right'
                        : col.type === 'status'
                        ? 'text-center'
                        : 'text-left';

                    return (
                      <td
                        key={`cell_${rIdx}_${cIdx}`}
                        onClick={() => setSelectedCell({ r: rIdx, c: cIdx })}
                        onDoubleClick={() => startEditingCell(rIdx, cIdx)}
                        className={`p-2 border-r border-slate-800/80 relative cursor-cell transition-all font-mono ${alignmentClass} ${
                          cell?.bold ? 'font-bold text-white' : 'text-slate-200'
                        } ${cell?.italic ? 'italic' : ''} ${
                          isSelected
                            ? 'ring-2 ring-emerald-500 bg-emerald-950/20 z-10'
                            : ''
                        }`}
                      >
                        {isEditing ? (
                          <input
                            ref={inlineInputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => commitCellEdit(rIdx, cIdx, editValue)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                commitCellEdit(rIdx, cIdx, editValue);
                                // move down
                                if (rIdx < activeSheet.rows.length - 1) {
                                  setSelectedCell({ r: rIdx + 1, c: cIdx });
                                }
                              } else if (e.key === 'Tab') {
                                e.preventDefault();
                                commitCellEdit(rIdx, cIdx, editValue);
                                // move right
                                if (cIdx < activeSheet.columns.length - 1) {
                                  setSelectedCell({ r: rIdx, c: cIdx + 1 });
                                }
                              } else if (e.key === 'Escape') {
                                setEditingCell(null);
                              }
                            }}
                            className="absolute inset-0 w-full h-full px-2 py-1 bg-slate-950 text-white font-mono border-2 border-emerald-500 outline-none z-20 text-xs"
                          />
                        ) : (
                          <div className="truncate w-full">
                            {cell?.bgHighlight ? (
                              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${cell.bgHighlight}`}>
                                {displayValue}
                              </span>
                            ) : (
                              <span>{displayValue}</span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 5. Sheet Tabs Bar at Bottom */}
      <div className="bg-slate-950 px-3 py-2 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {project.sheets.map((sheet, sIdx) => {
            const isActive = project.activeSheetIndex === sIdx;
            const isRenaming = renamingSheetIndex === sIdx;

            return (
              <div
                key={sheet.id}
                onClick={() => onUpdateProject({ ...project, activeSheetIndex: sIdx })}
                onDoubleClick={() => {
                  setRenamingSheetIndex(sIdx);
                  setSheetRenameValue(sheet.name);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors border ${
                  isActive
                    ? 'bg-slate-900 text-white border-emerald-500/50 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-transparent hover:bg-slate-900 hover:text-slate-300'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-600'}`}
                />

                {isRenaming ? (
                  <input
                    type="text"
                    value={sheetRenameValue}
                    onChange={(e) => setSheetRenameValue(e.target.value)}
                    onBlur={() => handleRenameSheetSubmit(sIdx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSheetSubmit(sIdx);
                      if (e.key === 'Escape') setRenamingSheetIndex(null);
                    }}
                    autoFocus
                    className="bg-slate-950 text-white px-1 py-0.5 rounded border border-emerald-500 outline-none text-xs w-24 font-mono"
                  />
                ) : (
                  <span>{sheet.name}</span>
                )}
              </div>
            );
          })}

          <button
            onClick={handleAddSheet}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded-md transition-colors border border-dashed border-slate-800 cursor-pointer"
            title="Add New Worksheet"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sheet</span>
          </button>
        </div>

        {/* Status Bar Indicators */}
        <div className="hidden sm:flex items-center gap-4 text-slate-500 font-mono text-[11px] shrink-0">
          <span>Formula Engine: OK</span>
          <span>·</span>
          <span>Encoding: UTF-8</span>
          <span>·</span>
          <span className="text-emerald-400">Ready</span>
        </div>
      </div>
    </div>
  );
}
