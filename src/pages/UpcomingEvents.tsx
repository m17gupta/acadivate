'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, ArrowRight, Filter, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: 'Academic Excellence Awards 2025',
    type: 'Awards',
    date: '15 September 2025',
    location: 'New Delhi, India',
    image: 'https://picsum.photos/seed/event1/600/400',
    slug: 'awards-2025'
  },
  {
    id: 2,
    title: 'Research Methodology FDP Workshop',
    type: 'Workshop',
    date: '10 August 2025',
    location: 'Online / India',
    image: 'https://picsum.photos/seed/event2/600/400',
    slug: 'workshop-2026'
  },
  {
    id: 3,
    title: 'Sustainability Innovation Forum',
    type: 'Forum',
    date: '05 November 2025',
    location: 'Bangkok, Thailand',
    image: 'https://picsum.photos/seed/event3/600/400',
    slug: 'forum-2025'
  },
  {
    id: 4,
    title: 'International Dean\'s Summit',
    type: 'Summit',
    date: '12 December 2025',
    location: 'Kuala Lumpur, Malaysia',
    image: 'https://picsum.photos/seed/event4/600/400',
    slug: 'summit-2025'
  }
];

export const UpcomingEvents = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-primary-deep overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold tracking-[2px] uppercase text-gold mb-6">
              Stay Updated
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Upcoming <span className="text-gold">Events</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-10">
              Explore our calendar of upcoming academic events, workshops, and recognition ceremonies designed to elevate your professional journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-app-bg border-b border-border-light sticky top-[76px] z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full gap-2">
              <Filter size={14} /> Filter
            </Button>
            <div className="flex gap-2">
              {['All', 'Conferences', 'Awards', 'Workshops'].map(t => (
                <button key={t} className="px-4 py-1.5 rounded-full text-xs font-bold border border-border-light hover:border-navy transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-bg-soft border border-border-light focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24 bg-app-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {UPCOMING_EVENTS.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-app-bg rounded-[2.5rem] overflow-hidden border border-border-light flex flex-col sm:flex-row hover:shadow-sh-xl transition-all duration-500"
              >
                <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="sm:w-3/5 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {event.type}
                      </span>
                      <div className="text-gold">
                        <Calendar size={18} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-4 leading-tight group-hover:text-gold transition-colors">
                      {event.title}
                    </h3>
                    <div className="space-y-2 mb-8">
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Clock size={14} className="text-gold" /> {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <MapPin size={14} className="text-gold" /> {event.location}
                      </div>
                    </div>
                  </div>
                  <Link href={`/events/${event.slug}`}>
                    <Button variant="ghost" className="p-0 hover:bg-transparent text-primary font-bold gap-2 group/btn">
                      View Details <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpcomingEvents;
