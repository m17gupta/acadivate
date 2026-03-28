import Link from 'next/link';
import { ArrowRight, LayoutGrid, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import {
  dashboardModuleList,
  type DashboardAccent,
} from './dashboardModules';

const accentClasses: Record<DashboardAccent, string> = {
  primary: 'from-primary-deep via-primary-dark to-primary',
  gold: 'from-gold via-gold-2 to-gold-3',
  sage: 'from-sage via-primary-dark to-primary',
  crimson: 'from-crimson via-[#cf4d4d] to-[#8f1b1b]',
};

const helperNotes = [
  'Each module now has its own create, edit, and delete workflow.',
  'The module pages use local session data, so you can test CRUD behavior immediately.',
  'The sidebar routes directly to Events, Awards, Nominations, Rankings, and Leads.',
  'The root dashboard acts as a launchpad instead of a single combined board.',
];

export function DashboardPage() {
  return (
    <section className="space-y-6">
      <article className="overflow-hidden rounded-[2rem] border border-border-light bg-white shadow-sh-sm">
        <div className="bg-linear-to-r from-navy via-primary-deep to-primary-dark px-6 py-7 text-white lg:px-8 lg:py-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-gold-3">
                <Sparkles size={14} />
                Content workspace
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-tight lg:text-5xl">
                Manage events, awards, nominations, rankings, and leads from separate pages.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/72">
                The dashboard is now split into dedicated module pages, each with its own add form, editable data table, and CRUD controls.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/events"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-navy transition hover:bg-gold-pale"
                >
                  Open Events
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/dashboard/nominations?open=form#nominations-form"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Review Nominations
                </Link>
                <Link
                  href="/dashboard/leads?open=form#leads-form"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Review Leads
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[340px]">
              {dashboardModuleList.map((module) => (
                <div
                  key={module.id}
                  className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                        {module.title}
                      </p>
                      <p className="mt-2 text-3xl font-black">{module.initialRows.length}</p>
                    </div>
                    <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sh-sm bg-linear-to-r', accentClasses[module.accent])}>
                      <module.icon size={19} />
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/72">{module.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardModuleList.map((module) => (
          <article
            key={module.id}
            className="rounded-[2rem] border border-border-light bg-white p-5 shadow-sh-sm transition hover:-translate-y-0.5 hover:shadow-sh-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-text-subtle">
                  Dedicated module
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-navy">
                  {module.title}
                </h2>
              </div>
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sh-sm bg-linear-to-r',
                  accentClasses[module.accent]
                )}
              >
                <module.icon size={19} />
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-text-muted">{module.subtitle}</p>

            <div className="mt-5 rounded-[1.5rem] bg-bg-soft px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-subtle">
                Records
              </p>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-3xl font-black text-navy">{module.initialRows.length}</span>
                <span className="mb-1 text-sm text-text-muted">seeded rows</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={module.route}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-navy px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
              >
                Open page
                <ArrowRight size={15} />
              </Link>
              <Link
                href={`${module.route}?open=form#${module.id}-form`}
                aria-label={`Add ${module.title}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border-light bg-white px-4 py-3 text-sm font-bold text-navy transition hover:border-primary hover:text-primary"
              >
                <Plus size={15} />
                Add
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-[2rem] border border-border-light bg-white p-6 shadow-sh-sm lg:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-pale text-gold">
              <LayoutGrid size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-text-subtle">
                Workflow note
              </p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-navy">
                Why the dashboard is split
              </h3>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {helperNotes.map((note) => (
              <div key={note} className="rounded-[1.5rem] border border-border-light bg-bg-soft/70 px-4 py-4 text-sm leading-6 text-text-muted">
                {note}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-border-light bg-linear-to-br from-primary-deep via-primary-dark to-primary p-6 text-white shadow-sh-lg lg:p-7">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gold-3/80">
            Quick launch
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Jump straight into the page you need.
          </h3>
          <p className="mt-3 text-sm leading-6 text-white/72">
            Use the sidebar for routine navigation or the cards above for fast access to the add forms.
          </p>

          <div className="mt-6 space-y-3">
            {dashboardModuleList.map((module) => (
              <Link
                key={module.id}
                href={module.route}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <span>{module.title}</span>
                <ArrowRight size={16} className="text-gold-3" />
              </Link>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
