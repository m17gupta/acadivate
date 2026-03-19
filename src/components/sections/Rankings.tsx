'use client';

import { Trophy, Award, ArrowRight, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import Link from 'next/link';

const RANKINGS = [
  { pos: 1, name: 'Indian Institute of Technology Delhi', location: 'New Delhi, India', score: 94.8 },
  { pos: 2, name: 'Indian Institute of Science Bangalore', location: 'Bengaluru, India', score: 93.2 },
  { pos: 3, name: 'IIT Bombay', location: 'Mumbai, India', score: 91.5 },
  { pos: 4, name: 'Manipal University Malaysia', location: 'Nilai, Malaysia', score: 89.7 },
  { pos: 5, name: 'Abu Dhabi University', location: 'Abu Dhabi, UAE', score: 87.3 },
  { pos: 6, name: 'University of Hyderabad', location: 'Hyderabad, India', score: 85.9 }
];

export const Rankings = () => {
  return (
    <section className="py-24 bg-app-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-pale border border-gold/30 text-[9.5px] font-bold tracking-[2px] uppercase text-gold mb-4">
              Academic Rankings
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6">
              India Institutional <em className="italic font-serif">Research Rankings 2026</em>
            </h2>
            <p className="text-lg text-text-muted leading-relaxed mb-8">
              A transparent and data-driven academic ranking system evaluating institutions based on research performance, innovation, and global impact.
            </p>

            <div className="space-y-4 mb-10">
              <RankingFeature text="Data-driven research evaluation framework" />
              <RankingFeature text="Transparent and peer-reviewed methodology" />
              <RankingFeature text="Global recognition for top institutions" />
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/rankings">
                <Button variant="gold">
                  View Rankings <ArrowRight size={16} />
                </Button>
              </Link>

              <Link href="/apply-for-ranking">
                <Button variant="ghost">
                  Submit for Ranking
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-app-bg border-1.5 border-border-light rounded-3xl overflow-hidden shadow-sh-md"
          >
            <div className="grid grid-cols-[40px_1fr_auto] gap-4 p-4 bg-primary text-[9.5px] font-bold tracking-widest uppercase text-white/40">
              <div>#</div>
              <div>Institution</div>
              <div className="text-right">Score</div>
            </div>
            <div className="divide-y divide-border-light">
              {RANKINGS.map((rank) => (
                <div key={rank.pos} className="grid grid-cols-[40px_1fr_auto] gap-4 p-5 items-center hover:bg-navy/5 transition-colors cursor-pointer group">
                  <div className={`text-sm font-bold ${rank.pos <= 2 ? 'text-gold' : 'text-navy'}`}>
                    {rank.pos}
                  </div>
                  <div>
                    <div className="text-[13.5px] font-bold text-navy group-hover:text-gold transition-colors">{rank.name}</div>
                    <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-text-muted mt-1">
                      <Globe size={10} /> {rank.location}
                    </div>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="text-sm font-bold text-navy">{rank.score}</div>
                    <div className="h-1 bg-bg-2 rounded-full mt-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${rank.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-linear-to-r from-gold to-gold-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const RankingFeature = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3 text-[14.5px] text-navy">
    <div className="w-5 h-5 rounded-full bg-gold-pale border border-gold/30 flex items-center justify-center text-gold shrink-0 mt-0.5">
      <Award size={12} strokeWidth={3} />
    </div>
    {text}
  </div>
);
