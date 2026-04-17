'use client';

import { Eye, PencilLine, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { cn } from '@/src/lib/utils';
import type { DashboardModuleConfig, DashboardModuleRow, DashboardStatusTone } from './dashboardModules';
import { getTextValue } from './dashboardModuleFormUtils';

const statusToneClasses: Record<DashboardStatusTone, string> = {
  neutral: 'bg-bg-2 text-navy',
  success: 'bg-sage-2 text-sage',
  warning: 'bg-gold-pale text-gold',
  danger: 'bg-crimson-2 text-crimson',
};

type DashboardModuleListProps = {
  config: DashboardModuleConfig;
  tableId: string;
  records: DashboardModuleRow[];
  editingId: string | null;
  onEdit: (row: DashboardModuleRow) => void;
  onDelete: (row: DashboardModuleRow) => void;
  onAddMore: () => void;
};

export function DashboardModuleList({
  config,
  tableId,
  records,
  editingId,
  onEdit,
  onDelete,
  onAddMore,
}: DashboardModuleListProps) {
  return (
    <article
      id={tableId}
      className="scroll-mt-24 rounded-[2rem] border border-border-light bg-white p-6 shadow-sh-sm lg:p-7"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-text-subtle">
            Data table
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-navy">
            {config.title} records
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
            Review the current dataset, edit a row, or delete entries that should no longer appear in the admin workspace.
          </p>
        </div>

        <Button type="button" variant="ghost" onClick={onAddMore}>
          <Plus size={14} />
          Add more records
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-border-light">
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div
              className="grid gap-4 bg-bg-soft px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle"
              style={{ gridTemplateColumns: `${config.tableTemplateColumns} 9rem` }}
            >
              {config.columns.map((column) => (
                <div key={column.key}>{column.label}</div>
              ))}
              <div>Actions</div>
            </div>

            <div className="divide-y divide-border-light">
              {records.length ? (
                records.map((row) => (
                  <div
                    key={row.id}
                    className={cn(
                      'grid gap-4 px-5 py-4 text-sm',
                      editingId === row.id ? 'bg-gold-pale/40' : 'bg-white'
                    )}
                    style={{ gridTemplateColumns: `${config.tableTemplateColumns} 9rem` }}
                  >
                    {config.columns.map((column) => {
                      const value = getTextValue(row.values[column.key]) || '—';

                      if (column.key === 'status') {
                        const tone = config.statusToneMap[value] ?? 'neutral';

                        return (
                          <div key={column.key} className="flex items-center">
                            <span
                              className={cn(
                                'inline-flex rounded-full px-3 py-1 text-xs font-bold',
                                statusToneClasses[tone]
                              )}
                            >
                              {value}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div key={column.key} className="min-w-0 font-medium text-navy">
                          {value}
                        </div>
                      );
                    })}

                    <div className="flex items-center gap-2">
                      {config.id === 'events' && (
                        <Link
                          href={`/dashboard/events/${row.id}`}
                          title="View"
                          className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-border-light bg-bg-soft text-navy transition hover:border-primary hover:text-primary"
                        >
                          <Eye size={15} />
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        title="Edit"
                        className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-border-light bg-bg-soft text-navy transition hover:border-primary hover:text-primary"
                      >
                        <PencilLine size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        title="Delete"
                        className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-border-light bg-white text-crimson transition hover:border-crimson hover:bg-crimson-2"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm font-semibold text-navy">No records yet.</p>
                  <p className="mt-2 text-sm text-text-muted">
                    Use the form above to create the first entry for this module.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
