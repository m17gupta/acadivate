'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Menu, X, Award, Users, Calendar, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/hook/store';
import { logout } from '@/src/hook/auth/authSlice';

export const Header = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobOpen, setIsMobOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const dispatch=useDispatch()
const {user,token,isAuthenticated}=useSelector((state:RootState)=>state.auth);

  React.useEffect(() => {
    setIsMobOpen(false);
  }, [pathname]);


  const handleLogout=()=>{
       dispatch(logout())
       router.push("/")
  }
  return (
    <header data-annotate-id="site-header" className={cn(
      'sticky top-0 z-50 transition-all duration-300 border-b border-white/10',
      isScrolled
        ? 'bg-white shadow-sh-xl'
        : 'bg-white'
    )}>
      <div className="max-w-7xl mx-auto px-6 h-[76px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div>
            <img src="/assets/Image/Acadivate logo-transpernt.png" width={150} height={120} alt="Logo" />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <NavLink href="/" active={pathname === '/'}>Home</NavLink>
          <NavDropdown label="Events">
            <DropdownItem href="/events/international-conferences" icon={<Users size={14} />} label="International Conferences" />
            <DropdownItem href="/events/upcoming-events" icon={<Calendar size={14} />} label="Upcoming Events" />
            {/* <DropdownItem href="/events/research-forums" icon={<BookOpen size={14} />} label="Research Forums" />
            <DropdownItem href="/events/workshops-fdp" icon={<GraduationCap size={14} />} label="Workshops & FDPs" /> */}
          </NavDropdown>
          <MegaMenu />
          <NavDropdown label="Rankings">
            <DropdownItem href="#" icon={<Trophy size={14} />} label="Top Rankings" />
            <DropdownItem href="#" icon={<Award size={14} />} label="Apply for Ranking" />
          </NavDropdown>
          <NavLink href="/about" active={pathname === '/about'}>About</NavLink>
          <NavLink href="/contact" active={pathname === '/contact'}>Contact</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
         {  !isAuthenticated? <Button variant="ghost" className="hidden xl:flex text-black hover:bg-white/10"
              onClick={() => router.push('/auth/signin')}
            >Sign In</Button>:<Button variant="ghost" className="hidden xl:flex text-black hover:bg-white/10"
              onClick={handleLogout}
            >Sign out</Button>}
             <Button
              variant="primary"
              onClick={() => router.push('/registration-form')}
            >
              Get Started
            </Button>
          </div>

          <button
            className="lg:hidden p-2 text-black hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMobOpen(!isMobOpen)}
            aria-label="Toggle menu"
          >
            {isMobOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={cn(
        'fixed inset-0 top-[76px] bg-linear-to-b from-primary-deep to-primary-dark z-40 lg:hidden transition-transform duration-300 ease-soft',
        isMobOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="p-6 flex flex-col gap-2 h-full overflow-y-auto">
          <MobileNavLink href="/">Home</MobileNavLink>
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white/40 mt-4">Events</div>
          <MobileNavLink href="/events/international-conferences">International Conferences</MobileNavLink>
          <MobileNavLink href="/events/upcoming-events">Upcoming Events</MobileNavLink>
          {/* <MobileNavLink href="/events/research-forums">Research Forums</MobileNavLink>
          <MobileNavLink href="/events/workshops-fdp">Workshops & FDPs</MobileNavLink> */}

          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white/40 mt-4">More</div>
          <MobileNavLink href="/awards">Awards</MobileNavLink>
          <MobileNavLink href="#">Rankings</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/contact">Contact</MobileNavLink>
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3 pb-10">
            <Button variant="ghost" className="w-full text-white hover:bg-white/10">Sign In</Button>
            <Button variant="ghost" className="w-full text-white hover:bg-white/10">Sign Up</Button>
            <Button variant="gold" className="w-full">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) => (
  <Link
    href={href}
    className={cn(
      'px-3 py-2 rounded-lg text-[13.5px] font-semibold transition-all',
      active ? 'text-gold bg-gold/10' : 'text-black hover:text-gold hover:bg-white/5'
    )}
  >
    {children}
  </Link>
);

const NavDropdown = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="relative group">
    <button className="px-3 py-2 rounded-lg text-[13.5px] font-semibold text-black hover:text-gold hover:bg-white/5 flex items-center gap-1 transition-all">
      {label}
      <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
    </button>
    <div className="absolute top-full left-0 pt-2 w-64 opacity-0 translate-y-[-10px] pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-soft z-50">
      <div className="bg-app-bg border border-black/5 rounded-[1.5rem] shadow-sh-xl p-2">
        <div className="flex flex-col gap-1">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const DropdownItem = ({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) => (
  <Link
    href={href}
    className="flex items-center gap-4 px-3 py-3 rounded-2xl text-[14px] font-bold text-navy hover:bg-bg-soft hover:text-primary transition-all duration-200 group/item"
  >
    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover/item:bg-primary/10 transition-colors">
      {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 18 })}
    </div>
    <span className="leading-tight">{label}</span>
  </Link>
);

const MegaMenu = () => (
  <div className="relative group">
    <Link href="/awards" className="px-3 py-2 rounded-lg text-[13.5px] font-semibold text-black hover:text-gold hover:bg-white/5 flex items-center gap-1 transition-all">
      Awards
      <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
    </Link>
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[780px] opacity-0 translate-y-[-10px] pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-soft z-50">
      <div className="bg-app-bg border border-black/5 rounded-[1.5rem] shadow-sh-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr]">
          <div className="p-6">
            <div className="text-[9.5px] font-bold tracking-[2px] uppercase text-text-muted mb-4 flex items-center gap-2 after:h-px after:flex-1 after:bg-border-light">
              Featured
            </div>
            <div className="rounded-xl overflow-hidden relative group/feat cursor-pointer">
              <img src="https://picsum.photos/seed/awards-hero/500/260" alt="Awards" className="w-full h-32 object-cover group-hover/feat:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-linear-to-t from-primary-deep/85 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[9px] font-bold tracking-[1.5px] uppercase px-2 py-0.5 rounded-full bg-gold text-white mb-2 inline-block">
                  Nominations Open
                </span>
                <div className="text-[13.5px] font-semibold text-white leading-tight">
                  Academic Excellence Awards 2026 — Nominate Now
                </div>
              </div>
            </div>
          </div>
          <div className="bg-border-light" />
          <div className="p-6">
            <div className="text-[9.5px] font-bold tracking-[2px] uppercase text-text-muted mb-4 flex items-center gap-2 after:h-px after:flex-1 after:bg-border-light">
              Categories
            </div>
            <div className="space-y-1">
              <MegaLink icon={<Award size={14} />} title="Excellence in Research" sub="Original research contributions" />
              <MegaLink icon={<GraduationCap size={14} />} title="Innovation Leadership" sub="Academic innovation" />
              <MegaLink icon={<Trophy size={14} />} title="Lifetime Achievement" sub="Career-long impact" />
            </div>
          </div>
          <div className="bg-border-light" />
          <div className="p-6">
            <div className="text-[9.5px] font-bold tracking-[2px] uppercase text-text-muted mb-4 flex items-center gap-2 after:h-px after:flex-1 after:bg-border-light">
              Past Winners
            </div>
            <div className="space-y-3">
              <WinnerItem name="Prof. Rashida Ahmed" year="2025" />
              <WinnerItem name="Dr. Sanjay Nair" year="2025" />
              <WinnerItem name="Dr. Lin Wei" year="2025" />
            </div>
          </div>
        </div>
        <div className="bg-bg-light border-t border-border-light p-4 flex items-center justify-between">
          <Link href="/awards" className="text-[12.5px] font-semibold text-navy hover:text-gold flex items-center gap-2 transition-colors">
            <Award size={14} /> All Award Categories
          </Link>
          <Link href="/awards#nominate" className="text-[12.5px] font-bold text-gold flex items-center gap-2 transition-colors">
            Nominate Now — 2026 <ChevronDown size={14} className="-rotate-90" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const MegaLink = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
  <Link href="#" className="flex items-center gap-4 p-3 rounded-2xl border border-transparent hover:bg-bg-soft hover:border-black/5 transition-all duration-200 group/mlink">
    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover/mlink:bg-primary/10 transition-colors">
      {/* {React.cloneElement(icon as React.ReactElement, { size: 18 })} */}
    </div>
    <div>
      <div className="text-[13.5px] font-bold text-navy leading-tight">{title}</div>
      <div className="text-[11px] font-medium text-text-muted mt-0.5">{sub}</div>
    </div>
  </Link>
);

const WinnerItem = ({ name, year }: { name: string; year: string }) => (
  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-light transition-all cursor-pointer">
    <div className="w-9 h-9 rounded-lg bg-gold-pale border-1.5 border-gold/30 flex items-center justify-center text-gold shrink-0">
      <Trophy size={14} />
    </div>
    <div>
      <div className="text-[12.5px] font-semibold text-navy">{name}</div>
      <div className="text-[11px] text-text-muted">{year} Excellence Award</div>
    </div>
  </div>
);

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="flex items-center justify-between p-3 rounded-xl text-[15px] font-semibold text-white/90 hover:bg-white/10 transition-all">
    {children}
    <ChevronDown size={16} className="-rotate-90 text-white/40" />
  </Link>
);
