'use client';

import { PencilLine, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/src/lib/utils';
import {
  managementSections,
  type CrudStatusTone,
  type ManagementSection,
} from './dashboardData';

const statusToneClasses: Record<CrudStatusTone, string> = {
  neutral: 'bg-bg-2 text-navy',
  success: 'bg-sage-2 text-sage',
  warning: 'bg-gold-pale text-gold',
  danger: 'bg-crimson-2 text-crimson',
};

const accentClasses: Record<ManagementSection['accent'], string> = {
  primary: 'from-primary-deep via-primary-dark to-primary',
  gold: 'from-gold via-gold-2 to-gold-3',
  sage: 'from-sage via-primary-dark to-primary',
  crimson: 'from-crimson via-[#cf4d4d] to-[#8f1b1b]',
};

export function DashboardCrudBoard() {
  return (
    <section className="space-y-6">
      {managementSections.map((section) => (
        <article
          id={section.id}
          key={section.id}
          className="scroll-mt-24 rounded-[2rem] border border-border-light bg-white shadow-sh-sm"
        >
          <div
            className={cn(
              'rounded-t-[2rem] px-6 py-5 text-white shadow-sh-sm',
              `bg-linear-to-r ${accentClasses[section.accent]}`
            )}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/75">
                  {section.id}
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  {section.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/78">
                  {section.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
                  CRUD ready
                </span>
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  className="rounded-xl bg-white text-navy hover:bg-gold-pale"
                >
                  <Plus size={14} />
                  {section.actionLabel}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-7">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-3xl text-sm leading-6 text-text-muted">
                {section.helper}
              </p>
              <div className="flex flex-wrap gap-2">
                {section.columns.map((column) => (
                  <span
                    key={column}
                    className="rounded-full border border-border-light bg-bg-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted"
                  >
                    {column}
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-border-light">
              <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                  <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_auto] gap-4 bg-bg-soft px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">
                    {section.columns.map((column) => (
                      <div key={column}>{column}</div>
                    ))}
                    <div>Actions</div>
                  </div>

                  <div className="divide-y divide-border-light">
                    {section.rows.map((row, index) => (
                      <div
                        key={`${section.id}-${index}`}
                        className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_auto] gap-4 px-5 py-4 text-sm"
                      >
                        {row.cells.map((cell) => (
                          <div key={cell} className="font-medium text-navy">
                            {cell}
                          </div>
                        ))}
                        <div className="flex items-center">
                          <span
                            className={cn(
                              'inline-flex rounded-full px-3 py-1 text-xs font-bold',
                              statusToneClasses[row.tone]
                            )}
                          >
                            {row.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border-light bg-bg-soft px-3 py-2 text-xs font-bold text-navy transition hover:border-primary hover:text-primary"
                          >
                            <PencilLine size={13} />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border-light bg-white px-3 py-2 text-xs font-bold text-crimson transition hover:border-crimson hover:bg-crimson-2"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
