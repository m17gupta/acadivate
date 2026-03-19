'use client';

import * as React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/Button';

const TABS = [
  {
    id: 'mission',
    label: 'Mission',
    icon: '🎯',
    title: 'Our Mission',
    desc: 'To advance global research, innovation, and academic collaboration by connecting scholars, institutions, and industry.',
    items: [
      'Promoting high-quality research',
      'Supporting publication opportunities',
      'Building academic collaborations',
      'Hosting global conferences'
    ]
  },
  {
    id: 'vision',
    label: 'Vision',
    icon: '🔭',
    title: 'Our Vision',
    desc: 'To become a trusted global academic platform connecting researchers and institutions worldwide.',
    items: [
      'Global academic recognition platform',
      'Expanding international network',
      'Indexed publication ecosystem',
      'Recognizing research excellence'
    ]
  },
  {
    id: 'goal',
    label: 'Goal',
    icon: '🏆',
    title: 'Our Goal',
    desc: 'To deliver impactful conferences, publications, and research recognition programs globally.',
    items: [
      'Organizing global conferences',
      'Launching research journals',
      'Expanding award programs',
      'Supporting institutions digitally'
    ]
  },
  {
    id: 'partners',
    label: 'Partners',
    icon: '🤝',
    title: 'Our Partners',
    desc: 'Collaborating with universities, institutions, and global academic organizations.',
    items: [
      'University partnerships',
      'Research collaborations',
      'Journal associations',
      'Global presence'
    ]
  }
];

export const About = () => {
  const [activeTab, setActiveTab] = React.useState('mission');
  const activeTabData = TABS.find(t => t.id === activeTab)!;

  return (
    <section id="foundation" className="py-24 bg-app-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-sh-xl">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80"
                alt="Acadivate Foundation"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy/40 to-transparent" />
            </div>

            <div className="absolute -bottom-6 -right-6 bg-gold rounded-3xl p-6 shadow-sh-gold max-w-[200px]">
              <div className="text-4xl font-extrabold text-navy leading-none mb-2">
                25<span className="text-xl opacity-60 ml-1">+</span>
              </div>
              <div className="text-[11px] font-bold tracking-wider uppercase text-navy/70 leading-tight">
                International Conferences Organized
              </div>
            </div>

            <div className="absolute top-6 -left-6 bg-navy rounded-2xl p-4 shadow-sh-lg border border-white/10">
              <div className="text-gold text-[10px] font-bold tracking-widest uppercase mb-1">Est.</div>
              <div className="text-2xl font-extrabold text-white">2022</div>
            </div>

            <div className="flex gap-3 mt-6">
              {[
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=70',
                'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=300&q=70',
                'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=70'
              ].map((img, i) => (
                <div key={i} className="flex-1 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-sh-sm hover:scale-105 transition-transform cursor-pointer">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[9.5px] font-bold tracking-[3px] uppercase text-gold mb-4">
              Foundation
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-8">
              Acadivate Research<br />& Innovation
            </h2>

            <div className="flex flex-wrap gap-2 mb-10">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-6 py-2.5 rounded-full text-sm font-bold border-1.5 transition-all duration-300',
                    activeTab === tab.id
                      ? 'bg-linear-to-br from-navy to-navy-md text-white border-navy shadow-sh-md'
                      : 'border-border-light text-text-muted hover:border-navy hover:text-navy'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="flex items-start gap-5 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-navy/5 flex items-center justify-center text-3xl shrink-0">
                      {activeTabData.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-navy mb-3">{activeTabData.title}</h3>
                      <p className="text-text-muted leading-relaxed">
                        {activeTabData.desc}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-10">
                    {activeTabData.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-app-bg border border-border-light hover:border-gold/30 transition-colors group">
                        <div className="w-6 h-6 rounded-full bg-gold-pale flex items-center justify-center text-gold shrink-0 group-hover:bg-gold group-hover:text-white transition-colors">
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="text-[13.5px] font-medium text-navy/80">{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href="/about">
                    <Button variant="primary" size="md">
                      Learn More <ArrowRight size={18} />
                    </Button>
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

