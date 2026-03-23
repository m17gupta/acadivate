'use client';

import * as React from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { usePathname } from 'next/navigation';
import { TopBar } from './TopBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { cn } from '@/src/lib/utils';
import { Provider } from 'react-redux';
import { store } from '@/src/hook/store';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  React.useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Provider store={store}>
      {isDashboardRoute ? (
        <div className="relative min-h-screen">{children}</div>
      ) : (
        <div className="relative min-h-screen">
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-gold to-gold-2 z-[100] origin-left shadow-[0_0_10px_rgba(197,147,58,0.6)]"
            style={{ scaleX }}
          />

          <TopBar />
          <Header />

          <main data-annotate-id="app-main-content">{children}</main>

          <Footer />

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={cn(
              'fixed bottom-8 right-8 z-50 w-11 h-11 rounded-xl bg-navy text-white shadow-sh-md flex items-center justify-center transition-all duration-300 hover:bg-gold hover:-translate-y-1',
              showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            )}
            aria-label="Back to top"
          >
            <ChevronUp size={20} />
          </button>
        </div>
      )}
    </Provider>
  );
}
