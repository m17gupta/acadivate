'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/Button';
import Link from 'next/link';

const SLIDES = [
  {
    tag: 'Global Research Hub · 2026',
    title: 'Advancing Academic Research & Innovation',
    desc: 'Connecting scholars and institutions to foster research breakthroughs and strategic global collaborations through innovation.',
    image: 'https://picsum.photos/seed/hero1/1600/900',
    bc: 'Research & Innovation'
  },
  {
    tag: 'Call for Papers · ICASD 2026',
    title: 'International Conference on Sustainable Development',
    desc: 'Submit your research to a premier global platform focused on pioneering solutions for a sustainable and innovative future.',
    image: 'https://picsum.photos/seed/hero2/1600/900',
    bc: 'ICASD 2026'
  },
  {
    tag: 'Scholarly Awards · 2026',
    title: 'Celebrating Excellence in Research Innovation',
    desc: 'Recognizing outstanding academic impact through peer-reviewed awards and prestigious institutional rankings globally.',
    image: 'https://picsum.photos/seed/hero3/1600/900',
    bc: 'Awards & Rankings'
  }
];

export const Hero = () => {
  const [current, setCurrent] = React.useState(0);

  const next = React.useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = React.useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-[85vh]  overflow-hidden bg-navy">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 10, ease: 'linear' }}
            src={SLIDES[current].image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy/90 via-navy/50 to-navy/20" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-gold-2">
                    {SLIDES[current].tag}
                  </span>
                </div>
                <h1 className="text-4xl md:text-4xl lg:text-6xl font-extrabold text-white leading-[1.05] mb-6">
                  {SLIDES[current].title}
                </h1>
                <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-lg">
                  {SLIDES[current].desc}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/nomination-form">
                    <Button variant="gold" size="lg">
                      Nominate Now <ArrowRight size={18} />
                    </Button>
                  </Link>
                  {/* <Button variant="gold" size="lg">
                    Nominate Now <ArrowRight size={18} />
                  </Button> */}
                  <Button variant="outline" size="lg">
                    View Conferences
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <div className="flex gap-2.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                current === i ? 'w-11 bg-gold' : 'w-7 bg-white/30'
              )}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 w-full px-6 flex justify-between pointer-events-none z-20 hidden md:flex">
        <button
          onClick={prev}
          className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-gold hover:border-gold hover:text-navy transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-gold hover:border-gold hover:text-navy transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 z-20 hidden sm:flex">
        <div className="flex items-center gap-2 text-xs font-medium text-white/30">
          <a href="#" className="hover:text-gold-2 transition-colors">Home</a>
          <ChevronRight size={12} />
          <span className="text-gold font-semibold">{SLIDES[current].bc}</span>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 z-20 text-[11px] font-bold text-white/40 tracking-widest hidden lg:block">
        <span className="text-gold-2 text-sm">0{current + 1}</span> / 0{SLIDES.length}
      </div>
    </section>
  );
};
