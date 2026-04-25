"use client";

import React from 'react';
import { cn } from '@/src/lib/utils';
import type { DashboardSummaryCard, DashboardStatusTone } from '../dashboardTypes';

const summaryToneDotClasses: Record<DashboardStatusTone, string> = {
  neutral: 'bg-primary-dark',
  success: 'bg-sage',
  warning: 'bg-gold',
  danger: 'bg-crimson',
};

interface DashboardSummaryProps {
  summaryCards: DashboardSummaryCard[];
}

export default function DashboardSummary({ summaryCards }: DashboardSummaryProps) {
  return (
    <div className="grid gap-4 px-6 py-6 lg:grid-cols-4 lg:px-8">
      {summaryCards.map((summary) => (
        <div
          key={summary.label}
          className="rounded-[1.5rem] border border-border-light bg-bg-soft/70 px-4 py-4 shadow-sh-xs"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-subtle">
              {summary.label}
            </p>
            <span
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                summaryToneDotClasses[summary.tone]
              )}
            />
          </div>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-3xl font-black text-navy">{summary.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
