export type CellDataType = 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'status' | 'formula';

export interface CellData {
  raw: string | number;
  formatted?: string;
  formula?: string;
  isHeader?: boolean;
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  type?: CellDataType;
  bgHighlight?: string;
  textHighlight?: string;
}

export interface ColumnDefinition {
  id: string;
  name: string;
  letter: string; // 'A', 'B', 'C', etc.
  type: CellDataType;
  width?: number; // pixel width
  defaultFormula?: string;
  format?: string; // e.g., '$#,##0.00', '0.0%', 'YYYY-MM-DD'
  description?: string;
}

export interface KPICard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  formulaHint?: string;
  category?: string;
}

export interface ExcelSheet {
  id: string;
  name: string;
  columns: ColumnDefinition[];
  rows: (CellData | null)[][];
  kpis: KPICard[];
  summaryFormulas?: {
    label: string;
    targetColumn: string;
    formula: string;
    result: string | number;
  }[];
  chartRecommended?: 'bar' | 'line' | 'pie' | 'doughnut' | 'none';
}

export interface ExcelProject {
  id: string;
  title: string;
  category: 'Finance' | 'Project Management' | 'Operations' | 'Sales & CRM' | 'Human Resources' | 'Personal & Freelance' | 'Education & Science' | 'Custom';
  description: string;
  sheets: ExcelSheet[];
  activeSheetIndex: number;
  tags: string[];
  recommendedFormulas: string[];
  bestPractices: string[];
  createdAt: string;
}

export interface GeneratorOptions {
  projectName: string;
  rowCount: number;
  currency: string;
  complexity: 'essential' | 'standard' | 'advanced';
  includeKPIs: boolean;
  industryCategory?: string;
}

export interface FormulaReference {
  name: string;
  syntax: string;
  category: 'Lookup & Reference' | 'Math & Trig' | 'Logical' | 'Financial' | 'Text' | 'Date & Time' | 'Statistical';
  description: string;
  example: string;
  outputExample: string;
  tip: string;
}
