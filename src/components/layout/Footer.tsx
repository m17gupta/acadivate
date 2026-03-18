'use client';

import * as React from 'react';
import Link from 'next/link';
import { GraduationCap, Linkedin, Twitter, Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const Footer = () => {
  return (
    <footer className="bg-linear-to-r from-primary-deep via-primary-dark to-primary pt-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          <div>
              <Link href="/" className="flex items-center gap-3 shrink-0 mb-4 bg-white w-fit rounded-lg px-4 py-2">
          <div>
            <img src="/assets/Image/Acadivate logo-transpernt.png" width={150} height={120} alt="Logo" />
          </div>
        </Link>
            <p className="text-sm text-white/80 leading-relaxed mb-8 max-w-[255px]">
              Advancing research excellence, innovation, and interdisciplinary academic collaboration globally since 2022.
            </p>
            <div className="flex gap-2.5">
              <SocialIcon icon={<Linkedin size={14} />} />
              <SocialIcon icon={<Twitter size={14} />} />
              <SocialIcon icon={<Facebook size={14} />} />
              <SocialIcon icon={<Youtube size={14} />} />
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-white mb-6 flex items-center gap-2 after:h-px after:flex-1 after:bg-white/10">
              Navigation
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="space-y-2">
                <FooterLink href="/">Home</FooterLink>
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/events">Events</FooterLink>
                <FooterLink href="#">Rankings</FooterLink>
              </div>
              <div className="space-y-2">
                <FooterLink href="#">Publications</FooterLink>
                <FooterLink href="#">Blogs</FooterLink>
                <FooterLink href="#">Institutions</FooterLink>
                <FooterLink href="#">FAQ</FooterLink>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-white mb-6 flex items-center gap-2 after:h-px after:flex-1 after:bg-white/10">
              Services
            </div>
            <div className="space-y-2">
              <FooterLink href="/awards">Excellence Awards 2026</FooterLink>
              <FooterLink href="#">Academic Rankings</FooterLink>
              <FooterLink href="#">Conference Hosting</FooterLink>
              <FooterLink href="#">Scopus Publications</FooterLink>
              <FooterLink href="#">Research Partnerships</FooterLink>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-white mb-6 flex items-center gap-2 after:h-px after:flex-1 after:bg-white/10">
              Contact
            </div>
            <div className="space-y-4">
              <ContactItem icon={<Phone size={14} />} label="Phone" value="+91 99999 99999" />
              <ContactItem icon={<Mail size={14} />} label="Email" value="info@acadivate.org" />
              <ContactItem icon={<MapPin size={14} />} label="HQ" value="S02, A-28, Sector 4, Noida, India" />
            </div>
          </div>
        </div>

        <div className="py-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[12.5px] font-light text-white/60">
            © 2026 <a href="#" className="hover:text-gold transition-colors">Acadivate Research & Innovation Foundation</a>. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/60 hover:text-gold-2 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-white/60 hover:text-gold-2 transition-colors">Terms of Use</a>
            <a href="#" className="text-xs text-white/60 hover:text-gold-2 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-gold hover:border-gold hover:text-navy transition-all">
    {icon}
  </a>
);

const FooterLink = ({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) => (
  <Link
    href={href}
    className={cn(
      'block text-[13.5px] font-light transition-all hover:text-gold-2 hover:pl-1',
      active ? 'text-gold font-semibold' : 'text-white/80'
    )}
  >
    {children}
  </Link>
);

const ContactItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/5 flex items-center justify-center text-white shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-[9.5px] font-bold text-white uppercase tracking-wider">{label}</div>
      <div className="text-[13px] text-white/60 font-light">{value}</div>
    </div>
  </div>
);
