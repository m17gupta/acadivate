'use client';

import { Phone, Mail } from 'lucide-react';

export const TopBar = () => {
  return (
    <div className="bg-primary py-2 border-b border-white/5 hidden sm:block">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[11.5px] font-medium text-white">
            <Phone size={12} />
            <a href="tel:+919999999999" className="hover:text-white transition-colors">+91 99999 99999</a>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-2 text-[11.5px] font-medium text-white">
            <Mail size={12} />
            <a href="mailto:awards@acadivate.org" className="hover:text-white transition-colors">awards@acadivate.org</a>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full border border-white/30 text-white uppercase tracking-wider animate-pulse">
            2026 Awards Open
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://wa.me/919999999999" target="_blank" className="text-[11.5px] font-medium text-white hover:text-white transition-colors">
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
