"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { DashboardModuleConfig, DashboardModuleRow } from '../dashboardTypes';
import { NominationFormType } from '@/src/hook/nominations/nominationType';

interface DashBoardHeaderProps {
  config: DashboardModuleConfig;
  records: DashboardModuleRow[] | NominationFormType[];
  openForm: () => void;
  isFormOpen: boolean;
  formId: string;
}

export default function DashBoardHeader({
  config,
  records,
  openForm,
  isFormOpen,
  formId,
}: DashBoardHeaderProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/75">
          Dedicated module
        </p>
        <h1 className="mt-2 flex items-center gap-3 text-3xl font-black tracking-tight lg:text-4xl">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
            <config.icon size={22} />
          </span>
          {config.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/78 lg:text-base">
          {config.subtitle}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">
          {config.intro}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
          {records.length} records
        </span>
        {config.actionLabel && config.fields.length > 0 && (
          <Button
            type="button"
            variant="gold"
            size="sm"
            className="rounded-xl bg-white text-navy hover:bg-gold-pale"
            onClick={openForm}
            aria-expanded={isFormOpen}
            aria-controls={formId}
          >
            <Plus size={14} />
            {config.actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}