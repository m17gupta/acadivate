'use client';

import { motion } from 'motion/react';

const DOMAINS = [
  {
    title: 'Science & Technology',
    desc: 'Research in engineering, technology, and applied sciences driving innovation and global impact.',
    image: 'https://picsum.photos/seed/d1/600/320',
    conferences: 12,
    papers: '340+'
  },
  {
    title: 'Social Sciences',
    desc: 'Exploring sociology, economics, and public policy to address global societal challenges.',
    image: 'https://picsum.photos/seed/d2/600/320',
    conferences: 8,
    papers: '220+'
  },
  {
    title: 'Management & Business',
    desc: 'Advancing business strategy, leadership, and innovation through academic research.',
    image: 'https://picsum.photos/seed/d3/600/320',
    conferences: 9,
    papers: '280+'
  },
  {
    title: 'Medicine & Health Sciences',
    desc: 'Clinical research and public health innovation improving global healthcare outcomes.',
    image: 'https://picsum.photos/seed/d4/600/320',
    conferences: 6,
    papers: '180+'
  },
  {
    title: 'Environment & Sustainability',
    desc: 'Research in climate change, sustainability, and green development aligned with global goals.',
    image: 'https://picsum.photos/seed/d5/600/320',
    conferences: 7,
    papers: '210+'
  },
  {
    title: 'Education & Leadership',
    desc: 'Shaping the future through research in education policy, leadership, and institutional development.',
    image: 'https://picsum.photos/seed/d6/600/320',
    conferences: 5,
    papers: '160+'
  }
];

export const Domains = () => {
  return (
    <section className="py-24 bg-app-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-pale border border-gold/30 text-[9.5px] font-bold tracking-[2px] uppercase text-gold mb-4">
            Research Areas
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-4">
            Research Domains & <em className="italic font-serif">Academic Disciplines</em>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            Explore key research areas connecting global scholars, institutions, and innovation.
          </p>
          <div className="w-12 h-0.5 bg-linear-to-r from-gold to-gold-2 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOMAINS.map((domain, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-app-bg border-1.5 border-border-light rounded-3xl overflow-hidden hover:shadow-sh-lg hover:border-border-2 transition-all cursor-pointer"
            >
              <div className="relative h-40 overflow-hidden">
                <img src={domain.image} alt={domain.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-linear-to-t from-navy/65 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gold text-navy text-[9px] font-bold tracking-wider uppercase">
                  Active
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                  {domain.title}
                </h3>
                <p className="text-[13px] text-text-muted leading-relaxed mb-4 line-clamp-2">
                  {domain.desc}
                </p>
                <div className="flex gap-4">
                  <div className="text-[11px] font-bold text-navy flex items-center gap-1.5">
                    <span className="text-gold text-sm font-extrabold">{domain.conferences}</span> Conferences
                  </div>
                  <div className="text-[11px] font-bold text-navy flex items-center gap-1.5">
                    <span className="text-gold text-sm font-extrabold">{domain.papers}</span> Papers
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
