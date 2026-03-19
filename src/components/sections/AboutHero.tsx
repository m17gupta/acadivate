'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Globe, Award, GraduationCap, Star } from 'lucide-react';
import { Button } from '../ui/Button';

export const AboutHero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary-deep via-primary-dark to-primary py-20 lg:py-24">
      {/* Decorative elements */}
      <div className="absolute -right-48 -bottom-48 w-[700px] h-[700px] rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute -right-24 -bottom-24 w-[500px] h-[500px] rounded-full border border-white/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[2.5px] text-gold-lt">About Acadivate</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8">
              Advancing Research,<br />
              Innovation & <span className="shim">Global Academic</span><br />
              Excellence
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-lg">
              Acadivate Research and Innovation Foundation (ARIF) is a professionally driven academic organisation committed to advancing research excellence, innovation, capacity building, and global academic collaboration.
            </p>

            {/* Award badges */}
            <div className="flex flex-wrap gap-4 mb-10">
              <BadgeIcon icon={<Award size={20} />} label="Research Excellence" />
              <BadgeIcon icon={<Globe size={20} />} label="Global Innovation" />
              <BadgeIcon icon={<GraduationCap size={20} />} label="Academic Excellence" />
              <BadgeIcon icon={<Star size={20} />} label="Impact Award" />
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="gold" size="lg">
                Explore Our Work <ArrowRight size={18} />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Partner With Us
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard value="25" label="Conferences" />
            <StatCard value="12" label="Countries" />
            <StatCard value="500" label="Delegates" />
            <StatCard value="33" label="Annual Awards" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="col-span-2 p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white/80">Global Academic Impact</span>
                <span className="text-gold font-bold">82%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '82%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-gold to-gold-lt"
                />
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
                <span>Research</span>
                <span>Publications</span>
                <span>Conferences</span>
                <span>Awards</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BadgeIcon = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="group relative">
    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-gold/20 transition-all cursor-pointer">
      {icon}
    </div>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 rounded bg-navy text-[10px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {label}
    </div>
  </div>
);

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md text-center hover:bg-white/15 transition-colors"
  >
    <div className="text-4xl font-extrabold text-white mb-1">
      {value}<span className="text-gold ml-0.5">+</span>
    </div>
    <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">{label}</div>
  </motion.div>
);
