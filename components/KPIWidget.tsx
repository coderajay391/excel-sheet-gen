'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Calculator, Sparkles } from 'lucide-react';
import { KPICard } from '../types/excel';

interface KPIWidgetProps {
  kpis: KPICard[];
  projectTitle: string;
}

export default function KPIWidget({ kpis, projectTitle }: KPIWidgetProps) {
  if (!kpis || kpis.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold uppercase tracking-wider">Project Analytics</span>
        </div>
        <p className="text-xs text-slate-400">
          No automated KPI indicators configured for this custom sheet yet. Add formulas to columns to evaluate live aggregates.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Automated KPI & Financial Indicators
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Live Model Calculus
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, idx) => (
          <div
            key={`kpi_${idx}`}
            className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs text-slate-400 truncate" title={kpi.title}>
                  {kpi.title}
                </span>
                {kpi.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : kpi.trend === 'down' ? (
                  <TrendingDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
              </div>

              <div className="text-lg font-bold text-white font-mono tabular-nums tracking-tight mb-1">
                {kpi.value}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
              {kpi.change && (
                <span className="text-slate-300 font-medium">
                  {kpi.change}
                </span>
              )}
              {kpi.formulaHint && (
                <span className="font-mono text-[10px] text-emerald-400/80 truncate" title={kpi.formulaHint}>
                  {kpi.formulaHint}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
