'use client';

import { ArrowRight, MoreVertical, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { donutStats, insights, visitBars } from './dashboardData';

function CardFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-[2rem] border border-border-light bg-white p-5 shadow-sh-sm lg:p-6', className)}>
      {children}
    </div>
  );
}

function VisitsChart() {
  return (
    <CardFrame className="lg:col-span-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-2xl font-bold text-navy">Website visits</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-5xl font-extrabold text-navy">8,150</span>
            <span className="rounded-full bg-sage-2 px-2.5 py-1 text-xs font-bold text-sage">+18%</span>
            <span className="text-sm text-text-muted">than last year</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-text-muted">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary-dark" />
            Applications
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gold-2" />
            Awards
          </span>
          <button className="rounded-xl border border-border-light px-4 py-2 text-navy">2026</button>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-6 gap-2 text-[11px] font-medium text-text-subtle sm:grid-cols-12">
          {visitBars.map((bar) => (
            <div key={bar.month} className="flex flex-col items-center gap-3">
              <div className="flex h-60 w-full items-end justify-center gap-1 rounded-[1.5rem] bg-bg-soft/80 px-2 py-4">
                <div
                  className="w-full rounded-full bg-primary-dark"
                  style={{ height: `${bar.primary}%` }}
                />
                <div
                  className="w-full rounded-full bg-linear-to-t from-gold via-gold-2 to-gold-3"
                  style={{ height: `${bar.secondary}%` }}
                />
              </div>
              <span>{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </CardFrame>
  );
}

function DonutCard() {
  const gradients: string[] = [];
  let offset = 0;

  for (const stat of donutStats) {
    gradients.push(`${stat.color} ${offset}% ${offset + stat.value}%`);
    offset += stat.value;
  }

  return (
    <CardFrame>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-navy">Current visits</h3>
        <button className="text-text-muted">
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center">
        <div
          className="relative flex h-44 w-44 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${gradients.join(', ')})`,
          }}
        >
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner">
            <span className="text-sm text-text-muted">Total</span>
            <span className="text-4xl font-extrabold text-navy">100</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {donutStats.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-3 text-navy">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-semibold">{item.label}</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="font-bold text-navy">{item.value}%</span>
              <span className={cn('rounded-full px-2 py-1 text-xs font-bold', item.delta.startsWith('-') ? 'bg-rose-100 text-rose-600' : 'bg-sage-2 text-sage')}>
                {item.delta}
              </span>
            </span>
          </div>
        ))}
      </div>
    </CardFrame>
  );
}

export function DashboardOverview() {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.9fr_1fr]">
      <div className="grid gap-5">
        <CardFrame className="overflow-hidden border-none bg-linear-to-br from-primary-deep via-primary-dark to-primary px-6 py-7 text-white shadow-sh-lg">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-gold-3">
                <Sparkles size={14} />
                Acadivate intelligence
              </div>
              <h2 className="mt-5 max-w-xl text-4xl font-extrabold leading-tight">
                Good morning, Cameron. Research momentum is accelerating.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/72">
                Stay updated on scholar applications, institutional submissions, and conference engagement from one place.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-navy transition hover:bg-gold-pale">
                View full report <ArrowRight size={16} />
              </button>
            </div>

            <div className="relative hidden min-h-[180px] lg:block">
              <div className="absolute bottom-0 right-0 flex items-end gap-3">
                <div className="h-28 w-10 rounded-t-2xl bg-white/10" />
                <div className="h-40 w-10 rounded-t-2xl bg-white/10" />
                <div className="h-24 w-10 rounded-t-2xl bg-white/10" />
                <div className="h-52 w-10 rounded-t-2xl bg-white/10" />
              </div>
              <div className="absolute bottom-16 left-6 h-24 w-24 rotate-12 rounded-[2rem] border-4 border-gold bg-white/10" />
              <TrendingUp size={132} className="absolute right-6 top-2 text-gold" strokeWidth={1.9} />
            </div>
          </div>
        </CardFrame>

        <VisitsChart />
      </div>

      <div className="grid gap-5">
        <CardFrame>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-navy">Key insights</h3>
            <button className="text-text-muted">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="mt-7 space-y-6">
            {insights.map((item, index) => (
              <div key={item.label}>
                <p className="text-sm text-text-muted">{item.label}</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-4xl font-extrabold text-navy">{item.value}</span>
                  <span className="rounded-full bg-sage-2 px-2.5 py-1 text-xs font-bold text-sage">{item.delta}</span>
                </div>
                {index === 0 ? (
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg-2">
                    <div className="flex h-full">
                      <div className="w-[45%] bg-primary-dark" />
                      <div className="w-[23%] bg-gold" />
                      <div className="w-[17%] bg-gold-2" />
                      <div className="w-[15%] bg-sage" />
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </CardFrame>

        <DonutCard />
      </div>
    </section>
  );
}
