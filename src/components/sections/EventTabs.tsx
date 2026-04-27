'use client';

import React, { useState } from 'react';
import { Info, Users, Clock, MapPin, HelpCircle } from 'lucide-react';

type EventTabsProps = {
  event: any;
  title: string;
};

export const EventTabs = ({ event, title }: EventTabsProps) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Agenda', 'Speakers', 'Venue', 'FAQs'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <>
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-light">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                <Info size={24} />
              </div>
              <h3 className="text-2xl font-bold text-navy">About the Event</h3>
            </div>
            <div className="prose prose-lg text-text-muted max-w-none prose-p:leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: event?.basic?.description || event?.description || `Join us for ${title}. Detailed agenda, speaker lineup, and venue information will be updated as the event approaches. Prepare to engage with global leaders and peers in an immersive, collaborative experience designed to foster innovation and academic excellence.` }} />
            </div>
          </>
        );
      case 'Agenda':
        const agenda = event?.details?.agenda || [];
        return (
          <>
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-light">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Clock size={24} />
              </div>
              <h3 className="text-2xl font-bold text-navy">Event Agenda</h3>
            </div>
            {agenda.length > 0 ? (
              <div className="space-y-6">
                {agenda.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-border-light bg-bg-soft">
                    <div className="w-24 shrink-0 font-bold text-primary">{item.time}</div>
                    <div>
                      <div className="font-bold text-navy text-lg">{item.activity}</div>
                      {item.speaker && <div className="text-text-muted mt-1">Speaker: {item.speaker}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted">Agenda will be updated soon.</p>
            )}
          </>
        );
      case 'Speakers':
        const speakers = event?.details?.speakers || [];
        return (
          <>
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-light">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold text-navy">Speakers & Guests</h3>
            </div>
            {speakers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {speakers.map((speaker: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border-light">
                    {speaker.photo ? (
                      <img src={speaker.photo} alt={speaker.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-xl shrink-0">
                        {speaker.name?.charAt(0) || 'S'}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-navy">{speaker.name}</div>
                      <div className="text-sm text-primary font-medium">{speaker.role}</div>
                      {speaker.bio && <div className="text-sm text-text-muted mt-2 line-clamp-2">{speaker.bio}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted">Speaker lineup will be announced shortly.</p>
            )}
          </>
        );
      case 'Venue':
        const loc = event?.location || {};
        return (
          <>
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-light">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                <MapPin size={24} />
              </div>
              <h3 className="text-2xl font-bold text-navy">Venue Information</h3>
            </div>
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-border-light bg-bg-soft">
                <div className="font-bold text-navy text-lg">{loc.venueName || 'To Be Announced'}</div>
                {(loc.address || loc.city || loc.country) && (
                  <div className="text-text-muted mt-2">
                    {[loc.address, loc.city, loc.country].filter(Boolean).join(', ')}
                  </div>
                )}
                {loc.accessInstructions && (
                  <div className="mt-4 pt-4 border-t border-border-light">
                    <span className="font-bold text-navy block mb-1">Access Instructions</span>
                    <span className="text-text-muted text-sm">{loc.accessInstructions}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      case 'FAQs':
        const faqs = event?.details?.faqs || [];
        return (
          <>
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-light">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                <HelpCircle size={24} />
              </div>
              <h3 className="text-2xl font-bold text-navy">Frequently Asked Questions</h3>
            </div>
            {faqs.length > 0 ? (
              <div className="space-y-4">
                {faqs.map((faq: any, i: number) => (
                  <div key={i} className="p-5 rounded-xl border border-border-light">
                    <div className="font-bold text-navy text-lg mb-2">{faq.question}</div>
                    <div className="text-text-muted">{faq.answer}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted">No FAQs available at this time.</p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-wrap gap-2 p-1.5 bg-bg-soft rounded-2xl border border-border-light shadow-sh-xs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab
                ? 'bg-white shadow-sh-sm text-navy'
                : 'text-text-muted hover:bg-white/50 hover:text-navy'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-border-light p-8 md:p-10 shadow-sh-sm transition-all duration-500">
        {renderContent()}
        <div className="mt-8 pt-8 border-t border-border-light text-center">
          <span className="font-serif italic text-gold text-2xl">End Of {activeTab}</span>
        </div>
      </div>
    </div>
  );
};
