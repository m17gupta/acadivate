'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  Share2, Linkedin, Twitter, Facebook, Link as LinkIcon,
  Clock, Calendar, MapPin, FileText, User, Star,
  CheckCircle2, Info, AlertCircle, Quote, ArrowRight,
  List
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/src/lib/utils';

export const EventMain = () => {
  const [activeSection, setActiveSection] = React.useState('sec-overview');

  const TOC_LINKS = [
    { id: 'sec-overview', label: 'Overview of ICAS 2026', num: '01' },
    { id: 'sec-organizers', label: 'Conference Organizers', num: '02' },
    { id: 'sec-mission', label: 'Mission & Objectives', num: '03' },
    { id: 'sec-themes', label: 'Themes & Topics', num: '04' },
    { id: 'sec-venue', label: 'Venue & Location', num: '05' },
    { id: 'sec-submit', label: 'Call for Papers', num: '06' },
    { id: 'sec-reg', label: 'Registration', num: '07' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <section data-annotate-id="event-main-section" className="py-16 lg:py-24 bg-app-bg relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-navy) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">

          {/* Main Article Content */}
          <article className="space-y-12">
            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-[2rem] overflow-hidden shadow-sh-lg group"
            >
              <img
                src="/assets/Image/events-malasiya.jpg"
                alt="ICASD 2026 Kuala Lumpur Convention Centre"
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <Info size={16} className="text-gold" />
                  Petaling Jaya, Malaysia — Official venue for ICAS 2026, 29 March 2026
                </div>
              </div>
            </motion.div>

            {/* Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 p-5 bg-bg-soft border border-border-light rounded-2xl shadow-sh-xs">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">Share</span>
                <div className="flex items-center gap-2">
                  <ShareButton icon={<Linkedin size={16} />} color="hover:text-[#0a66c2] hover:bg-[#eef3fb] hover:border-[#0a66c2]" />
                  <ShareButton icon={<Twitter size={16} />} color="hover:text-black hover:bg-gray-100 hover:border-black" />
                  <ShareButton icon={<Facebook size={16} />} color="hover:text-[#1877f2] hover:bg-[#eef3fb] hover:border-[#1877f2]" />
                  <ShareButton icon={<LinkIcon size={16} />} color="hover:text-primary hover:bg-primary/10 hover:border-primary" />
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-text-muted">
                <Clock size={16} className="text-gold" />
                9 min read · 2,040 words
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none prose-headings:text-navy prose-headings:font-serif prose-p:text-text-muted prose-p:leading-relaxed prose-strong:text-navy prose-a:text-primary prose-a:no-underline hover:prose-a:text-gold transition-colors">
              <p className="text-xl font-serif italic text-navy border-l-4 border-gold pl-6 mb-12 leading-relaxed">
                The ICAS 2026 — International Conference on Anthropology and Sustainability — stands as a significant evolution following our international research conference 2025 legacy, aiming to foster scholarly networking and global research exchange across cultures.
              </p>

              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose mb-12">
                <StatBox value="300+" label="Delegates" />
                <StatBox value="15+" label="Countries" />
                <StatBox value="2" label="Conference Days" />
                <StatBox value="80+" label="Review Experts" />
              </div>

              <section id="sec-overview" data-annotate-id="event-overview-section">
                <h2 className="text-3xl font-bold mb-6 relative inline-block">
                  Overview of ICAS 2026
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gold rounded-full" />
                </h2>
                <p>
                  Scheduled for <strong>29 March 2026</strong> in Petaling Jaya, Malaysia, ICAS 2026 is a premier <strong>Malaysia research conference</strong> specifically curated for researchers and scholars. Building on the global momentum of the <strong>international research conference 2025</strong>, this edition focuses on <strong>anthropology research</strong> and its intersection with environmental and social sustainability.
                </p>
                <p>
                  The event provides a unique platform for delegates to establish international linkages and find future career collaborations through structured <strong>scholarly networking</strong> sessions.
                </p>
              </section>

              <div className="not-prose my-12 p-8 rounded-3xl bg-gold/5 border border-gold/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="flex gap-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center text-gold shrink-0">
                    <Star size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-navy mb-2">Publication Opportunity</h4>
                    <p className="text-text-muted leading-relaxed">
                      All accepted full papers at ICASD 2026 will be submitted for indexing consideration in <strong>Scopus</strong> and <strong>Web of Science (WoS)</strong> indexed journals — offering a premium, high-impact pathway for your research.
                    </p>
                  </div>
                </div>
              </div>

              <section id="sec-organizers" data-annotate-id="event-organizers-section">
                <h2 className="text-3xl font-bold mb-6 relative inline-block">
                  Conference Organizers
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gold rounded-full" />
                </h2>
                <p>
                  ICAS 2026 is organized by Global Conference in collaboration with Acadivate, bringing together a dedicated team of academic coordinators to manage the technical and ethical standards of this <strong>international research conference 2025</strong> successor.
                </p>

                <div className="grid md:grid-cols-2 gap-6 not-prose mt-8">
                  <OrganizerCard
                    name="Dr. Arjun Sharma"
                    role="Conference Chair"
                    org="Acadivate ARIF"
                    image="https://picsum.photos/seed/org1/100/100"
                  />
                  <OrganizerCard
                    name="Prof. Rajan Mehta"
                    role="Technical Programme Chair"
                    org="Manipal International University"
                    image="https://picsum.photos/seed/org2/100/100"
                  />
                  <OrganizerCard
                    name="Dr. Priya Nair"
                    role="Publications Chair"
                    org="Acadivate ARIF"
                    image="https://picsum.photos/seed/org3/100/100"
                  />
                  <OrganizerCard
                    name="Ms. Ananya Kapoor"
                    role="Events & Logistics Manager"
                    org="Acadivate ARIF"
                    image="https://picsum.photos/seed/org4/100/100"
                  />
                </div>
              </section>

              <section id="sec-mission" data-annotate-id="event-mission-section" className="mt-16">
                <h2 className="text-3xl font-bold mb-6 relative inline-block">
                  Academic Mission & Objectives
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gold rounded-full" />
                </h2>
                <p>
                  The core objective of ICAS 2026 is to facilitate a <strong>global research exchange</strong> that transcends traditional academic boundaries. Our mission is built on several key goals:
                </p>
                <ul className="space-y-4 list-none pl-0">
                  {[
                    { title: 'Scholarly Networking', desc: 'Providing a platform for researchers to share ideas and experiences in person.' },
                    { title: 'International Linkages', desc: 'Establishing research and business relations for future career collaborations.' },
                    { title: 'Anthropology Research', desc: 'Contributing significant knowledge to contemporary scientific fields related to anthropology.' },
                    { title: 'Sustainability Excellence', desc: 'Promoting sustainable development goals through evidence-based research.' },
                    { title: 'Call for Papers', desc: 'Encouraging original research publication in high-impact international journals.' }
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <div>
                        <strong className="text-navy block mb-1">{item.title}</strong>
                        <span className="text-text-muted">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="not-prose my-16 rounded-[2rem] overflow-hidden shadow-sh-lg group">
                <img src="/assets/Image/conferencebanner.jpg" alt="KLCC Kuala Lumpur" className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="p-6 bg-bg-soft border-t border-border-light flex items-center gap-3 text-sm text-text-muted italic">
                  <Info size={16} className="text-gold" />
                  The Kuala Lumpur Convention Centre — a world-class venue adjacent to the iconic Petronas Twin Towers
                </div>
              </div>

              <section id="sec-themes" data-annotate-id="event-themes-section">
                <h2 className="text-3xl font-bold mb-6 relative inline-block">
                  Conference Themes & Topics
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gold rounded-full" />
                </h2>
                <p>
                  ICAS 2026 welcomes original research across a spectrum of interdisciplinary themes related to <strong>anthropology research</strong> and sustainability:
                </p>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                  {[
                    'Cultural Sustainability & Heritage',
                    'Social Sustainability & Political Structures',
                    'Economic Sustainability & Resource Management',
                    'Archaeology & Sustainability in Ancient Civilizations',
                    'Linguistic & Biological Sustainability',
                    'Environmental Anthropology & Climate Impact',
                    'Indigenous Knowledge Systems & Global Change',
                    'Ethical Research in Contemporary Anthropology'
                  ].map((theme, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-text-muted">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {theme}
                    </div>
                  ))}
                </div>
              </section>

              <blockquote className="not-prose my-16 p-10 bg-navy rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <Quote size={60} className="absolute top-6 left-6 text-gold/10" />
                <p className="text-2xl font-serif italic text-white leading-relaxed relative z-10 mb-8">
                  "ICASD 2026 is not just a conference — it is a living laboratory for ideas that matter. Our organizing team is committed to creating a space where rigorous research meets real-world impact."
                </p>
                <cite className="block text-gold font-bold not-italic relative z-10">
                  — Dr. Arjun Sharma, <span className="text-white/60 font-medium">Conference Chair, ICASD 2026</span>
                </cite>
              </blockquote>

              <section id="sec-venue" data-annotate-id="event-venue-section">
                <h2 className="text-3xl font-bold mb-6 relative inline-block">
                  Venue & Location
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gold rounded-full" />
                </h2>
                <p>
                  Petaling Jaya, a vibrant city in Selangor, Malaysia, serves as the host location for ICAS 2026. Known for its academic centers and modern infrastructure, Petaling Jaya provides an ideal backdrop for establishing <strong>international linkages</strong> and <strong>academic collaboration</strong>.
                </p>
                <div className="not-prose mt-8 p-8 rounded-3xl bg-primary/5 border border-primary/20 flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-navy mb-2">Location Highlights</h4>
                    <p className="text-text-muted leading-relaxed">
                      The conference will be held in a premium venue in Petaling Jaya, Malaysia. The city offers world-class facilities and is conveniently located for international delegates traveling for this <strong>international research conference 2025</strong> successor event.
                    </p>
                  </div>
                </div>
              </section>

              <section id="sec-submit" data-annotate-id="event-submit-section" className="mt-16">
                <h2 className="text-3xl font-bold mb-6 relative inline-block">
                  Call for Papers & Submission
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gold rounded-full" />
                </h2>
                <p>
                  We invite original contributions for ICAS 2026. Authors are encouraged to <strong>submit research paper conference</strong> entries that align with the core themes of anthropology and sustainability. All submissions go through a rigorous peer-review process.
                </p>
                <h3 className="text-xl font-bold text-navy mt-8 mb-4">Accepted Submission Categories</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Full Anthropology Research Papers',
                    'Sustainable Development Case Studies',
                    'Collaborative Research Proposals',
                    'Postdoctoral & PhD Research Presentations',
                    'Digital & Virtual Presentations'
                  ].map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-bg-soft border border-border-light text-sm font-medium text-navy">
                      <CheckCircle2 size={16} className="text-gold" />
                      {cat}
                    </div>
                  ))}
                </div>
                <div className="not-prose mt-8 p-8 rounded-3xl bg-secondary/5 border border-secondary/20 flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-navy mb-2">Submission Deadline</h4>
                    <p className="text-text-muted leading-relaxed">
                      <strong>Final deadline: 02 March 2026.</strong> Early <strong>call for papers</strong> responses are prioritized. Notification of acceptance is provided on a rolling basis.
                    </p>
                  </div>
                </div>
              </section>

              <section id="sec-reg" data-annotate-id="event-registration-section" className="mt-16">
                <h2 className="text-3xl font-bold mb-6 relative inline-block">
                  Registration
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gold rounded-full" />
                </h2>
                <p>
                  Registration is open. Early-bird rates available until 05 March 2026. Presenters, listeners, and virtual attendees may register. Group discounts apply for 5+ institutional registrations. All presenters receive a conference kit, presentation certificate, indexed proceedings, and 6-month resource library access.
                </p>
              </section>
            </div>

            {/* Discussion Section */}
            <section data-annotate-id="event-sidebar-section" className="pt-16 border-t border-border-light">
              <h2 className="text-2xl font-serif font-bold text-navy mb-10 flex items-center gap-4">
                Discussion <span className="text-sm font-sans font-bold text-text-muted bg-bg-soft px-3 py-1 rounded-full">3 comments</span>
              </h2>

              <div className="space-y-8 mb-12">
                <CommentItem
                  name="Prof. Lim Wei Hong"
                  date="02 March 2026"
                  text="Excellent coverage of the ICASD 2026 organizing team. Attended ICGSD 2024 in Thailand — quality of peer-reviewed sessions was consistently outstanding. Looking forward to KL in May."
                  image="https://picsum.photos/seed/cmnt1/60/60"
                />
                <CommentItem
                  name="Dr. Fatima Al-Rashid"
                  date="04 March 2026"
                  text="Could someone confirm whether virtual attendance includes access to all plenary sessions and proceedings? Our team in Riyadh may not be able to travel."
                  image="https://picsum.photos/seed/cmnt2/60/60"
                />
                <CommentItem
                  name="Rahul Desai, PhD Candidate"
                  date="06 March 2026"
                  text="This is my first ICASD. The Scopus indexing pathway is a major attraction for early-career researchers like myself. Submitted my abstract yesterday!"
                  image="https://picsum.photos/seed/cmnt3/60/60"
                />
              </div>

              {/* Comment Form */}
              <div className="bg-app-bg border-1.5 border-border-light rounded-[2rem] p-8 lg:p-10 shadow-sh-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                <h3 className="text-xl font-bold text-navy mb-8 relative z-10">Leave a Comment</h3>
                <form className="grid md:grid-cols-2 gap-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Full Name *</label>
                    <input type="text" placeholder="Dr. / Prof. Your Name" className="w-full px-5 py-4 rounded-xl bg-bg-soft border border-border-light focus:border-primary focus:bg-app-bg outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Email *</label>
                    <input type="email" placeholder="your@institution.edu" className="w-full px-5 py-4 rounded-xl bg-bg-soft border border-border-light focus:border-primary focus:bg-app-bg outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Message *</label>
                    <textarea rows={4} placeholder="Share your thoughts, questions, or academic insights…" className="w-full px-5 py-4 rounded-xl bg-bg-soft border border-border-light focus:border-primary focus:bg-app-bg outline-none transition-all resize-none" />
                  </div>
                  <div className="md:col-span-2">
                    <Button variant="primary" className="px-10 py-4 rounded-xl shadow-sh-md group/btn">
                      Post Comment <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              </div>
            </section>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-12 border-t border-border-light">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted mr-2 self-center">Tags</span>
              {['ICAS 2026', 'Petaling Jaya', 'Anthropology', 'Acadivate', 'Academic Conference', 'Malaysia Research', 'Sustainability'].map(tag => (
                <button key={tag} className="px-4 py-1.5 rounded-full border border-border-light text-xs font-semibold text-text-muted hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8 sticky top-24">
            {/* TOC Card */}
            <div className="bg-app-bg border-1.5 border-border-light rounded-3xl overflow-hidden shadow-sh-sm">
              <div className="bg-navy p-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-white">
                  <List size={16} />
                </div>
                <span className="text-sm font-bold text-white">Table of Contents</span>
              </div>
              <nav className="p-2">
                {TOC_LINKS.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                      activeSection === link.id
                        ? "bg-gold-pale text-gold font-bold"
                        : "text-text-muted hover:bg-bg-soft hover:text-navy hover:pl-6"
                    )}
                  >
                    <span className="font-mono text-[10px] text-text-muted/50 group-hover:text-gold transition-colors">{link.num}</span>
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Info Card */}
            <div className="bg-app-bg border-1.5 border-border-light rounded-3xl overflow-hidden shadow-sh-sm group">
              <div className="h-28 relative overflow-hidden">
                <img src="/assets/Image/event banner.jpeg" alt="ICASD 2026" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-linear-to-t from-navy/80 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-[9px] font-bold tracking-wider uppercase text-white shadow-sh-sm">Upcoming</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-navy mb-6 leading-tight">ICAS 2026 — Petaling Jaya, Malaysia</h3>
                <div className="space-y-4 mb-8">
                  <InfoItem icon={<Calendar size={14} />} label="Date" value="29 March 2026" color="gold" />
                  <InfoItem icon={<MapPin size={14} />} label="Venue" value="Petaling Jaya, Malaysia" color="primary" />
                  <InfoItem icon={<FileText size={14} />} label="Deadline" value="02 March 2026" color="navy" />
                </div>
                <Link href="/nomination-form1" className="w-full block">
                  <Button variant="primary" className="w-full py-4 rounded-xl shadow-sh-md group">
                    Register Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Categories Card */}
            <div className="bg-app-bg border-1.5 border-border-light rounded-3xl overflow-hidden shadow-sh-sm">
              <div className="p-6 border-b border-border-light flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <List size={16} />
                </div>
                <div>
                  <div className="text-sm font-bold text-navy">Categories</div>
                  <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Browse by type</div>
                </div>
              </div>
              <div className="p-2">
                {[
                  { label: 'International Conferences', count: 8, active: true },
                  { label: 'Academic Awards', count: 5 },
                  { label: 'Research Forums', count: 6 },
                  { label: 'Workshops & FDPs', count: 9 },
                  { label: 'Publications', count: 14 },
                  { label: 'Rankings', count: 3 }
                ].map((cat, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      cat.active
                        ? "bg-gold-pale text-gold font-bold"
                        : "text-text-muted hover:bg-bg-soft hover:text-navy hover:pl-6"
                    )}
                  >
                    {cat.label}
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full",
                      cat.active ? "bg-gold/20 text-gold" : "bg-bg-2 text-text-muted"
                    )}>{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
};

const ShareButton = ({ icon, color }: { icon: React.ReactNode; color: string }) => (
  <button className={cn(
    "w-9 h-9 rounded-xl border border-border-light flex items-center justify-center text-text-muted transition-all duration-300",
    color
  )}>
    {icon}
  </button>
);

const StatBox = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-app-bg border border-border-light rounded-2xl p-4 text-center hover:shadow-sh-md hover:-translate-y-1 transition-all duration-300">
    <div className="text-2xl font-serif font-bold text-navy mb-1">
      {value.includes('+') ? (
        <>{value.replace('+', '')}<span className="text-primary">+</span></>
      ) : value}
    </div>
    <div className="text-[9px] font-bold uppercase tracking-wider text-text-muted">{label}</div>
  </div>
);

const OrganizerCard = ({ name, role, org, image }: { name: string; role: string; org: string; image: string }) => (
  <div className="flex items-center gap-4 p-4 bg-app-bg border border-border-light rounded-2xl hover:shadow-sh-md transition-all duration-300 group">
    <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-border-light shrink-0 group-hover:border-gold transition-colors">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <div>
      <div className="text-sm font-bold text-navy mb-0.5">{name}</div>
      <div className="text-[11px] font-bold text-primary mb-1">{role}</div>
      <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
        <MapPin size={10} /> {org}
      </div>
    </div>
  </div>
);

const InfoItem = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <div className="flex items-start gap-3">
    <div className={cn(
      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
      color === 'gold' ? "bg-gold-pale text-gold" :
        color === 'primary' ? "bg-primary/10 text-primary" : "bg-bg-2 text-navy"
    )}>
      {icon}
    </div>
    <div>
      <div className="text-[9px] font-bold uppercase tracking-wider text-text-muted mb-0.5">{label}</div>
      <div className="text-sm font-bold text-navy">{value}</div>
    </div>
  </div>
);

const CommentItem = ({ name, date, text, image }: { name: string; date: string; text: string; image: string }) => (
  <div className="flex gap-6 group">
    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border-light shrink-0 group-hover:border-gold transition-colors">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h4 className="text-sm font-bold text-navy">{name}</h4>
        <span className="text-[10px] font-medium text-text-muted">{date}</span>
      </div>
      <p className="text-[14px] text-text-muted leading-relaxed">
        {text}
      </p>
      <button className="text-[11px] font-bold text-gold hover:text-gold-2 flex items-center gap-1.5 transition-colors">
        <Share2 size={12} className="rotate-180" /> Reply
      </button>
    </div>
  </div>
);
