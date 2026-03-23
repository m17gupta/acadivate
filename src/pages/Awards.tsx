'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Award, Star, Trophy, Users, Calendar, ArrowRight, Download, Send, CheckCircle2, HelpCircle, Mail, Phone, MapPin, Search, ShoppingBag, ChevronDown, Quote, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

const CATEGORIES = [
  {
    id: '01',
    title: 'Excellence in Research',
    desc: 'Original, high-impact research that advances human knowledge and addresses pressing global challenges through rigorous, evidence-based inquiry.',
    tags: ['Sciences', 'Humanities', 'Technology', 'Social Sciences'],
    count: '12 sub-categories',
    color: 'gold'
  },
  {
    id: '02',
    title: 'Innovation Leadership',
    desc: 'Academics and institutions who push disciplinary boundaries through creative, interdisciplinary, and transformative approaches to knowledge-creation.',
    tags: ['EdTech', 'AI Research', 'Policy'],
    count: '8 sub-categories',
    color: 'teal'
  },
  {
    id: '03',
    title: 'Lifetime Achievement',
    desc: 'The highest Acadivate honour — bestowed upon scholars whose decades of work have fundamentally shaped their field and left an enduring global legacy.',
    tags: ['Cross-Discipline', 'Peer-Nominated'],
    count: 'Jury Nominated',
    color: 'wine'
  },
  {
    id: '04',
    title: 'Young Researcher Award',
    desc: 'Recognising emerging academic talent — scholars under 35 who are already making significant, peer-acknowledged contributions to their disciplines.',
    tags: ['Early Career', 'PhD Scholars', 'Postdoc'],
    count: 'Under 35',
    color: 'navy'
  },
  {
    id: '05',
    title: 'Best Paper Award',
    desc: 'Awarded at each Acadivate conference to the paper demonstrating the highest quality of original research, methodological rigor, and scholarly impact.',
    tags: ['ICASD 2026', 'ICGSD', 'GCSD'],
    count: '5 sub-categories',
    color: 'navy'
  },
  {
    id: '06',
    title: 'Institutional Excellence',
    desc: 'Honouring universities, research institutes, and academic bodies that have demonstrated exceptional commitment to research quality and global engagement.',
    tags: ['Universities', 'Research Institutes'],
    count: '6 sub-categories',
    color: 'primary'
  }
];

const JURY = [
  {
    name: 'Prof. Anand Krishnan',
    title: 'Jury Chair, Research Excellence',
    inst: 'IIT Delhi · 28 years',
    country: 'India',
    image: 'https://picsum.photos/seed/j1/400/300'
  },
  {
    name: 'Prof. Nurul Ain Harun',
    title: 'Innovation & Technology Panel',
    inst: 'Manipal International University',
    country: 'Malaysia',
    image: 'https://picsum.photos/seed/j2/400/300'
  },
  {
    name: 'Dr. Mohammed Al-Rashidi',
    title: 'Institutional Excellence Panel',
    inst: 'Abu Dhabi University',
    country: 'UAE',
    image: 'https://picsum.photos/seed/j3/400/300'
  },
  {
    name: 'Prof. Claire Beaumont',
    title: 'Social Sciences & Policy Panel',
    inst: 'London School of Economics',
    country: 'UK',
    image: 'https://picsum.photos/seed/j4/400/300'
  }
];

const WINNERS = {
  y2025: [
    { name: 'Prof. Rashida Ahmed', inst: 'University of Kuala Lumpur', award: 'Excellence in Research', cat: 'Research', image: 'https://picsum.photos/seed/w1/400/300' },
    { name: 'Dr. Sanjay Nair', inst: 'IIT Bombay, India', award: 'Innovation Leadership', cat: 'Innovation', image: 'https://picsum.photos/seed/w2/400/300' },
    { name: 'Dr. Lin Wei', inst: 'Tsinghua University', award: 'Young Researcher Award', cat: 'Young Scholar', image: 'https://picsum.photos/seed/w3/400/300' },
    { name: 'Dr. Fatima Al-Rashid', inst: 'King Abdulaziz University', award: 'Best Paper — ICGSD 2025', cat: 'Best Paper', image: 'https://picsum.photos/seed/w4/400/300' }
  ],
  y2024: [
    { name: 'Prof. Maria Souza', inst: 'University of São Paulo', award: 'Lifetime Achievement', cat: 'Lifetime', image: 'https://picsum.photos/seed/w5/400/300' },
    { name: 'Prof. James Okafor', inst: 'University of Lagos', award: 'Excellence in Research', cat: 'Research', image: 'https://picsum.photos/seed/w6/400/300' },
    { name: 'Dr. Priya Anand', inst: 'BITS Pilani', award: 'Young Researcher 2024', cat: 'Young', image: 'https://picsum.photos/seed/w7/400/300' },
    { name: 'Manipal Intl. University', inst: 'Malaysia', award: 'Institutional Excellence', cat: 'Institution', image: 'https://picsum.photos/seed/w8/400/300' }
  ],
  y2023: [
    { name: 'Prof. Aiko Tanaka', inst: 'Osaka University, Japan', award: 'Inaugural Research Award', cat: 'Inaugural', image: 'https://picsum.photos/seed/w9/400/300' },
    { name: 'Dr. Ahmed Hassan', inst: 'Cairo University, Egypt', award: 'Innovation Award 2023', cat: 'Innovation', image: 'https://picsum.photos/seed/w10/400/300' },
    { name: 'Dr. Kenji Yamamoto', inst: 'Tokyo University', award: 'Young Researcher 2023', cat: 'Young', image: 'https://picsum.photos/seed/w11/400/300' },
    { name: 'Abu Dhabi University', inst: 'UAE', award: 'Institutional Excellence 2023', cat: 'Institution', image: 'https://picsum.photos/seed/w12/400/300' }
  ]
};

export const Awards = () => {
  const [activeYear, setActiveYear] = React.useState<'y2025' | 'y2024' | 'y2023'>('y2025');
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <div className="bg-app-bg min-h-screen font-sans">
      {/* Hero Section */}
      <section data-annotate-id="awards-hero-section" className="relative min-h-[90vh] bg-app-bg flex items-center overflow-hidden py-20">
        <div className="absolute inset-0 opacity-5">
          <img src="https://picsum.photos/seed/heroawards/1920/1080" alt="Hero" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-linear-to-b from-app-bg via-app-bg/80 to-app-bg" />
        </div>

        {/* Art Deco Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(18,167,207,.1) 1px,transparent 1px), linear-gradient(90deg,rgba(18,167,207,.1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-[1fr_450px] gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <div className="w-6 h-px bg-primary" />
                <span className="text-[10px] font-bold tracking-[3px] uppercase text-primary">Acadivate Excellence Awards · 2026</span>
              </div>

              <h1 className="font-serif text-5xl md:text-7xl font-bold text-navy leading-[1.05] mb-6">
                Honour the<br />
                <span className="italic shim">Extraordinary.</span>
              </h1>

              <p className="font-prose text-lg text-text-muted leading-relaxed max-w-xl mb-10">
                The Acadivate Excellence Awards celebrate the scholars, researchers, and institutions whose work is rewriting the rules of global academia — across 33 categories, 15+ countries, and every discipline.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                {/* Submit Nomination Link */}
                <Link href="/nomination-form">
                  <Button variant="gold" size="lg" className="rounded-xl px-8 py-4 text-base shadow-sh-gold hover:shadow-sh-gold-lg">
                    <Download size={18} className="mr-2" /> Submit Nomination
                  </Button>
                </Link>

                {/* Explore Categories Link */}
                <Link href="/awards#categories">
                  <Button variant="outline" size="lg" className="rounded-xl px-8 py-4 text-base text-navy border-navy/20 hover:bg-navy/5 backdrop-blur-md">
                    <Award size={18} className="mr-2" /> Explore Categories
                  </Button>
                </Link>
              </div>
              {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-primary/10 border border-primary/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <StatItem label="Categories" value="33" plus />
                <StatItem label="Laureates" value="500" plus />
                <StatItem label="Countries" value="15" plus />
                <StatItem label="Years" value="4" />
              </div> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex flex-col items-center gap-10"
            >
              <div className="relative w-72 h-72 animate-float">
                {/* Medallion */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-primary/10" />
                <div className="absolute inset-8 rounded-full bg-app-bg shadow-[0_0_60px_rgba(18,167,207,0.15)] flex flex-col items-center justify-center gap-2">
                  <Award size={52} className="text-primary animate-pulse-slow" />
                  <div className="text-[10px] font-bold tracking-[3px] uppercase text-primary/70">Acadivate · 2026</div>
                  <div className="font-serif text-lg font-semibold text-navy text-center leading-tight">Excellence<br />Awards</div>
                </div>
                {/* Scan Line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary/30 to-transparent animate-[scan_3s_ease-in-out_infinite]" />
              </div>

              {/* <div className="grid grid-cols-2 gap-3 w-full">
                <MetricCard label="Deadline" value="31" sub="Mar" />
                <MetricCard label="Ceremony" value="Sep" sub="'26" />
                <MetricCard label="Jury Experts" value="30" plus />
                <MetricCard label="Institutions" value="80" plus />
              </div> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section data-annotate-id="awards-categories-section" className="py-24 bg-app-bg" id="categories">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-[10px] font-bold tracking-[2px] uppercase text-luxury-gold mb-6">
              <Star size={12} fill="currentColor" /> Award Categories
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-luxury-ink leading-tight mb-6">
              Recognising Every Form of<br /><span className="italic">Scholarly Excellence</span>
            </h2>
            <p className="font-prose text-lg text-text-muted leading-relaxed">
              From transformative original research to decades-long academic leadership, our 33 award categories encompass the full breadth of scholarly achievement.
            </p>
            <div className="w-12 h-0.5 bg-linear-to-r from-luxury-gold to-luxury-gold/50 mx-auto mt-8 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-light border-2 border-border-light rounded-[2rem] overflow-hidden">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group relative bg-app-bg p-10 hover:bg-luxury-ink transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Art Deco Corner */}
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-luxury-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 group-hover:bg-luxury-gold/20 group-hover:text-luxury-gold",
                    cat.color === 'gold' ? "bg-luxury-gold/10 text-luxury-gold" :
                      cat.color === 'teal' ? "bg-teal/10 text-teal" :
                        cat.color === 'wine' ? "bg-luxury-wine/10 text-luxury-wine" :
                          "bg-navy/10 text-navy"
                  )}>
                    <Trophy size={28} />
                  </div>

                  <div className="text-[10px] font-bold tracking-[2px] uppercase text-text-subtle mb-2 group-hover:text-white/40 transition-colors">Category {cat.id}</div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-ink mb-4 group-hover:text-white transition-colors leading-tight">{cat.title}</h3>
                  <p className="font-prose text-base text-text-muted mb-8 group-hover:text-white/60 transition-colors leading-relaxed">
                    {cat.desc}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {cat.tags.map(tag => (
                      <span key={tag} className="text-[11px] font-bold px-3 py-1 rounded-full border border-border-light text-text-muted group-hover:border-luxury-gold/40 group-hover:text-luxury-gold group-hover:bg-luxury-gold/10 transition-all">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute top-8 right-8 text-[9px] font-bold tracking-[1.5px] uppercase bg-bg-light border border-border-light px-3 py-1 rounded-full text-text-muted group-hover:bg-luxury-gold/20 group-hover:border-luxury-gold/40 group-hover:text-luxury-gold transition-all">
                  {cat.count}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section data-annotate-id="awards-benefits-section" className="py-24 bg-app-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-[10px] font-bold tracking-[2px] uppercase text-luxury-gold mb-6">
              Nomination Process
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-luxury-ink leading-tight mb-6">
              How to Nominate in<br /><span className="italic">Four Steps</span>
            </h2>
            <p className="font-prose text-lg text-text-muted leading-relaxed">
              Our streamlined process ensures every deserving scholar receives fair, transparent evaluation by our international academic jury.
            </p>
            <div className="w-12 h-0.5 bg-linear-to-r from-luxury-gold to-luxury-gold/50 mx-auto mt-8 rounded-full" />
          </div>

          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px border-t border-dashed border-luxury-gold/40" />

            <TimelineStep
              num="01"
              title="Register and Select a Category"
              desc="Create your Acadivate account, browse the 33 award categories, and select the one that best aligns with your field."
              badge="Always Open"
              badgeColor="gold"
            />
            <TimelineStep
              num="02"
              title="Submit Your Portfolio"
              desc="Upload your nomination portfolio — research outputs, citation metrics, CV, and supporting evidence."
              badge="Deadline: 31 Mar"
              badgeColor="teal"
            />
            <TimelineStep
              num="03"
              title="Expert Jury Evaluation"
              desc="Our 30-member international academic jury evaluates every submission using a published scoring framework."
              badge="Apr–May 2026"
              badgeColor="navy"
            />
            <TimelineStep
              num="04"
              title="Gala Ceremony and Awards"
              desc="Winners receive a gold medal, framed certificate, and laureate badge at our Annual Excellence Gala."
              badge="Sep 2026 · Delhi"
              badgeColor="wine"
            />
          </div>
        </div>
      </section>

      {/* Jury Section */}
      <section data-annotate-id="awards-process-section" className="py-24 bg-app-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-[10px] font-bold tracking-[2px] uppercase text-luxury-gold mb-6">
              The Jury
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-luxury-ink leading-tight mb-6">
              An International Panel of<br /><span className="italic">Academic Leaders</span>
            </h2>
            <p className="font-prose text-lg text-text-muted leading-relaxed">
              Our jury comprises 30 internationally recognised academics, research directors, and institutional leaders from 15+ countries.
            </p>
            <div className="w-12 h-0.5 bg-linear-to-r from-luxury-gold to-luxury-gold/50 mx-auto mt-8 rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {JURY.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-app-bg border border-border-light rounded-[2rem] overflow-hidden hover:shadow-sh-lg hover:border-border-2 transition-all duration-500"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-luxury-ink/70 backdrop-blur-md text-[9px] font-bold tracking-[1.5px] uppercase text-white/80">
                    {member.country}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-lg font-bold text-luxury-ink mb-1 group-hover:text-luxury-gold transition-colors">{member.name}</h3>
                  <div className="text-[13px] font-bold text-luxury-gold mb-3">{member.title}</div>
                  <div className="flex items-center gap-2 text-[12px] text-text-muted">
                    <MapPin size={12} className="text-luxury-gold" /> {member.inst}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section data-annotate-id="awards-highlight-section" className="py-20 bg-app-bg border-y border-border-light relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(ellipse 65% 70% at 85%,rgba(18,167,207,.2) 0%,transparent 65%)' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <BandStat icon={<Award size={24} />} value="33" label="Award Categories" />
            <BandStat icon={<Users size={24} />} value="500" label="Past Laureates" />
            <BandStat icon={<Globe size={24} />} value="15" label="Countries" />
            <BandStat icon={<MapPin size={24} />} value="80" label="Affiliated Institutions" />
            <BandStat icon={<Calendar size={24} />} value="4" label="Years of Excellence" />
          </div>
        </div>
      </section>

      {/* Winners Showcase */}
      <section data-annotate-id="awards-jury-section" className="py-24 bg-app-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-[10px] font-bold tracking-[2px] uppercase text-luxury-gold mb-6">
              Hall of Fame
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-luxury-ink leading-tight mb-6">
              Scholars Who Shaped<br /><span className="italic">Academic History</span>
            </h2>
            <p className="font-prose text-lg text-text-muted leading-relaxed">
              A tribute to the extraordinary academics and institutions recognised at Acadivate Excellence Awards since 2023.
            </p>
            <div className="w-12 h-0.5 bg-linear-to-r from-luxury-gold to-luxury-gold/50 mx-auto mt-8 rounded-full" />
          </div>

          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {(['y2025', 'y2024', 'y2023'] as const).map(year => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-[13px] font-bold border-1.5 transition-all duration-300",
                  activeYear === year
                    ? "bg-luxury-ink border-luxury-ink text-white shadow-sh-md"
                    : "bg-transparent border-border-light text-text-muted hover:border-luxury-ink hover:text-luxury-ink"
                )}
              >
                {year === 'y2025' ? '2025 Laureates' : year === 'y2024' ? '2024 Laureates' : '2023 Inaugural'}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WINNERS[activeYear].map((winner, idx) => (
              <motion.div
                key={winner.name + idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group bg-app-bg border border-border-light rounded-3xl overflow-hidden hover:shadow-sh-lg hover:border-border-2 transition-all duration-500"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={winner.image} alt={winner.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-linear-to-br from-luxury-gold to-luxury-gold-2 border-2 border-white/50 flex items-center justify-center text-[9px] font-bold text-luxury-ink">
                    <Award size={14} />
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-luxury-ink/70 backdrop-blur-sm text-[8px] font-bold tracking-wider uppercase text-white/90">
                    {winner.cat}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-base font-bold text-luxury-ink mb-1 group-hover:text-luxury-gold transition-colors">{winner.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted mb-3">
                    <MapPin size={10} className="text-luxury-gold" /> {winner.inst}
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-luxury-gold/10 text-luxury-gold text-[10px] font-bold uppercase tracking-wider">
                    {winner.award}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nomination Form Section */}
      <section data-annotate-id="awards-nomination-section" className="py-24 bg-app-bg" id="nominate">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-3 w-full mb-6">
                <span className="text-[10px] font-bold tracking-[3px] uppercase text-luxury-gold">Submit a Nomination</span>
                <div className="flex-1 h-px bg-luxury-gold/20" />
              </div>

              <h2 className="font-serif text-4xl md:text-5xl font-bold text-luxury-ink leading-tight mb-8">
                Every Scholar Deserves<br /><span className="italic">to Be Seen</span>
              </h2>

              <p className="font-prose text-lg text-text-muted leading-relaxed mb-10">
                Whether you're nominating yourself, a colleague, or your institution — our process is open, merit-driven, and globally inclusive. No academic geography should go unrecognised.
              </p>

              <div className="space-y-6 mb-12">
                <Perk icon={<CheckCircle2 size={18} />} title="Open to All Nationalities" sub="Researchers and institutions from every country are eligible." color="gold" />
                <Perk icon={<Award size={18} />} title="Transparent, Impartial Jury" sub="30 internationally recognised experts evaluate every submission." color="teal" />
                <Perk icon={<Globe size={18} />} title="Global Visibility for Winners" sub="Award recognition, Scopus-linked profile, and laureate badge." color="primary" />
                <Perk icon={<Download size={18} />} title="Multiple Nominations Allowed" sub="Nominate for up to 3 different categories per cycle." color="navy" />
              </div>

              <Button variant="outline" size="lg" className="rounded-xl px-8 py-4 text-base border-luxury-ink text-luxury-ink hover:bg-luxury-ink hover:text-white">
                <Download size={18} className="mr-2" /> Download Award Guidelines
              </Button>

              <div className="mt-10 p-6 rounded-3xl bg-linear-to-br from-luxury-ink to-navy border border-luxury-gold/20 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[2px] uppercase text-white/40 mb-1">Submission Deadline</div>
                  <div className="font-serif text-xl font-bold text-white">31 March 2026</div>
                  <div className="text-[12px] text-white/50">Notification by 30 April · Ceremony: Sep 2026</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-app-bg border-1.5 border-border-light rounded-[2.5rem] p-10 shadow-sh-lg"
            >
              <h3 className="font-serif text-2xl font-bold text-luxury-ink mb-2">Submit Your Nomination</h3>
              <p className="text-sm text-text-muted mb-8">All fields marked * are required. No payment at this stage.</p>

              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">First Name *</label>
                    <input type="text" placeholder="Dr. / Prof." className="w-full px-4 py-3 rounded-xl bg-bg-light border-1.5 border-border-light focus:outline-none focus:border-luxury-gold transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Last Name *</label>
                    <input type="text" placeholder="Your surname" className="w-full px-4 py-3 rounded-xl bg-bg-light border-1.5 border-border-light focus:outline-none focus:border-luxury-gold transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Email *</label>
                    <input type="email" placeholder="your@institution.edu" className="w-full px-4 py-3 rounded-xl bg-bg-light border-1.5 border-border-light focus:outline-none focus:border-luxury-gold transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Institution *</label>
                    <input type="text" placeholder="University / Organisation" className="w-full px-4 py-3 rounded-xl bg-bg-light border-1.5 border-border-light focus:outline-none focus:border-luxury-gold transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Award Category *</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-bg-light border-1.5 border-border-light focus:outline-none focus:border-luxury-gold transition-all appearance-none cursor-pointer">
                    <option value="">— Select an award category —</option>
                    <option>Excellence in Research</option>
                    <option>Innovation Leadership</option>
                    <option>Lifetime Achievement</option>
                    <option>Young Researcher Award</option>
                    <option>Best Paper Award</option>
                    <option>Institutional Excellence</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Statement of Contribution *</label>
                  <textarea rows={4} placeholder="Describe the scholarly contribution being nominated (min 30 words)…" className="w-full px-4 py-3 rounded-xl bg-bg-light border-1.5 border-border-light focus:outline-none focus:border-luxury-gold transition-all resize-none" />
                </div>

                <Button variant="gold" size="lg" className="w-full rounded-2xl py-5 text-base shadow-sh-gold hover:shadow-sh-gold-lg">
                  <Send size={18} className="mr-2" /> Submit Nomination
                </Button>

                <div className="flex items-center gap-2 text-[11px] text-text-subtle justify-center">
                  <CheckCircle2 size={12} /> Data handled per our Privacy Policy.
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section data-annotate-id="awards-testimonials-section" className="py-24 bg-app-bg relative overflow-hidden border-t border-border-light">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0a1830 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-[10px] font-bold tracking-[2px] uppercase text-luxury-gold mb-6">
              Laureate Voices
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy leading-tight mb-6">
              What Award<br /><span className="italic shim">Winners Say</span>
            </h2>
            <p className="font-prose text-lg text-text-muted leading-relaxed">
              Hear from the scholars who have been through the Acadivate Excellence Awards journey.
            </p>
            <div className="w-12 h-0.5 bg-linear-to-r from-luxury-gold to-luxury-gold/50 mx-auto mt-8 rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial
              text="Receiving the Excellence in Research Award from Acadivate was a defining moment. The jury's feedback was extraordinarily detailed and the global visibility has opened collaboration opportunities I never anticipated."
              name="Prof. Rashida Ahmed"
              role="Excellence in Research Laureate · 2025"
              image="https://picsum.photos/seed/t1/100/100"
            />
            <Testimonial
              text="The Scopus-linked laureate profile that Acadivate creates for every winner has measurably elevated my institution's research visibility globally. It is professional recognition in its truest form."
              name="Prof. David Tan"
              role="Institutional Excellence · Manipal Int'l University"
              image="https://picsum.photos/seed/t2/100/100"
            />
            <Testimonial
              text="As a young researcher under 35, winning the Acadivate Young Researcher Award transformed my career trajectory. The jury selection was genuinely rigorous, which makes it all the more meaningful."
              name="Dr. Lin Wei"
              role="Young Researcher Award · Tsinghua University"
              image="https://picsum.photos/seed/t3/100/100"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section data-annotate-id="awards-faq-section" className="py-24 bg-app-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-[10px] font-bold tracking-[2px] uppercase text-luxury-gold mb-6">
              FAQ
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-luxury-ink leading-tight mb-6">
              Frequently Asked<br /><span className="italic">Questions</span>
            </h2>
            <div className="w-12 h-0.5 bg-linear-to-r from-luxury-gold to-luxury-gold/50 mx-auto mt-8 rounded-full" />
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            <FaqItem
              q="Who is eligible to nominate for Acadivate Excellence Awards?"
              a="Any academic professional, researcher, PhD scholar, faculty member, or institution worldwide may submit a nomination. Self-nominations and third-party peer nominations are both accepted."
              isOpen={openFaq === 0}
              onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
            />
            <FaqItem
              q="Is there a nomination fee, and are fee waivers available?"
              a="Yes, a nominal nomination fee covers jury evaluation and administration. Fee waivers are available for researchers from low-income countries and early-career scholars who demonstrate financial need."
              isOpen={openFaq === 1}
              onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
            />
            <FaqItem
              q="What recognition do award winners receive?"
              a="Winners receive a gold-plated medal, framed certificate, commemorative memento, permanent laureate profile on acadivate.org (Scopus-linked), a digital badge, and a feature in our global academic newsletter."
              isOpen={openFaq === 2}
              onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
            />
            <FaqItem
              q="How does the jury evaluation process work?"
              a="Each submission is evaluated independently by a minimum of 3 jury members with expertise in the relevant discipline. Evaluators use our published multi-criterion scoring matrix covering research impact, methodology, and originality."
              isOpen={openFaq === 3}
              onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section data-annotate-id="awards-cta-section" className="py-24 bg-app-bg relative overflow-hidden border-t border-border-light">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-linear-to-b from-transparent via-primary/20 to-transparent rotate-12" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-linear-to-b from-transparent via-primary/20 to-transparent -rotate-12" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <div className="text-[11px] font-bold tracking-[4px] uppercase text-primary mb-8">Nominations Close 31 March 2026</div>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-navy leading-tight mb-8">
            Don't Let a Deserving<br />Scholar Go <span className="italic shim">Unrecognised.</span>
          </h2>
          <p className="font-prose text-lg text-text-muted leading-relaxed mb-12">
            The world needs to know about your research, leadership, and impact. Acadivate Excellence Awards gives scholars and institutions the global recognition they have earned.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/nomination-form">
              <Button variant="gold" size="lg" className="rounded-2xl px-10 py-5 text-lg shadow-sh-gold hover:shadow-sh-gold-lg">
                Submit Nomination Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-2xl px-10 py-5 text-lg text-navy border-navy/20 hover:bg-navy/5 backdrop-blur-md">
              Download Guidelines
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-3 text-text-muted text-sm">
            <Calendar size={16} className="text-luxury-gold" />
            Deadline: <span className="text-luxury-gold font-bold">31 March 2026</span> &nbsp;·&nbsp; Ceremony: <span className="text-luxury-gold font-bold">Sep 2026</span>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatItem = ({ label, value, plus }: { label: string; value: string; plus?: boolean }) => (
  <div className="p-6 text-center hover:bg-primary/5 transition-colors">
    <div className="font-serif text-3xl font-bold text-navy leading-none mb-2">
      {value}{plus && <span className="text-primary">+</span>}
    </div>
    <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-text-muted">{label}</div>
  </div>
);

const MetricCard = ({ label, value, sub, plus }: { label: string; value: string; sub?: string; plus?: boolean }) => (
  <div className="bg-app-bg border border-border-light rounded-2xl p-4 text-center shadow-sh-sm hover:bg-primary/5 hover:border-primary/30 transition-all">
    <div className="font-serif text-2xl font-bold text-navy leading-none">
      {value}{plus && <span className="text-primary">+</span>}{sub && <span className="text-primary text-lg ml-0.5">{sub}</span>}
    </div>
    <div className="text-[10px] font-bold tracking-[1px] uppercase text-text-muted mt-1">{label}</div>
  </div>
);

const TimelineStep = ({ num, title, desc, badge, badgeColor }: { num: string; title: string; desc: string; badge: string; badgeColor: 'gold' | 'teal' | 'navy' | 'wine' }) => (
  <div className="text-center group">
    <div className="relative z-10 w-24 h-24 rounded-full bg-app-bg border-2 border-border-light flex flex-col items-center justify-center mx-auto mb-8 shadow-sh-sm group-hover:border-luxury-gold group-hover:shadow-sh-gold group-hover:bg-luxury-gold-pale transition-all duration-500">
      <div className="font-serif text-3xl font-bold text-luxury-ink group-hover:text-luxury-gold transition-colors">{num}</div>
    </div>

    <div className={cn(
      "inline-block text-[10px] font-bold tracking-[1.5px] uppercase px-3 py-1 rounded-full mb-4",
      badgeColor === 'gold' ? "bg-luxury-gold/10 text-luxury-gold" :
        badgeColor === 'teal' ? "bg-teal/10 text-teal" :
          badgeColor === 'navy' ? "bg-navy/10 text-navy" :
            "bg-luxury-wine/10 text-luxury-wine"
    )}>
      {badge}
    </div>

    <h3 className="font-serif text-lg font-bold text-luxury-ink mb-3 leading-tight">{title}</h3>
    <p className="text-sm text-text-muted leading-relaxed font-prose">{desc}</p>
  </div>
);

const BandStat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="text-center">
    <div className="text-primary/60 mb-4 flex justify-center">{icon}</div>
    <div className="font-serif text-4xl font-bold text-navy mb-2 leading-none">{value}<span className="text-primary">+</span></div>
    <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-text-muted">{label}</div>
  </div>
);

const Perk = ({ icon, title, sub, color }: { icon: React.ReactNode; title: string; sub: string; color: 'gold' | 'teal' | 'primary' | 'navy' }) => (
  <div className="flex items-start gap-4">
    <div className={cn(
      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
      color === 'gold' ? "bg-luxury-gold/10 text-luxury-gold" :
        color === 'teal' ? "bg-teal/10 text-teal" :
          color === 'primary' ? "bg-primary/10 text-primary" :
            "bg-navy/10 text-navy"
    )}>
      {icon}
    </div>
    <div>
      <div className="text-sm font-bold text-luxury-ink mb-1 leading-tight">{title}</div>
      <div className="text-sm text-text-muted font-prose leading-relaxed">{sub}</div>
    </div>
  </div>
);

const Testimonial = ({ text, name, role, image }: { text: string; name: string; role: string; image: string }) => (
  <div className="bg-app-bg border border-border-light rounded-[2rem] p-8 relative group hover:shadow-sh-lg hover:border-border-2 transition-all duration-500">
    <Quote size={48} className="absolute top-6 right-6 text-luxury-gold/10" />
    <div className="flex gap-1 text-luxury-gold mb-6">
      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
    </div>
    <p className="font-prose text-lg italic text-luxury-ink leading-relaxed mb-8">"{text}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border-light">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <div className="text-sm font-bold text-luxury-ink">{name}</div>
        <div className="text-[11px] text-text-muted">{role}</div>
      </div>
    </div>
  </div>
);

const FaqItem = ({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) => (
  <div className={cn(
    "bg-app-bg border-1.5 rounded-2xl overflow-hidden transition-all duration-300",
    isOpen ? "border-border-2 shadow-sh-sm" : "border-border-light"
  )}>
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 text-left group"
    >
      <span className="text-[15px] font-bold text-luxury-ink group-hover:text-luxury-gold transition-colors">{q}</span>
      <div className={cn(
        "w-8 h-8 rounded-lg bg-bg-light border border-border-light flex items-center justify-center text-text-muted transition-all duration-300",
        isOpen && "bg-luxury-gold/10 border-luxury-gold/30 text-luxury-gold rotate-45"
      )}>
        <ArrowRight size={16} className={cn("transition-transform", isOpen ? "rotate-45" : "-rotate-45")} />
      </div>
    </button>
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
      className="overflow-hidden"
    >
      <div className="px-5 pb-5 font-prose text-[15.5px] text-text-muted leading-relaxed border-t border-border-light pt-4">
        {a}
      </div>
    </motion.div>
  </div>
);

export default Awards;
