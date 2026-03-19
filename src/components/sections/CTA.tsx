'use client';

import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import Link from 'next/link';

export const CTA = () => {
  return (
    <section className="py-24 bg-linear-to-r from-primary-deep via-primary-dark to-primary relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_65%_75%_at_88%_50%,rgba(197,147,58,0.1)_0%,transparent_65%)]" />
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <div className="text-[10px] font-bold tracking-[3px] uppercase text-white/60 mb-6">
          Global Academic Platform
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6">
          Ready to Grow Your<br /><em className="shim">Research Impact?</em>
        </h2>
        <p className="text-lg text-white/50 leading-relaxed mb-10">
          Join a global network of researchers, institutions, and conferences. Publish, collaborate, and gain international recognition.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/apply">
            <Button variant="primary" size="md">
              <FileText size={18} /> Apply Now
            </Button>
          </Link>
          <Link href="/partnership">
            <Button variant="outline" size="md" className=" bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10">
              Partner With Us
            </Button>
          </Link>

        </div>
      </div>
    </section>
  );
};
