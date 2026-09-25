import * as XLSX from 'xlsx';
import { ExcelProject, ExcelSheet, CellData, ColumnDefinition } from '../types/excel';

export function exportToXLSX(project: ExcelProject, activeSheetOnly: boolean = false): void {
  try {
    const wb = XLSX.utils.book_new();

    const sheetsToExport = activeSheetOnly 
      ? [project.sheets[project.activeSheetIndex] || project.sheets[0]]
      : project.sheets;

    for (const sheet of sheetsToExport) {
      // Build 2D array for SheetJS
      const headerRow = sheet.columns.map(col => col.name);
      const dataRows: any[][] = [headerRow];

      for (const row of sheet.rows) {
        const rowValues = sheet.columns.map((col, cIdx) => {
          const cell = row[cIdx];
          if (!cell) return '';
          return cell.raw ?? '';
        });
        dataRows.push(rowValues);
      }

      const ws = XLSX.utils.aoa_to_sheet(dataRows);

      // Add formulas where available
      sheet.rows.forEach((row, rIdx) => {
        sheet.columns.forEach((col, cIdx) => {
          const cell = row[cIdx];
          if (cell && cell.formula) {
            // SheetJS cell address: row is rIdx + 1 (header is row 0)
            const cellRef = XLSX.utils.encode_cell({ r: rIdx + 1, c: cIdx });
            if (ws[cellRef]) {
              const cleanFormula = cell.formula.startsWith('=') ? cell.formula.slice(1) : cell.formula;
              ws[cellRef].f = cleanFormula;
            }
          }
        });
      });

      // Set column widths
      ws['!cols'] = sheet.columns.map(col => ({ wch: Math.max(12, Math.floor((col.width || 120) / 8)) }));

      // Clean sheet name (Excel prohibits characters: \ / ? * [ ] : and max 31 chars)
      const cleanName = (sheet.name || 'Sheet')
        .replace(/[:\\/?*[\]]/g, '')
        .slice(0, 31);

      XLSX.utils.book_append_sheet(wb, ws, cleanName || 'Data');
    }

    const filename = `${project.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'excel_project'}.xlsx`;
    XLSX.writeFile(wb, filename);
  } catch (err) {
    console.error('Failed to export to XLSX', err);
    throw err;
  }
}

export function exportToCSV(sheet: ExcelSheet, filename: string): void {
  try {
    const headerRow = sheet.columns.map(c => `"${c.name.replace(/"/g, '""')}"`).join(',');
    const rowsText = sheet.rows.map(row => {
      return sheet.columns.map((_, cIdx) => {
        const cell = row[cIdx];
        const val = cell ? String(cell.raw ?? '') : '';
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\n');

    const csvContent = `${headerRow}\n${rowsText}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('CSV export failed', err);
    throw err;
  }
}

export function exportToJSON(project: ExcelProject): void {
  try {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${project.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('JSON export failed', err);
    throw err;
  }
}

export async function copyTableToClipboard(sheet: ExcelSheet): Promise<boolean> {
  try {
    const header = sheet.columns.map(c => c.name).join('\t');
    const rows = sheet.rows.map(row => {
      return sheet.columns.map((_, cIdx) => {
        const cell = row[cIdx];
        return cell ? String(cell.raw ?? '') : '';
      }).join('\t');
    }).join('\n');

    const tsv = `${header}\n${rows}`;
    await navigator.clipboard.writeText(tsv);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed', err);
    return false;
  }
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

export async function parseImportedFile(file: File): Promise<ExcelProject> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  const sheets: ExcelSheet[] = [];

  for (let s = 0; s < workbook.SheetNames.length; s++) {
    const sheetName = workbook.SheetNames[s];
    const ws = workbook.Sheets[sheetName];
    const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

    if (!rawData || rawData.length === 0) continue;

    const headers = rawData[0] || [];
    const columns: ColumnDefinition[] = headers.map((h: any, idx: number) => ({
      id: `col_${idx + 1}`,
      name: String(h || `Column ${idx + 1}`),
      letter: colLetter(idx),
      type: 'text',
      width: 140
    }));

    const rows: (CellData | null)[][] = [];
    for (let r = 1; r < rawData.length; r++) {
      const rowArr = rawData[r] || [];
      const rowCells: (CellData | null)[] = columns.map((col, cIdx) => {
        const cellVal = rowArr[cIdx];
        if (cellVal === undefined || cellVal === null || cellVal === '') {
          return null;
        }
        const isNum = typeof cellVal === 'number' || (!isNaN(Number(cellVal)) && cellVal !== '');
        return {
          raw: cellVal,
          formatted: String(cellVal),
          type: isNum ? 'number' : 'text',
          align: isNum ? 'right' : 'left'
        };
      });
      rows.push(rowCells);
    }

    sheets.push({
      id: `imported_sheet_${s}`,
      name: sheetName,
      columns,
      rows,
      kpis: [
        { title: 'Total Rows Imported', value: rows.length, trend: 'neutral' },
        { title: 'Columns Detected', value: columns.length, trend: 'neutral' },
        { title: 'Worksheet Index', value: `${s + 1} of ${workbook.SheetNames.length}`, trend: 'neutral' }
      ]
    });
  }

  const baseTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

  return {
    id: `imported_${Date.now()}`,
    title: baseTitle || 'Imported Workbook',
    category: 'Custom',
    description: `Locally parsed offline workbook from "${file.name}" with ${sheets.length} worksheet(s).`,
    tags: ['Imported File', `${sheets.length} Sheets`],
    recommendedFormulas: ['=SUM(A2:A10)', '=AVERAGE(B2:B10)', '=VLOOKUP(A2, Range, 2, FALSE)'],
    bestPractices: ['Review imported column data types', 'Format dates and currencies consistently'],
    createdAt: new Date().toISOString().split('T')[0],
    activeSheetIndex: 0,
    sheets: sheets.length > 0 ? sheets : [
      {
        id: 'empty_sheet',
        name: 'Sheet 1',
        columns: [{ id: 'col1', name: 'Column 1', letter: 'A', type: 'text', width: 140 }],
        rows: [],
        kpis: []
      }
    ]
  };
}
