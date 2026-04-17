'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { eventsModule } from '@/src/components/events/eventsModule';
import { AppDispatch, RootState } from '@/src/hook/store';
import {
  getDashboardModuleCrud,
  selectDashboardModuleSnapshot,
} from '@/src/components/dashboard/dashboardModuleRegistry';

export default function EventViewPage() {
  const params = useParams();
  const id = params?.id as string;

  const dispatch = useDispatch<AppDispatch>();
  const moduleCrud = getDashboardModuleCrud('events');
  const moduleSnapshot = useSelector((state: RootState) =>
    selectDashboardModuleSnapshot(state, 'events')
  );

  useEffect(() => {
    if (!moduleSnapshot.isFetched) {
      dispatch(moduleCrud.fetchAllThunk());
    }
  }, [dispatch, moduleCrud, moduleSnapshot.isFetched]);

  const record = moduleSnapshot.records.find((r: any) => r._id === id || r.id === id);
  const rowInfo = record ? moduleCrud.mapRecordToRow(record) : null;
  const rowToUse = rowInfo || eventsModule.initialRows.find((r) => r.id === id);

  if (!moduleSnapshot.isFetched && !rowToUse) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-navy font-semibold">
        Loading event details...
      </div>
    );
  }

  if (!rowToUse) {
    return (
      <div className="p-8 rounded-[2rem] border border-border-light bg-white shadow-sh-sm text-center max-w-2xl mx-auto mt-12">
        <h1 className="text-2xl font-black tracking-tight text-navy">Event not found</h1>
        <p className="mt-3 max-w-lg mx-auto text-sm leading-6 text-text-muted">
          The event you are looking for does not exist or has been removed from the admin workspace.
        </p>
        <Link
          href="/dashboard/events"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-bg-soft px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-gold-pale hover:text-gold-3"
        >
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/dashboard/events"
        className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-text-subtle transition hover:text-navy"
      >
        <ArrowLeft size={14} /> Back to Events dataset
      </Link>

      <div className="rounded-[2rem] border border-border-light bg-white p-6 shadow-sh-sm lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6 border-b border-border-light pb-6 mb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-primary-deep via-primary-dark to-primary text-white shadow-sh-sm">
            <Calendar size={28} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-black tracking-tight text-navy lg:text-4xl">
              {rowToUse.values.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-border-light bg-bg-soft px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {rowToUse.values.type || 'Event Details'}
              </span>
              <span className="rounded-full px-3 py-1.5 text-xs font-bold bg-sage-2 text-sage">
                {rowToUse.values.status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {eventsModule.fields.map((field) => {
            const value = rowToUse.values[field.key];
            
            let content;
            if (field.type === 'file' && value && value.length > 0) {
              const files = Array.isArray(value) ? value : [value];
              content = (
                <div className="flex flex-wrap gap-4">
                  {files.map((fileStr, idx) => {
                    if (typeof fileStr === 'string' && (fileStr.startsWith('data:image/') || fileStr.startsWith('http'))) {
                      return (
                        <img 
                          key={idx} 
                          src={fileStr} 
                          alt={`${field.label} ${idx + 1}`} 
                          className="h-auto max-w-[200px] rounded-lg border border-border-light object-cover" 
                        />
                      );
                    }
                    return <span key={idx} className="break-all">{String(fileStr)}</span>;
                  })}
                </div>
              );
            } else {
              content = <div className="break-words break-all">{Array.isArray(value) ? value.join(', ') : (value || '—')}</div>;
            }

            return (
              <div key={field.key} className={field.span === 2 ? 'md:col-span-2 min-w-0' : 'min-w-0'}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-subtle mb-2">
                  {field.label}
                </h3>
                <div className="min-h-[3rem] w-full rounded-[1.25rem] border border-border-light bg-bg-soft px-5 py-3.5 text-sm font-medium leading-6 text-navy overflow-hidden">
                  {content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
