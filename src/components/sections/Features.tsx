'use client';

import { Award, Globe, Lightbulb, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

const FEATURES = [
  {
    icon: <Award className="text-gold" size={24} />,
    color: 'bg-gold-pale',
    num: '01 / Conference',
    title: 'International Research Conferences',
    desc: 'Join global conferences with Scopus and WoS indexed proceedings for research presentation and publication.'
  },
  {
    icon: <Globe className="text-teal" size={24} />,
    color: 'bg-teal-2',
    num: '02 / Network',
    title: 'Global Academic Network',
    desc: 'Connect with researchers, scholars, and universities worldwide to collaborate and share knowledge.'
  },
  {
    icon: <Lightbulb className="text-crimson" size={24} />,
    color: 'bg-crimson-2',
    num: '03 / Innovation',
    title: 'Research Awards & Recognition',
    desc: 'Recognizing research excellence through transparent and peer-reviewed evaluation systems.'
  },
  {
    icon: <BookOpen className="text-sage" size={24} />,
    color: 'bg-sage-2',
    num: '04 / Journal',
    title: 'Peer-Reviewed Journals',
    desc: 'Publish your research in high-quality journals with global visibility and academic credibility.'
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-app-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-pale border border-gold/30 text-[9.5px] font-bold tracking-[2px] uppercase text-gold mb-4">
            Why Acadivate
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-4">
            Why Choose <em className="italic font-serif">Acadivate</em>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            We bring together academicians, researchers, industry experts, and policy thinkers to address global challenges through evidence-based research.
          </p>
          <div className="w-12 h-0.5 bg-linear-to-r from-gold to-gold-2 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group hover:bg-white relative bg-app-bg border-1.5 border-border-light rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-sh-lg hover:border-border-2"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feat.color}`}>
                {feat.icon}
              </div>
              <div className="text-[9px] font-bold tracking-[2px] uppercase text-text-subtle mb-2">
                {feat.num}
              </div>
              <h3 className="text-xl font-bold text-navy mb-3 leading-tight">
                {feat.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {feat.desc}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-gold to-gold-2 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
