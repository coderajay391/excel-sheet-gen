import { FormulaReference } from '../types/excel';

export const FORMULA_CATALOG: FormulaReference[] = [
  {
    name: 'XLOOKUP',
    syntax: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])',
    category: 'Lookup & Reference',
    description: 'The modern replacement for VLOOKUP and HLOOKUP. Searches a range or array and returns the item corresponding to the first match it finds.',
    example: '=XLOOKUP(A2, Products!A:A, Products!D:D, "Not Found")',
    outputExample: 'Returns unit price for SKU in A2 with safe fallback',
    tip: 'Unlike VLOOKUP, XLOOKUP searches to the left or right, defaults to exact match, and does not break when columns are inserted.'
  },
  {
    name: 'INDEX / MATCH',
    syntax: '=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))',
    category: 'Lookup & Reference',
    description: 'The industry gold-standard two-way lookup pairing compatible with all legacy versions of Excel and LibreOffice.',
    example: '=INDEX(C2:C100, MATCH(E2, A2:A100, 0))',
    outputExample: 'Returns value in column C where column A matches E2',
    tip: 'More memory efficient than VLOOKUP on massive datasets because it only evaluates the specific columns required.'
  },
  {
    name: 'SUMIFS',
    syntax: '=SUMIFS(sum_range, criteria_range1, criterion1, [criteria_range2, criterion2], ...)',
    category: 'Math & Trig',
    description: 'Sums cells in a range that meet multiple criteria across distinct columns.',
    example: '=SUMIFS(D2:D100, B2:B100, "Engineering", C2:C100, "Q1")',
    outputExample: 'Sums spend in column D where Dept is Engineering and Period is Q1',
    tip: 'Remember that the sum_range comes FIRST in SUMIFS, whereas it comes last in single-condition SUMIF.'
  },
  {
    name: 'COUNTIFS',
    syntax: '=COUNTIFS(criteria_range1, criterion1, [criteria_range2, criterion2], ...)',
    category: 'Statistical',
    description: 'Counts the number of rows that satisfy multiple conditions simultaneously.',
    example: '=COUNTIFS(E2:E50, "Done", G2:G50, "Critical")',
    outputExample: 'Counts critical tasks that are completed',
    tip: 'Combine with date conditions like `>=` & DATE(2026,1,1) for rolling window velocity.'
  },
  {
    name: 'AVERAGEIFS',
    syntax: '=AVERAGEIFS(average_range, criteria_range1, criterion1, ...)',
    category: 'Statistical',
    description: 'Computes the arithmetic mean of all cells satisfying multiple conditions.',
    example: '=AVERAGEIFS(H2:H50, C2:C50, "Full-Time", D2:D50, ">50000")',
    outputExample: 'Calculates average compensation for eligible full-time staff',
    tip: 'Ignores empty cells and cells with text automatically in the average_range.'
  },
  {
    name: 'IF / IFS',
    syntax: '=IFS(logical_test1, value_if_true1, [logical_test2, value_if_true2], ...)',
    category: 'Logical',
    description: 'Checks whether one or more conditions are observed and returns a value corresponding to the first TRUE condition without nesting.',
    example: '=IFS(D2>=90, "Tier 1", D2>=75, "Tier 2", TRUE, "Standard")',
    outputExample: 'Categorizes score into performance tiers',
    tip: 'End IFS with TRUE as the final condition to act as an "ELSE" catch-all default.'
  },
  {
    name: 'IFERROR',
    syntax: '=IFERROR(value, value_if_error)',
    category: 'Logical',
    description: 'Traps and handles calculation errors like #N/A, #DIV/0!, or #VALUE! gracefully.',
    example: '=IFERROR(C2/B2, 0)',
    outputExample: 'Returns 0 instead of #DIV/0! if B2 is zero or empty',
    tip: 'Always wrap division and lookup formulas in IFERROR for client-facing financial models.'
  },
  {
    name: 'PMT',
    syntax: '=PMT(rate, nper, pv, [fv], [type])',
    category: 'Financial',
    description: 'Calculates the recurring payment for a loan based on constant payments and a fixed interest rate.',
    example: '=PMT(6.5%/12, 360, -450000)',
    outputExample: 'Monthly mortgage payment: $2,844.31',
    tip: 'Divide the annual interest rate by 12 and multiply mortgage years by 12 for monthly payments.'
  },
  {
    name: 'TEXTJOIN',
    syntax: '=TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)',
    category: 'Text',
    description: 'Concatenates a list or range of text strings using a specified delimiter between each item.',
    example: '=TEXTJOIN(", ", TRUE, A2:A10)',
    outputExample: 'Generates comma-separated list: "Alpha, Beta, Gamma"',
    tip: 'Set ignore_empty to TRUE to automatically eliminate unsightly consecutive commas.'
  },
  {
    name: 'DATEDIF',
    syntax: '=DATEDIF(start_date, end_date, unit)',
    category: 'Date & Time',
    description: 'Calculates the number of days, months, or years between two dates.',
    example: '=DATEDIF(B2, TODAY(), "Y") & " Years"',
    outputExample: 'Tenure duration from hire date: "4 Years"',
    tip: 'Valid unit arguments include "Y" (years), "M" (months), "D" (days), and "YM" (months remaining).'
  },
  {
    name: 'SUMPRODUCT',
    syntax: '=SUMPRODUCT(array1, [array2], ...)',
    category: 'Math & Trig',
    description: 'Multiplies corresponding components in given arrays and returns the sum of those products.',
    example: '=SUMPRODUCT(C2:C50, D2:D50)',
    outputExample: 'Calculates total valuation (Units * Price) without helper columns',
    tip: 'One of Excel’s most powerful calculation tools; handles conditional boolean masks like `-- (A2:A50="US")`.'
  },
  {
    name: 'LET',
    syntax: '=LET(name1, name_value1, calculation_or_name2, ...)',
    category: 'Lookup & Reference',
    description: 'Assigns names to calculation results, dramatically improving calculation performance and formula readability.',
    example: '=LET(gross, C2*D2, tax, gross*0.25, gross - tax)',
    outputExample: 'Eliminates repetitive recalculations and cleans formulas',
    tip: 'Speeds up complex multi-step workbooks up to 20x by storing intermediate results.'
  }
];
