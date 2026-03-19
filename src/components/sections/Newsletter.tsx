'use client';

import { Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const Newsletter = () => {
  return (
    <section className="py-20 bg-app-bg border-t border-gold/10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_75%_at_92%_50%,rgba(197,147,58,0.09)_0%,transparent_65%)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[9.5px] font-bold tracking-[2.5px] uppercase text-gold mb-4">
              Academic Newsletter
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy leading-tight mb-4">
              Join Our Global Research Community
            </h2>
            <p className="text-lg text-navy/70 leading-relaxed">
              Subscribe for updates on international conferences, call for papers, and academic recognition programs.
            </p>
          </div>

          <div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border-1.5 border-teal-2/30 border-primary bg-white text-navy placeholder:text-navy/30 focus:border-gold/50 focus:ring-0 transition-all outline-none"
                />
                <input
                  type="email"
                  placeholder="your@institution.edu"
                  className="w-full px-4 py-3 rounded-xl border-1.5 border-teal-2/30 bg-white text-navy placeholder:text-navy/30 focus:border-gold/50 focus:ring-0 transition-all outline-none"
                />
              </div>
              <div className="flex gap-3">
                <select className="flex-1 px-4 py-3 rounded-xl border-1.5 border-teal-2/30 bg-white text-navy focus:border-gold/50 focus:ring-0 transition-all outline-none cursor-pointer">
                  <option value="">Research field (optional)</option>
                  <option>Science & Technology</option>
                  <option>Social Sciences</option>
                  <option>Management & Business</option>
                </select>
                <Button variant="primary" className="bg-linear-to-r from-primary to-primary-dark">
                  <Send size={16} /> Subscribe
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-navy/50 mt-4">
              <ShieldCheck size={12} /> No spam. Unsubscribe anytime. Your data is protected.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Perk text="Conference & Event Alerts" />
              <Perk text="Call for Papers Updates" />
              <Perk text="Award Nomination Windows" />
              <Perk text="Institutional Rankings" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Perk = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2.5 text-[12.5px] text-navy">
    <div className="w-5 h-5 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
      <CheckCircle2 size={12} />
    </div>
    {text}
  </div>
);
