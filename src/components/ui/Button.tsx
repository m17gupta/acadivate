'use client';

import * as React from 'react';
import { cn } from '@/src/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'gold' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-dark shadow-sh-sm ',
      ghost: 'border border-[#d9ece9] text-navy hover:bg-bg-light hover:border-[#0b2f4a]',
      gold: 'bg-gold text-white hover:bg-gold-2 shadow-sh-gold',
      outline: 'border-1.5 border-white/20 text-white hover:bg-white/10',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none py-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
