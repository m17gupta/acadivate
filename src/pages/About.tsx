'use client';

import * as React from 'react';
import { AboutHero } from '../components/sections/AboutHero';
import { About as FoundationSection } from '../components/sections/About';
import { ConferenceTimeline } from '../components/sections/ConferenceTimeline';
import { CoreValues } from '../components/sections/CoreValues';
import { GlobalFootprint } from '../components/sections/GlobalFootprint';
import { LeadershipTeam } from '../components/sections/LeadershipTeam';
import { AboutFAQ } from '../components/sections/AboutFAQ';
import { CTA } from '../components/sections/CTA';
import GetAllHomepage from '../components/homePage/GetAllHomepage';
import { AnnotatorPlugin } from '../components/annotationPlugin';
import { useAppSelector } from '@/src/hook/hooks';
import { RootState } from '@/src/hook/store';

export const About = () => {

    const {user,isAuthenticated} = useAppSelector((state:RootState) => state.auth);
  return (
    <>
        {/* get all pahes data */}
        <GetAllHomepage/>

        {/* comments plugin */}
     { isAuthenticated && <AnnotatorPlugin />}
     
    <div className="overflow-hidden">
    
      <AboutHero />
      <FoundationSection />
      <ConferenceTimeline />
      <CoreValues />
      <GlobalFootprint />
      <LeadershipTeam />
      <AboutFAQ />
      <CTA />
    </div>
     </>
  );
};

export default About;
