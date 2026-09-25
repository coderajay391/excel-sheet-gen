import { ExcelProject, ExcelSheet, ColumnDefinition, CellData, KPICard, GeneratorOptions } from '../types/excel';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (C$)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc (CHF)' },
];

function colLetter(index: number): string {
  let temp = index;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

// Built-in Curated Blueprints
export const CURATED_BLUEPRINTS: ExcelProject[] = [
  {
    id: 'startup-financial-model',
    title: 'Startup Financial Model & Runway',
    category: 'Finance',
    description: '12-Month revenue forecasting, COGS, payroll, burn rate, and runway calculation with dynamic EBITDA.',
    tags: ['Startup', 'Runway', 'Burn Rate', 'EBITDA', 'Forecasting'],
    recommendedFormulas: [
      '=SUM(C4:N4)',
      '=(C4-C5)/C4',
      '=C12/C15',
      '=IF(C18<6,"CRITICAL","HEALTHY")'
    ],
    bestPractices: [
      'Keep assumptions separated from actuals in distinct input cells.',
      'Use SUMIFS for department-level headcount burn aggregation.',
      'Color-code formula cells differently from hardcoded assumptions.'
    ],
    createdAt: '2026-01-15',
    activeSheetIndex: 0,
    sheets: [
      {
        id: 'pnl-sheet',
        name: 'P&L Monthly Forecast',
        columns: [
          { id: 'c1', name: 'Month / Period', letter: 'A', type: 'text', width: 140 },
          { id: 'c2', name: 'Active Customers', letter: 'B', type: 'number', width: 130 },
          { id: 'c3', name: 'Gross Revenue', letter: 'C', type: 'currency', width: 130 },
          { id: 'c4', name: 'Cost of Goods (COGS)', letter: 'D', type: 'currency', width: 150 },
          { id: 'c5', name: 'Gross Profit', letter: 'E', type: 'formula', width: 130, defaultFormula: '=C{row}-D{row}' },
          { id: 'c6', name: 'Operating Expenses', letter: 'F', type: 'currency', width: 150 },
          { id: 'c7', name: 'Net Burn / Profit', letter: 'G', type: 'formula', width: 140, defaultFormula: '=E{row}-F{row}' },
          { id: 'c8', name: 'Gross Margin %', letter: 'H', type: 'percentage', width: 130, defaultFormula: '=(E{row}/C{row})' },
          { id: 'c9', name: 'Cash Balance', letter: 'I', type: 'currency', width: 140 },
          { id: 'c10', name: 'Runway (Months)', letter: 'J', type: 'formula', width: 130, defaultFormula: '=IF(G{row}<0,ROUND(I{row}/ABS(G{row}),1),"Profitable")' },
        ],
        rows: [
          [
            { raw: 'Jan 2026' }, { raw: 140 }, { raw: 28000, formatted: '$28,000' }, { raw: 5600, formatted: '$5,600' },
            { raw: 22400, formula: '=C2-D2', formatted: '$22,400' }, { raw: 45000, formatted: '$45,000' },
            { raw: -22600, formula: '=E2-F2', formatted: '-$22,600' }, { raw: 0.8, formula: '=E2/C2', formatted: '80.0%' },
            { raw: 480000, formatted: '$480,000' }, { raw: 21.2, formula: '=IF(G2<0,ROUND(I2/ABS(G2),1),"Profitable")', formatted: '21.2 mo' }
          ],
          [
            { raw: 'Feb 2026' }, { raw: 165 }, { raw: 33000, formatted: '$33,000' }, { raw: 6200, formatted: '$6,200' },
            { raw: 26800, formula: '=C3-D3', formatted: '$26,800' }, { raw: 46000, formatted: '$46,000' },
            { raw: -19200, formula: '=E3-F3', formatted: '-$19,200' }, { raw: 0.812, formula: '=E3/C3', formatted: '81.2%' },
            { raw: 457400, formatted: '$457,400' }, { raw: 23.8, formula: '=IF(G3<0,ROUND(I3/ABS(G3),1),"Profitable")', formatted: '23.8 mo' }
          ],
          [
            { raw: 'Mar 2026' }, { raw: 195 }, { raw: 39000, formatted: '$39,000' }, { raw: 7100, formatted: '$7,100' },
            { raw: 31900, formula: '=C4-D4', formatted: '$31,900' }, { raw: 47500, formatted: '$47,500' },
            { raw: -15600, formula: '=E4-F4', formatted: '-$15,600' }, { raw: 0.818, formula: '=E4/C4', formatted: '81.8%' },
            { raw: 438200, formatted: '$438,200' }, { raw: 28.1, formula: '=IF(G4<0,ROUND(I4/ABS(G4),1),"Profitable")', formatted: '28.1 mo' }
          ],
          [
            { raw: 'Apr 2026' }, { raw: 230 }, { raw: 46000, formatted: '$46,000' }, { raw: 8200, formatted: '$8,200' },
            { raw: 37800, formula: '=C5-D5', formatted: '$37,800' }, { raw: 48000, formatted: '$48,000' },
            { raw: -10200, formula: '=E5-F5', formatted: '-$10,200' }, { raw: 0.822, formula: '=E5/C5', formatted: '82.2%' },
            { raw: 422600, formatted: '$422,600' }, { raw: 41.4, formula: '=IF(G5<0,ROUND(I5/ABS(G5),1),"Profitable")', formatted: '41.4 mo' }
          ],
          [
            { raw: 'May 2026' }, { raw: 280 }, { raw: 56000, formatted: '$56,000' }, { raw: 9800, formatted: '$9,800' },
            { raw: 46200, formula: '=C6-D6', formatted: '$46,200' }, { raw: 50500, formatted: '$50,500' },
            { raw: -4300, formula: '=E6-F6', formatted: '-$4,300' }, { raw: 0.825, formula: '=E6/C6', formatted: '82.5%' },
            { raw: 412400, formatted: '$412,400' }, { raw: 95.9, formula: '=IF(G6<0,ROUND(I6/ABS(G6),1),"Profitable")', formatted: '95.9 mo' }
          ],
          [
            { raw: 'Jun 2026' }, { raw: 335 }, { raw: 67000, formatted: '$67,000' }, { raw: 11400, formatted: '$11,400' },
            { raw: 55600, formula: '=C7-D7', formatted: '$55,600' }, { raw: 52000, formatted: '$52,000' },
            { raw: 3600, formula: '=E7-F7', formatted: '$3,600' }, { raw: 0.83, formula: '=E7/C7', formatted: '83.0%' },
            { raw: 408100, formatted: '$408,100' }, { raw: 'Profitable', formula: '=IF(G7<0,ROUND(I7/ABS(G7),1),"Profitable")', formatted: 'Profitable' }
          ],
        ],
        kpis: [
          { title: 'Gross Annual ARR Run Rate', value: '$804,000', change: '+139%', trend: 'up', formulaHint: '=C7*12' },
          { title: 'Average Gross Margin', value: '81.8%', change: '+3.0%', trend: 'up', formulaHint: '=AVERAGE(H2:H7)' },
          { title: 'Current Net Runway', value: '28+ Months', change: 'Inflecting', trend: 'up', formulaHint: '=I7/ABS(MIN(G2:G7))' },
          { title: 'Projected Cash Breakeven', value: 'Month 6 (Jun)', change: 'On Track', trend: 'neutral', formulaHint: '=XLOOKUP(TRUE,G2:G7>0,A2:A7)' },
        ],
        chartRecommended: 'line',
      },
    ],
  },
  {
    id: 'agile-sprint-tracker',
    title: 'Agile Sprint Backlog & Velocity Burndown',
    category: 'Project Management',
    description: 'User story points, sprint capacity, task owners, status progress, and automated velocity calculation.',
    tags: ['Scrum', 'Sprint', 'Story Points', 'Velocity', 'Burndown'],
    recommendedFormulas: [
      '=SUMIFS(D2:D15,E2:E15,"Done")',
      '=COUNTIF(E2:E15,"In Progress")',
      '=D2*F2',
      '=AVERAGE(D2:D15)'
    ],
    bestPractices: [
      'Maintain standard Fibonacci story point values (1, 2, 3, 5, 8, 13).',
      'Use data validation dropdowns for Status (Backlog, In Progress, In Review, Done).',
      'Track velocity across 3-sprint rolling averages.'
    ],
    createdAt: '2026-02-10',
    activeSheetIndex: 0,
    sheets: [
      {
        id: 'sprint-board',
        name: 'Sprint 24 Backlog',
        columns: [
          { id: 'col1', name: 'Issue Key', letter: 'A', type: 'text', width: 110 },
          { id: 'col2', name: 'User Story Summary', letter: 'B', type: 'text', width: 260 },
          { id: 'col3', name: 'Component', letter: 'C', type: 'text', width: 140 },
          { id: 'col4', name: 'Story Points', letter: 'D', type: 'number', width: 110 },
          { id: 'col5', name: 'Status', letter: 'E', type: 'status', width: 130 },
          { id: 'col6', name: 'Assignee', letter: 'F', type: 'text', width: 140 },
          { id: 'col7', name: 'Priority', letter: 'G', type: 'status', width: 110 },
          { id: 'col8', name: 'Est. Hours', letter: 'H', type: 'number', width: 110 },
          { id: 'col9', name: 'Logged Hours', letter: 'I', type: 'number', width: 110 },
          { id: 'col10', name: 'Variance', letter: 'J', type: 'formula', width: 110, defaultFormula: '=H{row}-I{row}' },
        ],
        rows: [
          [
            { raw: 'ENG-401' }, { raw: 'Client-side AES encryption for offline storage' }, { raw: 'Security' },
            { raw: 8 }, { raw: 'Done', bgHighlight: 'bg-emerald-50 text-emerald-800' }, { raw: 'Elena Rostova' },
            { raw: 'High' }, { raw: 16 }, { raw: 14 }, { raw: 2, formula: '=H2-I2', formatted: '+2 hrs' }
          ],
          [
            { raw: 'ENG-402' }, { raw: 'Dynamic formula parser and dependency resolver' }, { raw: 'Core Engine' },
            { raw: 13 }, { raw: 'In Progress', bgHighlight: 'bg-blue-50 text-blue-800' }, { raw: 'Marcus Chen' },
            { raw: 'Critical' }, { raw: 28 }, { raw: 20 }, { raw: 8, formula: '=H3-I3', formatted: '+8 hrs' }
          ],
          [
            { raw: 'ENG-403' }, { raw: 'Virtual scrolling renderer for 50k spreadsheet rows' }, { raw: 'UI Grid' },
            { raw: 5 }, { raw: 'Done', bgHighlight: 'bg-emerald-50 text-emerald-800' }, { raw: 'Sarah Jenkins' },
            { raw: 'High' }, { raw: 12 }, { raw: 12 }, { raw: 0, formula: '=H4-I4', formatted: '0 hrs' }
          ],
          [
            { raw: 'ENG-404' }, { raw: 'Electron cross-platform native bridge setup' }, { raw: 'Desktop Package' },
            { raw: 5 }, { raw: 'In Review', bgHighlight: 'bg-purple-50 text-purple-800' }, { raw: 'Liam O’Connor' },
            { raw: 'Medium' }, { raw: 10 }, { raw: 9 }, { raw: 1, formula: '=H5-I5', formatted: '+1 hr' }
          ],
          [
            { raw: 'ENG-405' }, { raw: 'XLSX SheetJS binary exporter and formula preserver' }, { raw: 'IO Engine' },
            { raw: 8 }, { raw: 'Done', bgHighlight: 'bg-emerald-50 text-emerald-800' }, { raw: 'Marcus Chen' },
            { raw: 'High' }, { raw: 18 }, { raw: 16 }, { raw: 2, formula: '=H6-I6', formatted: '+2 hrs' }
          ],
          [
            { raw: 'ENG-406' }, { raw: 'Customizable Bento Grid view theme presets' }, { raw: 'UI Layout' },
            { raw: 3 }, { raw: 'In Progress', bgHighlight: 'bg-blue-50 text-blue-800' }, { raw: 'Sarah Jenkins' },
            { raw: 'Low' }, { raw: 6 }, { raw: 4 }, { raw: 2, formula: '=H7-I7', formatted: '+2 hrs' }
          ],
          [
            { raw: 'ENG-407' }, { raw: 'Keyboard shortcuts manager (Ctrl+S, Ctrl+Z, arrow nav)' }, { raw: 'UX Controls' },
            { raw: 5 }, { raw: 'Backlog', bgHighlight: 'bg-neutral-100 text-neutral-700' }, { raw: 'Elena Rostova' },
            { raw: 'Medium' }, { raw: 10 }, { raw: 0 }, { raw: 10, formula: '=H8-I8', formatted: '+10 hrs' }
          ],
        ],
        kpis: [
          { title: 'Total Committed Points', value: '47 pts', change: 'Capacity: 50', trend: 'neutral', formulaHint: '=SUM(D2:D8)' },
          { title: 'Completed Story Points', value: '21 pts', change: '44.7% Burndown', trend: 'up', formulaHint: '=SUMIF(E2:E8,"Done",D2:D8)' },
          { title: 'In-Flight Velocity', value: '21 pts / sprint', change: '+3 pts vs S23', trend: 'up', formulaHint: '=AVERAGE(PreviousSprints)' },
          { title: 'Remaining Effort Hours', value: '25 hrs', change: '4 days left', trend: 'neutral', formulaHint: '=SUM(J2:J8)' },
        ],
        chartRecommended: 'bar',
      }
    ]
  },
  {
    id: 'ecommerce-inventory-profitability',
    title: 'E-Commerce Product Profitability & Stock Reorder',
    category: 'Sales & CRM',
    description: 'SKU tracking, COGS, shipping, marketing acquisition cost, gross margin per unit, and reorder alerts.',
    tags: ['E-Commerce', 'Inventory', 'SKU', 'Reorder Point', 'Unit Economics'],
    recommendedFormulas: [
      '=E2-(C2+D2+F2)',
      '=G2/E2',
      '=IF(I2<=J2,"REORDER REQUIRED","OK")',
      '=SUMPRODUCT(G2:G10,H2:H10)'
    ],
    bestPractices: [
      'Factor payment processing fees (typically 2.9% + $0.30) into per-unit expenses.',
      'Set Safety Stock = (Max Daily Sales * Max Lead Time) - (Avg Daily Sales * Avg Lead Time).',
      'Review low-margin SKUs (below 35% net) quarterly.'
    ],
    createdAt: '2026-02-18',
    activeSheetIndex: 0,
    sheets: [
      {
        id: 'sku-profitability',
        name: 'Unit Economics & Stock',
        columns: [
          { id: 'c1', name: 'SKU Code', letter: 'A', type: 'text', width: 110 },
          { id: 'c2', name: 'Product Name', letter: 'B', type: 'text', width: 220 },
          { id: 'c3', name: 'Unit COGS', letter: 'C', type: 'currency', width: 110 },
          { id: 'c4', name: 'Packaging & Ship', letter: 'D', type: 'currency', width: 130 },
          { id: 'c5', name: 'Retail Price', letter: 'E', type: 'currency', width: 110 },
          { id: 'c6', name: 'Blended Ad CPA', letter: 'F', type: 'currency', width: 130 },
          { id: 'c7', name: 'Net Unit Profit', letter: 'G', type: 'formula', width: 130, defaultFormula: '=E{row}-(C{row}+D{row}+F{row})' },
          { id: 'c8', name: 'Net Margin %', letter: 'H', type: 'percentage', width: 120, defaultFormula: '=G{row}/E{row}' },
          { id: 'c9', name: 'Current Stock', letter: 'I', type: 'number', width: 120 },
          { id: 'c10', name: 'Reorder Point', letter: 'J', type: 'number', width: 120 },
          { id: 'c11', name: 'Restock Action', letter: 'K', type: 'formula', width: 140, defaultFormula: '=IF(I{row}<=J{row},"REORDER","HEALTHY")' },
        ],
        rows: [
          [
            { raw: 'SKU-101' }, { raw: 'Wireless Mechanical Keyboard (Nordic)' }, { raw: 24.50, formatted: '$24.50' },
            { raw: 6.80, formatted: '$6.80' }, { raw: 89.00, formatted: '$89.00' }, { raw: 18.20, formatted: '$18.20' },
            { raw: 39.50, formula: '=E2-(C2+D2+F2)', formatted: '$39.50' }, { raw: 0.444, formula: '=G2/E2', formatted: '44.4%' },
            { raw: 42 }, { raw: 50 }, { raw: 'REORDER', formula: '=IF(I2<=J2,"REORDER","HEALTHY")', bgHighlight: 'bg-amber-50 text-amber-900' }
          ],
          [
            { raw: 'SKU-102' }, { raw: 'Ergonomic Vertical Mouse (Graphite)' }, { raw: 12.20, formatted: '$12.20' },
            { raw: 4.50, formatted: '$4.50' }, { raw: 49.00, formatted: '$49.00' }, { raw: 11.50, formatted: '$11.50' },
            { raw: 20.80, formula: '=E3-(C3+D3+F3)', formatted: '$20.80' }, { raw: 0.424, formula: '=G3/E3', formatted: '42.4%' },
            { raw: 120 }, { raw: 60 }, { raw: 'HEALTHY', formula: '=IF(I3<=J3,"REORDER","HEALTHY")', bgHighlight: 'bg-emerald-50 text-emerald-900' }
          ],
          [
            { raw: 'SKU-103' }, { raw: 'USB-C GaN 100W Fast Charger' }, { raw: 8.90, formatted: '$8.90' },
            { raw: 3.20, formatted: '$3.20' }, { raw: 39.99, formatted: '$39.99' }, { raw: 9.40, formatted: '$9.40' },
            { raw: 18.49, formula: '=E4-(C4+D4+F4)', formatted: '$18.49' }, { raw: 0.462, formula: '=G4/E4', formatted: '46.2%' },
            { raw: 210 }, { raw: 75 }, { raw: 'HEALTHY', formula: '=IF(I4<=J4,"REORDER","HEALTHY")', bgHighlight: 'bg-emerald-50 text-emerald-900' }
          ],
          [
            { raw: 'SKU-104' }, { raw: 'Desk Felt Mat (900x400mm Charcoal)' }, { raw: 4.10, formatted: '$4.10' },
            { raw: 4.20, formatted: '$4.20' }, { raw: 24.50, formatted: '$24.50' }, { raw: 6.80, formatted: '$6.80' },
            { raw: 9.40, formula: '=E5-(C5+D5+F5)', formatted: '$9.40' }, { raw: 0.384, formula: '=G5/E5', formatted: '38.4%' },
            { raw: 15 }, { raw: 40 }, { raw: 'REORDER', formula: '=IF(I5<=J5,"REORDER","HEALTHY")', bgHighlight: 'bg-amber-50 text-amber-900' }
          ],
          [
            { raw: 'SKU-105' }, { raw: 'Monitor Light Bar with Ambient Sensor' }, { raw: 18.60, formatted: '$18.60' },
            { raw: 5.50, formatted: '$5.50' }, { raw: 64.00, formatted: '$64.00' }, { raw: 14.10, formatted: '$14.10' },
            { raw: 25.80, formula: '=E6-(C6+D6+F6)', formatted: '$25.80' }, { raw: 0.403, formula: '=G6/E6', formatted: '40.3%' },
            { raw: 88 }, { raw: 45 }, { raw: 'HEALTHY', formula: '=IF(I6<=J6,"REORDER","HEALTHY")', bgHighlight: 'bg-emerald-50 text-emerald-900' }
          ],
        ],
        kpis: [
          { title: 'Catalog Average Net Margin', value: '42.3%', change: '+1.8% vs Q3', trend: 'up', formulaHint: '=AVERAGE(H2:H6)' },
          { title: 'Total Inventory Valuation', value: '$24,780', change: '475 Units Total', trend: 'neutral', formulaHint: '=SUMPRODUCT(C2:C6,I2:I6)' },
          { title: 'Items Requiring Restock', value: '2 SKUs', change: 'Immediate PO', trend: 'down', formulaHint: '=COUNTIF(K2:K6,"REORDER")' },
          { title: 'Projected Net Profit in Stock', value: '$10,214', change: 'On Full Liquidation', trend: 'up', formulaHint: '=SUMPRODUCT(G2:G6,I2:I6)' },
        ],
        chartRecommended: 'bar',
      }
    ]
  },
  {
    id: 'freelance-invoice-taxes',
    title: 'Freelance Client Billing & Tax Estimator',
    category: 'Personal & Freelance',
    description: 'Hourly rate ledger, client billings, quarterly self-employment taxes, deductible expenses, and net take-home.',
    tags: ['Freelance', 'Taxes', 'Invoice', 'Hourly', 'Expenses'],
    recommendedFormulas: [
      '=C2*D2',
      '=E2*0.25',
      '=E2-F2-G2',
      '=SUM(E2:E10)'
    ],
    bestPractices: [
      'Reserve 25-30% of gross invoice receipts into a dedicated tax savings account.',
      'Log invoice payment status (Paid, Pending, Overdue) with date receipts.',
      'Keep mileage and business equipment receipts logged against line items.'
    ],
    createdAt: '2026-02-25',
    activeSheetIndex: 0,
    sheets: [
      {
        id: 'freelance-ledger',
        name: 'Client Project Billing',
        columns: [
          { id: 'c1', name: 'Invoice #', letter: 'A', type: 'text', width: 110 },
          { id: 'c2', name: 'Client Name', letter: 'B', type: 'text', width: 180 },
          { id: 'c3', name: 'Billable Hours', letter: 'C', type: 'number', width: 120 },
          { id: 'c4', name: 'Hourly Rate', letter: 'D', type: 'currency', width: 120 },
          { id: 'c5', name: 'Gross Billed', letter: 'E', type: 'formula', width: 130, defaultFormula: '=C{row}*D{row}' },
          { id: 'c6', name: 'Est. Tax (28%)', letter: 'F', type: 'formula', width: 130, defaultFormula: '=E{row}*0.28' },
          { id: 'c7', name: 'Deductible Exp.', letter: 'G', type: 'currency', width: 130 },
          { id: 'c8', name: 'Net Take-Home', letter: 'H', type: 'formula', width: 130, defaultFormula: '=E{row}-F{row}-G{row}' },
          { id: 'c9', name: 'Payment Status', letter: 'I', type: 'status', width: 130 },
          { id: 'c10', name: 'Due Date', letter: 'J', type: 'date', width: 120 },
        ],
        rows: [
          [
            { raw: 'INV-2026-01' }, { raw: 'Starlight Media Corp' }, { raw: 42 }, { raw: 125, formatted: '$125' },
            { raw: 5250, formula: '=C2*D2', formatted: '$5,250' }, { raw: 1470, formula: '=E2*0.28', formatted: '$1,470' },
            { raw: 320, formatted: '$320' }, { raw: 3460, formula: '=E2-F2-G2', formatted: '$3,460' },
            { raw: 'Paid', bgHighlight: 'bg-emerald-50 text-emerald-800' }, { raw: '2026-03-01' }
          ],
          [
            { raw: 'INV-2026-02' }, { raw: 'Acme SaaS Solutions' }, { raw: 60 }, { raw: 135, formatted: '$135' },
            { raw: 8100, formula: '=C3*D3', formatted: '$8,100' }, { raw: 2268, formula: '=E3*0.28', formatted: '$2,268' },
            { raw: 450, formatted: '$450' }, { raw: 5382, formula: '=E3-F3-G3', formatted: '$5,382' },
            { raw: 'Paid', bgHighlight: 'bg-emerald-50 text-emerald-800' }, { raw: '2026-03-15' }
          ],
          [
            { raw: 'INV-2026-03' }, { raw: 'Hyperion Bio Labs' }, { raw: 35 }, { raw: 140, formatted: '$140' },
            { raw: 4900, formula: '=C4*D4', formatted: '$4,900' }, { raw: 1372, formula: '=E4*0.28', formatted: '$1,372' },
            { raw: 180, formatted: '$180' }, { raw: 3348, formula: '=E4-F4-G4', formatted: '$3,348' },
            { raw: 'Pending', bgHighlight: 'bg-amber-50 text-amber-800' }, { raw: '2026-04-01' }
          ],
          [
            { raw: 'INV-2026-04' }, { raw: 'Vortex Mobility App' }, { raw: 50 }, { raw: 130, formatted: '$130' },
            { raw: 6500, formula: '=C5*D5', formatted: '$6,500' }, { raw: 1820, formula: '=E5*0.28', formatted: '$1,820' },
            { raw: 290, formatted: '$290' }, { raw: 4390, formula: '=E5-F5-G5', formatted: '$4,390' },
            { raw: 'Pending', bgHighlight: 'bg-amber-50 text-amber-800' }, { raw: '2026-04-15' }
          ],
        ],
        kpis: [
          { title: 'Gross Quarterly Invoiced', value: '$24,750', change: '187 Billable Hrs', trend: 'up', formulaHint: '=SUM(E2:E5)' },
          { title: 'Tax Reserve Set-Aside', value: '$6,930', change: '28% Federal & State', trend: 'neutral', formulaHint: '=SUM(F2:F5)' },
          { title: 'Net Personal Retained', value: '$16,580', change: 'After Tax & Expenses', trend: 'up', formulaHint: '=SUM(H2:H5)' },
          { title: 'Effective Blended Rate', value: '$132.35 / hr', change: 'Target: $125', trend: 'up', formulaHint: '=SUM(E2:E5)/SUM(C2:C5)' },
        ],
        chartRecommended: 'bar',
      }
    ]
  },
  {
    id: 'real-estate-mortgage-rental',
    title: 'Real Estate Rental Yield & Cash Flow Analyzer',
    category: 'Finance',
    description: 'Property acquisition cost, mortgage PMT, rental income, vacancy allowance, cap rate, and cash-on-cash return.',
    tags: ['Real Estate', 'Rental', 'Cap Rate', 'Mortgage', 'PMT', 'Cash Flow'],
    recommendedFormulas: [
      '=PMT(Rate/12, 360, -LoanAmount)',
      '=(AnnualRentalIncome - OperatingExpenses)/PurchasePrice',
      '=NetOperatingIncome - AnnualDebtService',
      '=AnnualCashFlow / TotalCashInvested'
    ],
    bestPractices: [
      'Always reserve 5-8% for vacancy allowance and 1% of property value annually for capital maintenance.',
      'Calculate Cap Rate on unleveraged net operating income.',
      'Compare Cash-on-Cash return against Treasury yields.'
    ],
    createdAt: '2026-03-01',
    activeSheetIndex: 0,
    sheets: [
      {
        id: 'property-roi',
        name: 'Property Portfolio Yield',
        columns: [
          { id: 'c1', name: 'Property Name', letter: 'A', type: 'text', width: 180 },
          { id: 'c2', name: 'Purchase Price', letter: 'B', type: 'currency', width: 140 },
          { id: 'c3', name: 'Down Payment (20%)', letter: 'C', type: 'formula', width: 140, defaultFormula: '=B{row}*0.2' },
          { id: 'c4', name: 'Monthly Rent', letter: 'D', type: 'currency', width: 130 },
          { id: 'c5', name: 'Monthly Mortgage', letter: 'E', type: 'currency', width: 140 },
          { id: 'c6', name: 'HOA & Tax / Mo', letter: 'F', type: 'currency', width: 130 },
          { id: 'c7', name: 'Net Monthly Cashflow', letter: 'G', type: 'formula', width: 160, defaultFormula: '=D{row}-E{row}-F{row}' },
          { id: 'c8', name: 'Annual Cashflow', letter: 'H', type: 'formula', width: 140, defaultFormula: '=G{row}*12' },
          { id: 'c9', name: 'Cap Rate %', letter: 'I', type: 'percentage', width: 120, defaultFormula: '=(D{row}*12-F{row}*12)/B{row}' },
          { id: 'c10', name: 'Cash on Cash %', letter: 'J', type: 'percentage', width: 130, defaultFormula: '=H{row}/C{row}' },
        ],
        rows: [
          [
            { raw: 'Oakwood Duplex Unit A/B' }, { raw: 420000, formatted: '$420,000' },
            { raw: 84000, formula: '=B2*0.2', formatted: '$84,000' }, { raw: 3600, formatted: '$3,600' },
            { raw: 2150, formatted: '$2,150' }, { raw: 480, formatted: '$480' },
            { raw: 970, formula: '=D2-E2-F2', formatted: '$970' }, { raw: 11640, formula: '=G2*12', formatted: '$11,640' },
            { raw: 0.089, formula: '=(D2*12-F2*12)/B2', formatted: '8.9%' }, { raw: 0.138, formula: '=H2/C2', formatted: '13.8%' }
          ],
          [
            { raw: 'Harborview Condo #4B' }, { raw: 310000, formatted: '$310,000' },
            { raw: 62000, formula: '=B3*0.2', formatted: '$62,000' }, { raw: 2450, formatted: '$2,450' },
            { raw: 1580, formatted: '$1,580' }, { raw: 390, formatted: '$390' },
            { raw: 480, formula: '=D3-E3-F3', formatted: '$480' }, { raw: 5760, formula: '=G3*12', formatted: '$5,760' },
            { raw: 0.079, formula: '=(D3*12-F3*12)/B3', formatted: '7.9%' }, { raw: 0.093, formula: '=H3/C3', formatted: '9.3%' }
          ],
          [
            { raw: 'Maplewood Single Family' }, { raw: 540000, formatted: '$540,000' },
            { raw: 108000, formula: '=B4*0.2', formatted: '$108,000' }, { raw: 4100, formatted: '$4,100' },
            { raw: 2750, formatted: '$2,750' }, { raw: 520, formatted: '$520' },
            { raw: 830, formula: '=D4-E4-F4', formatted: '$830' }, { raw: 9960, formula: '=G4*12', formatted: '$9,960' },
            { raw: 0.079, formula: '=(D4*12-F4*12)/B4', formatted: '7.9%' }, { raw: 0.092, formula: '=H4/C4', formatted: '9.2%' }
          ],
        ],
        kpis: [
          { title: 'Portfolio Total Asset Value', value: '$1,270,000', change: '3 Assets', trend: 'neutral', formulaHint: '=SUM(B2:B4)' },
          { title: 'Total Annual Net Cashflow', value: '$27,360', change: '$2,280 / month', trend: 'up', formulaHint: '=SUM(H2:H4)' },
          { title: 'Blended Portfolio Cap Rate', value: '8.2%', change: '+1.4% vs benchmark', trend: 'up', formulaHint: '=AVERAGE(I2:I4)' },
          { title: 'Average Cash-on-Cash Return', value: '10.8%', change: 'Double Digit Yield', trend: 'up', formulaHint: '=SUM(H2:H4)/SUM(C2:C4)' },
        ],
        chartRecommended: 'bar',
      }
    ]
  }
];

// Offline Semantic Domain Generator
interface DomainTemplateRule {
  domain: string;
  keywords: string[];
  columns: { name: string; type: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'status' | 'formula'; width: number; defaultFormula?: string; sampleGenerator: (row: number, curr: string) => { raw: any; formatted?: string; formula?: string; bgHighlight?: string } }[];
  kpis: (curr: string, rowCount: number) => KPICard[];
  recommendedFormulas: string[];
  bestPractices: string[];
  category: ExcelProject['category'];
}

const DOMAIN_RULES: DomainTemplateRule[] = [
  {
    domain: 'finance',
    keywords: ['finance', 'budget', 'revenue', 'cost', 'cogs', 'expense', 'p&l', 'profit', 'cash', 'money', 'investment', 'forecast', 'ebitda', 'margin', 'accounting', 'ledger'],
    category: 'Finance',
    columns: [
      { name: 'Item / Account', type: 'text', width: 170, sampleGenerator: (r) => ({ raw: ['Subscription Sales', 'Professional Consulting', 'Licensing Rights', 'Cloud Infrastructure', 'Office Facilities', 'Marketing & Ads', 'Software Tooling', 'Legal & Audit'][r % 8] }) },
      { name: 'Period / Quarter', type: 'text', width: 130, sampleGenerator: (r) => ({ raw: `Q${(r % 4) + 1} 2026` }) },
      { name: 'Projected Budget', type: 'currency', width: 140, sampleGenerator: (r, c) => { const v = (r + 1) * 12500; return { raw: v, formatted: `${c}${v.toLocaleString()}` }; } },
      { name: 'Actual Incurred', type: 'currency', width: 140, sampleGenerator: (r, c) => { const v = Math.round((r + 1) * 11800 * (1 + (r % 3) * 0.05)); return { raw: v, formatted: `${c}${v.toLocaleString()}` }; } },
      { name: 'Variance ($)', type: 'formula', width: 130, defaultFormula: '=C{row}-D{row}', sampleGenerator: (r, c) => { const v = (r + 1) * 12500 - Math.round((r + 1) * 11800 * (1 + (r % 3) * 0.05)); return { raw: v, formula: `=C${r+2}-D${r+2}`, formatted: `${c}${v.toLocaleString()}` }; } },
      { name: 'Variance %', type: 'formula', width: 120, defaultFormula: '=E{row}/C{row}', sampleGenerator: (r) => { const pct = 0.06 - (r % 3) * 0.04; return { raw: pct, formula: `=E${r+2}/C${r+2}`, formatted: `${(pct * 100).toFixed(1)}%` }; } },
      { name: 'Health Status', type: 'status', width: 130, sampleGenerator: (r) => { const s = (r % 3 === 0) ? 'Favorable' : (r % 3 === 1 ? 'On Target' : 'Review'); const bg = s === 'Favorable' ? 'bg-emerald-50 text-emerald-800' : (s === 'On Target' ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'); return { raw: s, bgHighlight: bg }; } },
    ],
    kpis: (c, count) => [
      { title: 'Total Budgeted Allocation', value: `${c}${(count * 12500).toLocaleString()}`, change: 'Approved Plan', trend: 'neutral', formulaHint: `=SUM(C2:C${count+1})` },
      { title: 'Actual Realized Spend', value: `${c}${Math.round(count * 12100).toLocaleString()}`, change: '-3.2% vs Plan', trend: 'up', formulaHint: `=SUM(D2:D${count+1})` },
      { title: 'Net Favorable Variance', value: `${c}${Math.round(count * 400).toLocaleString()}`, change: 'Surplus', trend: 'up', formulaHint: `=SUM(E2:E${count+1})` },
      { title: 'Average Line Item Deviation', value: '4.2%', change: 'Within ±5% Tolerance', trend: 'neutral', formulaHint: `=AVERAGE(ABS(F2:F${count+1}))` },
    ],
    recommendedFormulas: [
      '=SUM(C2:C{end})',
      '=AVERAGE(F2:F{end})',
      '=IF(E2>=0,"Favorable","Unfavorable")',
      '=XLOOKUP(MAX(D2:D{end}),D2:D{end},A2:A{end})'
    ],
    bestPractices: [
      'Lock down baseline budgets and log changes with an explicit audit trail.',
      'Use conditional formatting to highlight variances exceeding ±10%.',
      'Aggregate department totals using dynamic SUMIFS or pivot tables.'
    ]
  },
  {
    domain: 'project',
    keywords: ['project', 'task', 'sprint', 'roadmap', 'schedule', 'gantt', 'milestone', 'timeline', 'assignee', 'status', 'deadline', 'priority', 'tracker', 'kanban', 'scrum', 'todo'],
    category: 'Project Management',
    columns: [
      { name: 'Task / Deliverable', type: 'text', width: 220, sampleGenerator: (r) => ({ raw: ['Architect API Specifications', 'Database Schema Migration', 'Core UI Component Library', 'Cross-Platform Packaging', 'Automated Unit Tests', 'Security Compliance Audit', 'Production Load Testing', 'User Documentation & Guides'][r % 8] }) },
      { name: 'Phase / Stream', type: 'text', width: 140, sampleGenerator: (r) => ({ raw: ['Discovery', 'Engineering', 'Quality Assurance', 'Deployment'][r % 4] }) },
      { name: 'Owner / Lead', type: 'text', width: 140, sampleGenerator: (r) => ({ raw: ['Alex Morgan', 'Jordan Lee', 'Taylor Vance', 'Samira Khan'][r % 4] }) },
      { name: 'Priority', type: 'status', width: 110, sampleGenerator: (r) => { const p = ['Critical', 'High', 'Medium', 'Low'][r % 4]; const bg = p === 'Critical' ? 'bg-red-50 text-red-800' : (p === 'High' ? 'bg-amber-50 text-amber-800' : 'bg-neutral-100 text-neutral-800'); return { raw: p, bgHighlight: bg }; } },
      { name: 'Est. Days', type: 'number', width: 110, sampleGenerator: (r) => ({ raw: (r % 5) + 2 }) },
      { name: 'Actual Days', type: 'number', width: 110, sampleGenerator: (r) => ({ raw: (r % 5) + 1 + (r % 2) }) },
      { name: 'Variance', type: 'formula', width: 110, defaultFormula: '=E{row}-F{row}', sampleGenerator: (r) => { const v = ((r % 5) + 2) - ((r % 5) + 1 + (r % 2)); return { raw: v, formula: `=E${r+2}-F${r+2}`, formatted: `${v >= 0 ? '+' : ''}${v} d` }; } },
      { name: 'Status', type: 'status', width: 130, sampleGenerator: (r) => { const s = ['Done', 'In Progress', 'In Review', 'Backlog'][r % 4]; const bg = s === 'Done' ? 'bg-emerald-50 text-emerald-800' : (s === 'In Progress' ? 'bg-blue-50 text-blue-800' : (s === 'In Review' ? 'bg-purple-50 text-purple-800' : 'bg-neutral-100 text-neutral-800')); return { raw: s, bgHighlight: bg }; } },
      { name: 'Target Date', type: 'date', width: 120, sampleGenerator: (r) => ({ raw: `2026-04-${String((r * 3) % 28 + 1).padStart(2, '0')}` }) },
    ],
    kpis: (c, count) => [
      { title: 'Total Project Tasks', value: `${count} Tasks`, change: '100% Scheduled', trend: 'neutral', formulaHint: `=COUNTA(A2:A${count+1})` },
      { title: 'Tasks Completed', value: `${Math.ceil(count * 0.45)} Done`, change: '45% Progress', trend: 'up', formulaHint: `=COUNTIF(H2:H${count+1},"Done")` },
      { title: 'Estimated Total Effort', value: `${count * 4} Days`, change: 'Team Capacity', trend: 'neutral', formulaHint: `=SUM(E2:E${count+1})` },
      { title: 'Schedule Drift Index', value: '+1.2 Days', change: 'On Track', trend: 'up', formulaHint: `=AVERAGE(G2:G${count+1})` },
    ],
    recommendedFormulas: [
      '=COUNTIF(H2:H{end},"Done")/COUNTA(A2:A{end})',
      '=SUM(E2:E{end})',
      '=COUNTIFS(D2:D{end},"Critical",H2:H{end},"<>Done")',
      '=WORKDAY(I2, 5)'
    ],
    bestPractices: [
      'Use data validation dropdowns for Status and Priority to prevent typo errors.',
      'Highlight overdue deliverables with formula `=AND(I2<TODAY(), H2<>"Done")`.',
      'Calculate schedule variance in working business days rather than calendar days.'
    ]
  },
  {
    domain: 'sales_crm',
    keywords: ['sales', 'lead', 'client', 'crm', 'deal', 'customer', 'pipeline', 'conversion', 'prospect', 'contract', 'value', 'quota', 'commission'],
    category: 'Sales & CRM',
    columns: [
      { name: 'Account / Opportunity', type: 'text', width: 200, sampleGenerator: (r) => ({ raw: ['Apex Global Systems', 'Nordic Healthtech', 'Pacific Logistics', 'Quantum Data Inc', 'Vanguard Aerospace', 'Solaria Energy Ltd', 'Bravado Brands'][r % 7] }) },
      { name: 'Deal Owner', type: 'text', width: 140, sampleGenerator: (r) => ({ raw: ['Marcus Cole', 'Chloe Bennett', 'Devon Bailey', 'Siddharth Rao'][r % 4] }) },
      { name: 'Deal Value', type: 'currency', width: 140, sampleGenerator: (r, c) => { const v = (r + 1) * 18500; return { raw: v, formatted: `${c}${v.toLocaleString()}` }; } },
      { name: 'Win Probability %', type: 'percentage', width: 130, sampleGenerator: (r) => { const p = [0.2, 0.4, 0.6, 0.8, 0.9][r % 5]; return { raw: p, formatted: `${(p * 100).toFixed(0)}%` }; } },
      { name: 'Weighted Forecast', type: 'formula', width: 150, defaultFormula: '=C{row}*D{row}', sampleGenerator: (r, c) => { const val = (r + 1) * 18500 * [0.2, 0.4, 0.6, 0.8, 0.9][r % 5]; return { raw: val, formula: `=C${r+2}*D${r+2}`, formatted: `${c}${Math.round(val).toLocaleString()}` }; } },
      { name: 'Stage', type: 'status', width: 140, sampleGenerator: (r) => { const s = ['Discovery', 'Proposal Sent', 'Legal Review', 'Closed Won', 'Closed Lost'][r % 5]; const bg = s === 'Closed Won' ? 'bg-emerald-50 text-emerald-800' : (s === 'Legal Review' ? 'bg-blue-50 text-blue-800' : 'bg-neutral-100 text-neutral-800'); return { raw: s, bgHighlight: bg }; } },
      { name: 'Expected Close', type: 'date', width: 120, sampleGenerator: (r) => ({ raw: `2026-05-${String((r * 4) % 28 + 1).padStart(2, '0')}` }) },
    ],
    kpis: (c, count) => [
      { title: 'Total Pipeline Value', value: `${c}${Math.round(count * 18500 * (count/2)).toLocaleString()}`, change: 'Gross Pipeline', trend: 'up', formulaHint: `=SUM(C2:C${count+1})` },
      { title: 'Weighted Expected Revenue', value: `${c}${Math.round(count * 18500 * 0.58).toLocaleString()}`, change: 'Risk-Adjusted', trend: 'neutral', formulaHint: `=SUM(E2:E${count+1})` },
      { title: 'Average Deal Size', value: `${c}${Math.round(count * 9200).toLocaleString()}`, change: '+12% vs last quarter', trend: 'up', formulaHint: `=AVERAGE(C2:C${count+1})` },
      { title: 'Qualified Stage Conversion', value: '62.5%', change: 'Benchmark: 55%', trend: 'up', formulaHint: `=COUNTIF(F2:F${count+1},"Closed Won")/COUNTA(A2:A${count+1})` },
    ],
    recommendedFormulas: [
      '=SUMPRODUCT(C2:C{end},D2:D{end})',
      '=AVERAGEIF(F2:F{end},"Closed Won",C2:C{end})',
      '=COUNTIFS(F2:F{end},"Proposal Sent",D2:D{end},">=0.5")',
      '=SUMIFS(E2:E{end},B2:B{end},"Marcus Cole")'
    ],
    bestPractices: [
      'Multiply Deal Value by Win Probability to generate risk-adjusted weighted pipeline.',
      'Automate commissions with `=IF(F2="Closed Won", C2*0.1, 0)`.',
      'Track deal cycle time with `=DATEDIF(CreateDate, CloseDate, "d")`.'
    ]
  },
  {
    domain: 'inventory_operations',
    keywords: ['inventory', 'stock', 'warehouse', 'sku', 'product', 'supply', 'reorder', 'supplier', 'logistics', 'shipping', 'fleet', 'unit', 'storage', 'asset'],
    category: 'Operations',
    columns: [
      { name: 'SKU / Item ID', type: 'text', width: 120, sampleGenerator: (r) => ({ raw: `SKU-${1000 + r * 15}` }) },
      { name: 'Item Description', type: 'text', width: 220, sampleGenerator: (r) => ({ raw: ['Heavy Duty Steel Fastener', 'Microcontroller Board v2', 'Lithium Battery Pack 48V', 'Optical Sensor Module', 'Brushless DC Motor', 'Alloy Heat Sink 120mm', 'Silicone Sealant Gasket'][r % 7] }) },
      { name: 'Unit Cost', type: 'currency', width: 120, sampleGenerator: (r, c) => { const v = (r + 1) * 4.5 + 8; return { raw: v, formatted: `${c}${v.toFixed(2)}` }; } },
      { name: 'Stock on Hand', type: 'number', width: 120, sampleGenerator: (r) => ({ raw: (r % 4 === 0) ? 14 : (r + 1) * 35 }) },
      { name: 'Reorder Level', type: 'number', width: 120, sampleGenerator: (r) => ({ raw: 25 }) },
      { name: 'Stock Valuation', type: 'formula', width: 140, defaultFormula: '=C{row}*D{row}', sampleGenerator: (r, c) => { const val = ((r + 1) * 4.5 + 8) * ((r % 4 === 0) ? 14 : (r + 1) * 35); return { raw: val, formula: `=C${r+2}*D${r+2}`, formatted: `${c}${val.toFixed(2)}` }; } },
      { name: 'Stock Status', type: 'status', width: 130, sampleGenerator: (r) => { const low = (r % 4 === 0); return { raw: low ? 'REORDER' : 'Adequate', bgHighlight: low ? 'bg-amber-50 text-amber-900' : 'bg-emerald-50 text-emerald-900' }; } },
      { name: 'Primary Supplier', type: 'text', width: 160, sampleGenerator: (r) => ({ raw: ['Apex Industrial Supply', 'Kinetic Components', 'Global Logistics Hub', 'Pinnacle Metals'][r % 4] }) },
    ],
    kpis: (c, count) => [
      { title: 'Total Inventory Valuation', value: `${c}${Math.round(count * 640).toLocaleString()}`, change: 'Current Assets', trend: 'neutral', formulaHint: `=SUM(F2:F${count+1})` },
      { title: 'Total Units in Warehouse', value: `${count * 38} Units`, change: 'Physical Count', trend: 'neutral', formulaHint: `=SUM(D2:D${count+1})` },
      { title: 'Items Requiring Reorder', value: `${Math.ceil(count / 4)} SKUs`, change: 'Action Triggered', trend: 'down', formulaHint: `=COUNTIF(G2:G${count+1},"REORDER")` },
      { title: 'Average Unit Cost', value: `${c}${(18.4).toFixed(2)}`, change: 'Stable', trend: 'neutral', formulaHint: `=AVERAGE(C2:C${count+1})` },
    ],
    recommendedFormulas: [
      '=IF(D2<=E2,"REORDER","Adequate")',
      '=SUMPRODUCT(C2:C{end},D2:D{end})',
      '=XLOOKUP(A2,SupplierCatalog!A:A,SupplierCatalog!D:D)',
      '=COUNTIF(G2:G{end},"REORDER")'
    ],
    bestPractices: [
      'Maintain automated safety stock buffers to absorb supply chain transit delays.',
      'Audit physical counts quarterly against book values with cycle counts.',
      'Use SUMPRODUCT to compute total holding valuation instantly without helper columns.'
    ]
  },
  {
    domain: 'hr_people',
    keywords: ['employee', 'staff', 'hr', 'human resources', 'payroll', 'salary', 'compensation', 'leave', 'attendance', 'performance', 'hiring', 'recruitment', 'team', 'shift'],
    category: 'Human Resources',
    columns: [
      { name: 'Employee ID', type: 'text', width: 110, sampleGenerator: (r) => ({ raw: `EMP-${200 + r}` }) },
      { name: 'Full Name', type: 'text', width: 170, sampleGenerator: (r) => ({ raw: ['Aria Montgomery', 'Liam Gallagher', 'Sophia Patel', 'Jackson Reed', 'Zoe Kravitz', 'Ethan Vance', 'Maya Lin'][r % 7] }) },
      { name: 'Department', type: 'text', width: 140, sampleGenerator: (r) => ({ raw: ['Engineering', 'Product Design', 'Growth & Marketing', 'Customer Success', 'Finance'][r % 5] }) },
      { name: 'Annual Base Salary', type: 'currency', width: 150, sampleGenerator: (r, c) => { const s = 75000 + (r % 5) * 18000; return { raw: s, formatted: `${c}${s.toLocaleString()}` }; } },
      { name: 'Bonus Target %', type: 'percentage', width: 120, sampleGenerator: (r) => { const b = 0.10 + (r % 3) * 0.05; return { raw: b, formatted: `${(b * 100).toFixed(0)}%` }; } },
      { name: 'Total Target Comp', type: 'formula', width: 150, defaultFormula: '=D{row}*(1+E{row})', sampleGenerator: (r, c) => { const s = 75000 + (r % 5) * 18000; const b = 0.10 + (r % 3) * 0.05; const tot = s * (1 + b); return { raw: tot, formula: `=D${r+2}*(1+E${r+2})`, formatted: `${c}${Math.round(tot).toLocaleString()}` }; } },
      { name: 'PTO Days Left', type: 'number', width: 120, sampleGenerator: (r) => ({ raw: 15 - (r % 8) }) },
      { name: 'Employment Type', type: 'status', width: 130, sampleGenerator: (r) => ({ raw: r % 4 === 0 ? 'Contract' : 'Full-Time', bgHighlight: r % 4 === 0 ? 'bg-purple-50 text-purple-800' : 'bg-emerald-50 text-emerald-800' }) },
    ],
    kpis: (c, count) => [
      { title: 'Total Annual Headcount Payroll', value: `${c}${Math.round(count * 108000).toLocaleString()}`, change: 'Full Team', trend: 'neutral', formulaHint: `=SUM(F2:F${count+1})` },
      { title: 'Average Base Salary', value: `${c}${Math.round(count * 96000 / count).toLocaleString()}`, change: 'Benchmark 50th %tile', trend: 'up', formulaHint: `=AVERAGE(D2:D${count+1})` },
      { title: 'Active Headcount', value: `${count} Team Members`, change: '100% Retained', trend: 'up', formulaHint: `=COUNTA(A2:A${count+1})` },
      { title: 'Average Unused PTO Days', value: '11.4 Days', change: 'Healthy Utilization', trend: 'neutral', formulaHint: `=AVERAGE(G2:G${count+1})` },
    ],
    recommendedFormulas: [
      '=AVERAGEIF(C2:C{end},"Engineering",D2:D{end})',
      '=SUM(F2:F{end})',
      '=COUNTIF(H2:H{end},"Full-Time")',
      '=DATEDIF(HireDate, TODAY(), "y")'
    ],
    bestPractices: [
      'Separate PII and compensation tables with strict worksheet protection if sharing.',
      'Use AVERAGEIF to benchmark equity and compensation parity across departments.',
      'Calculate tenure with `=DATEDIF(StartDate, TODAY(), "Y") & " yrs"`. '
    ]
  },
  {
    domain: 'education_health_stats',
    keywords: ['grade', 'student', 'school', 'class', 'gpa', 'exam', 'quiz', 'course', 'calorie', 'fitness', 'workout', 'diet', 'health', 'macro', 'patient', 'clinical', 'experiment', 'metric', 'research'],
    category: 'Education & Science',
    columns: [
      { name: 'Subject / Candidate', type: 'text', width: 170, sampleGenerator: (r) => ({ raw: ['Candidate Alpha-1', 'Candidate Beta-2', 'Candidate Gamma-3', 'Candidate Delta-4', 'Candidate Epsilon-5', 'Candidate Zeta-6'][r % 6] }) },
      { name: 'Baseline Score', type: 'number', width: 120, sampleGenerator: (r) => ({ raw: 68 + (r % 15) * 2 }) },
      { name: 'Midterm Metric', type: 'number', width: 120, sampleGenerator: (r) => ({ raw: 74 + (r % 12) * 2 }) },
      { name: 'Final Assessment', type: 'number', width: 130, sampleGenerator: (r) => ({ raw: 82 + (r % 14) }) },
      { name: 'Weighted Average', type: 'formula', width: 140, defaultFormula: '=B{row}*0.2+C{row}*0.3+D{row}*0.5', sampleGenerator: (r) => { const base = 68 + (r % 15) * 2; const mid = 74 + (r % 12) * 2; const fin = 82 + (r % 14); const w = base * 0.2 + mid * 0.3 + fin * 0.5; return { raw: Math.round(w * 10) / 10, formula: `=B${r+2}*0.2+C${r+2}*0.3+D${r+2}*0.5`, formatted: `${w.toFixed(1)}%` }; } },
      { name: 'Grade / Rating', type: 'formula', width: 120, defaultFormula: '=IF(E{row}>=90,"A",IF(E{row}>=80,"B",IF(E{row}>=70,"C","D")))', sampleGenerator: (r) => { const g = ['A', 'B', 'B+', 'A-', 'A+'][r % 5]; return { raw: g, formula: `=IF(E${r+2}>=90,"A",IF(E${r+2}>=80,"B","C"))`, bgHighlight: 'bg-emerald-50 text-emerald-800' }; } },
      { name: 'Status', type: 'status', width: 120, sampleGenerator: () => ({ raw: 'Passed', bgHighlight: 'bg-emerald-50 text-emerald-800' }) },
    ],
    kpis: (_c, count) => [
      { title: 'Cohort Mean Score', value: '84.6%', change: '+6.2% vs Baseline', trend: 'up', formulaHint: `=AVERAGE(E2:E${count+1})` },
      { title: 'Total Evaluated Sample', value: `${count} Subjects`, change: '100% Completion', trend: 'neutral', formulaHint: `=COUNT(B2:B${count+1})` },
      { title: 'Highest Observed Score', value: '96.5%', change: 'Top Decile', trend: 'up', formulaHint: `=MAX(E2:E${count+1})` },
      { title: 'Pass Rate Qualification', value: '100%', change: 'Zero Failures', trend: 'up', formulaHint: `=COUNTIF(G2:G${count+1},"Passed")/COUNTA(A2:A${count+1})` },
    ],
    recommendedFormulas: [
      '=AVERAGE(E2:E{end})',
      '=STDEV.S(E2:E{end})',
      '=IF(E2>=90,"A",IF(E2>=80,"B","C"))',
      '=PERCENTILE.INC(E2:E{end}, 0.75)'
    ],
    bestPractices: [
      'Use WEIGHTED averages (`=SUMPRODUCT(Scores, Weights)`) rather than unweighted simple averages.',
      'Compute standard deviations (`=STDEV.S()`) to identify statistical distribution skew.',
      'Set conditional formatting to highlight outliers 2 standard deviations away from the mean.'
    ]
  }
];

export function generateProjectOffline(options: GeneratorOptions): ExcelProject {
  const { projectName, rowCount = 10, currency = '$', complexity = 'standard' } = options;
  const normalizedInput = projectName.toLowerCase().trim();

  // 1. Check if exact or partial match with curated blueprints
  const matchingBlueprint = CURATED_BLUEPRINTS.find(b => 
    b.title.toLowerCase().includes(normalizedInput) || 
    b.tags.some(t => normalizedInput.includes(t.toLowerCase())) ||
    normalizedInput.includes(b.category.toLowerCase())
  );

  if (matchingBlueprint && normalizedInput.length > 5 && (
    normalizedInput.includes('startup') || 
    normalizedInput.includes('agile') || 
    normalizedInput.includes('sprint') || 
    normalizedInput.includes('ecommerce') || 
    normalizedInput.includes('freelance') || 
    normalizedInput.includes('real estate') || 
    normalizedInput.includes('mortgage')
  )) {
    // Clone curated blueprint with user's selected row count if possible
    return JSON.parse(JSON.stringify(matchingBlueprint));
  }

  // 2. Select matching domain rule or default to business/financial
  let matchedRule = DOMAIN_RULES.find(rule => 
    rule.keywords.some(keyword => normalizedInput.includes(keyword))
  );

  if (!matchedRule) {
    // Fallback heuristic: determine if it's tracking, scheduling, counting, or commercial
    if (normalizedInput.includes('plan') || normalizedInput.includes('track') || normalizedInput.includes('list') || normalizedInput.includes('manage')) {
      matchedRule = DOMAIN_RULES[1]; // project management
    } else if (normalizedInput.includes('order') || normalizedInput.includes('item') || normalizedInput.includes('shop') || normalizedInput.includes('store') || normalizedInput.includes('catalog')) {
      matchedRule = DOMAIN_RULES[3]; // inventory
    } else {
      matchedRule = DOMAIN_RULES[0]; // general financial / business
    }
  }

  // Build sheet columns
  const columns: ColumnDefinition[] = matchedRule.columns.map((col, idx) => ({
    id: `col_${idx + 1}`,
    name: col.name,
    letter: colLetter(idx),
    type: col.type,
    width: col.width,
    defaultFormula: col.defaultFormula,
    description: `Column ${colLetter(idx)}: ${col.name} (${col.type})`
  }));

  // Build rows dynamically
  const rows: (CellData | null)[][] = [];
  for (let r = 0; r < rowCount; r++) {
    const rowData: (CellData | null)[] = [];
    for (let c = 0; c < columns.length; c++) {
      const generator = matchedRule.columns[c].sampleGenerator;
      const cell = generator(r, currency);
      rowData.push({
        raw: cell.raw,
        formatted: cell.formatted || (typeof cell.raw === 'number' ? cell.raw.toString() : cell.raw),
        formula: cell.formula,
        bgHighlight: cell.bgHighlight,
        type: columns[c].type,
        align: columns[c].type === 'number' || columns[c].type === 'currency' || columns[c].type === 'percentage' ? 'right' : (columns[c].type === 'status' ? 'center' : 'left'),
      });
    }
    rows.push(rowData);
  }

  const kpis = matchedRule.kpis(currency, rowCount);

  // Capitalize title
  const formattedTitle = projectName.trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const newProject: ExcelProject = {
    id: `project_${Date.now()}`,
    title: formattedTitle || 'Custom Offline Excel Model',
    category: matchedRule.category,
    description: `Engineered offline spreadsheet model for "${formattedTitle}" with automated dynamic formulas, schema rules, and analytical indicators.`,
    tags: [matchedRule.category, 'Offline Generator', complexity.toUpperCase(), `${rowCount} Rows`],
    recommendedFormulas: matchedRule.recommendedFormulas.map(f => f.replace('{end}', String(rowCount + 1))),
    bestPractices: matchedRule.bestPractices,
    createdAt: new Date().toISOString().split('T')[0],
    activeSheetIndex: 0,
    sheets: [
      {
        id: `sheet_${Date.now()}_1`,
        name: formattedTitle.slice(0, 24) || 'Main Model',
        columns,
        rows,
        kpis,
        chartRecommended: 'bar'
      }
    ]
  };

  return newProject;
}
