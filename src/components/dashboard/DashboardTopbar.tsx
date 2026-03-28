'use client';

import { Bell, Globe2, MoonStar, Search, Settings2, ShoppingBag } from 'lucide-react';

export function DashboardTopbar({ searchPlaceholder }: { searchPlaceholder: string }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border-light bg-white/80 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-light bg-bg-soft text-navy">
          <Search size={18} />
        </div>
        <label className="relative block sm:min-w-[280px]">
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-2xl border border-border-light bg-bg-soft px-4 pl-4 text-sm text-navy outline-none transition placeholder:text-text-muted focus:border-primary"
          />
        </label>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {[MoonStar, Globe2, ShoppingBag, Bell, Settings2].map((Icon) => (
          <button
            key={Icon.displayName ?? Icon.name}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-light bg-white text-navy transition hover:border-primary-dark/30 hover:bg-bg-soft"
          >
            <Icon size={17} />
          </button>
        ))}
        <div className="ml-1 flex items-center gap-3 rounded-2xl border border-border-light bg-white px-3 py-2 shadow-sh-xs">
          <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-gold via-gold-2 to-primary text-center text-sm font-bold leading-10 text-white">
            CM
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-navy">Cameron</p>
            <p className="text-xs text-text-muted">Operations lead</p>
          </div>
        </div>
      </div>
    </div>
  );
}
