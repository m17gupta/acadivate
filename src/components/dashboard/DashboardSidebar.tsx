'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, LogOut, Settings, Bell, ChevronUp, User, LayoutGrid,
  CreditCard, FileText, CalendarRange, BadgeCheck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { dashboardNavItems } from './dashboardModules';
import { useAppSelector, useAppDispatch } from '@/src/hook/hooks';
import { logout } from '@/src/hook/auth/authSlice';
import { useRouter } from 'next/navigation';

export function DashboardSidebar({ currentPath }: { currentPath: string }) {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (currentPath === href) return true;
    if (href === '/dashboard' || href === '/dashboard/') return currentPath === '/dashboard' || currentPath === '/dashboard/';
    
    // Prevent standard Leads module from highlighting when in the specific Inbox view
    if (href === '/dashboard/leads' && currentPath === '/dashboard/leads/inbox') return false;
    
    return currentPath.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const isAdmin = isMounted && (user?.role === 'admin' || user?.role === 'SUPERADMIN');

  const nonAdminNavItems = [
    { label: 'Events', href: '/dashboard/events', icon: CalendarRange },
    { label: 'Nomination', href: '/dashboard/nominations', icon: BadgeCheck },
    { label: 'Profile', href: '/dashboard/userAccount', icon: User },
    { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { label: 'Files', href: '/dashboard/files', icon: FileText },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-border-light bg-white lg:flex shrink-0 overflow-visible">
      <div className="flex h-full flex-col px-5 py-6 overflow-visible"> {/* Removed overflow-hidden from here */}
        {/* Sidebar Header */}
        <div className="shrink-0 pb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary border border-b text-white shadow-sh-md">
              <span className="text-lg font-extrabold">A</span>
            </div>
            <div>
              <p className="text-lg font-bold text-navy">Acadivate</p>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-text-muted">
                Content Desk
              </p>
            </div>
          </Link>
        </div>
 
        {/* Scrollable Navigation Content */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 overflow-x-visible">
          <div className="space-y-7 pb-4">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-text-subtle">
                Content Modules
              </p>
              <div className="space-y-2">
                {isAdmin && (
                  <>
                    <Link
                      href="/dashboard"
                      className={cn(
                        'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all',
                        currentPath === '/dashboard'
                          ? 'bg-linear-to-r from-primary-deep via-primary-dark to-primary text-white shadow-sh-md'
                          : 'text-navy hover:bg-bg-soft'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <LayoutGrid size={18} className={currentPath === '/dashboard' ? 'text-gold-3' : 'text-primary-dark'} />
                        <span className="text-sm font-semibold">Dashboard</span>
                      </span>
                    </Link>

                    {/* Leads Inbox - Integrated into Content Modules */}
                    <Link
                      href="/dashboard/leads/inbox"
                      className={cn(
                        'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all',
                        currentPath === '/dashboard/leads/inbox'
                          ? 'bg-linear-to-r from-primary-deep via-primary-dark to-primary text-white shadow-sh-md'
                          : 'text-navy hover:bg-bg-soft'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <LayoutGrid size={18} className={currentPath === '/dashboard/leads/inbox' ? 'text-gold-3' : 'text-primary-dark'} />
                        <span className="text-sm font-semibold">Contact Form</span>
                      </span>
                    </Link>
                  </>
                )}

                {(isAdmin ? dashboardNavItems : nonAdminNavItems).map((link) => {
                  const active = isActive(link.href);
 
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={cn(
                        'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all',
                        active
                          ? 'bg-linear-to-r from-primary-deep via-primary-dark to-primary text-white shadow-sh-md'
                          : 'text-navy hover:bg-bg-soft'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <link.icon size={18} className={active ? 'text-gold-3' : 'text-primary-dark'} />
                        <span className="text-sm font-semibold">{link.label}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
 
        {/* Fixed User Profile Section at Bottom with Pop-out Dropdown */}
        <div className="mt-auto shrink-0 pt-6 border-t border-border-light relative overflow-visible">
          {/* Dropdown Menu - Now Floating to the Right */}
          {isProfileOpen && (
            <div className="absolute left-[calc(100%+1rem)] bottom-4 w-64 animate-in fade-in slide-in-from-left-4 zoom-in-95 duration-300 z-[999999]">
              <div className="rounded-[2rem] border border-border-light bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                <div className="mb-2 flex items-center gap-3 rounded-2xl bg-bg-soft p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sh-sm">
                    <User size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-navy">{isMounted && user?.userName ? user.userName : 'Admin User'}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{isMounted && user?.role ? user.role : 'SUPERADMIN'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-bg-soft hover:text-navy"
                  >
                    <Settings size={16} />
                    Account Settings
                  </Link>
                  <div className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-bg-soft hover:text-navy cursor-pointer">
                    <span className="flex items-center gap-3">
                      <Bell size={16} />
                      Notifications
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sh-sm">2</span>
                  </div>
                </div>
                
                <div className="my-2 h-px bg-border-light" />
                
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-crimson transition hover:bg-crimson/5"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border border-border-light bg-bg-soft/60 p-3 transition-all",
              isProfileOpen ? "border-primary bg-white shadow-sh-sm ring-1 ring-primary/10" : "hover:border-primary-dark/20 hover:bg-white hover:shadow-sh-xs"
            )}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-deep text-white shadow-sh-sm">
              <User size={22} />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-bold text-navy">{isMounted && user?.userName ? user.userName : 'Admin'}</p>
              <p className="truncate text-[11px] font-medium text-text-subtle">admin@nestcraft.com</p>
            </div>
            <ChevronUp 
              size={16} 
              className={cn("text-text-subtle transition-transform duration-300", isProfileOpen ? "rotate-90" : "-rotate-90")} 
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
