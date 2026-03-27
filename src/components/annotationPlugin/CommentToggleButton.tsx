'use client';

import * as React from 'react';
import { MessageSquare, MessageSquareOff } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAnnotatorStore } from './store';

type CommentToggleButtonProps = {
  variant?: 'compact' | 'floating';
  className?: string;
};

export const CommentToggleButton: React.FC<CommentToggleButtonProps> = ({
  variant = 'floating',
  className,
}) => {
  const { annotations, isCommentModeActive, toggleCommentMode } = useAnnotatorStore();

  return (
    <button
      type="button"
      data-annotator-ui="true"
      onClick={(e) => {
        e.stopPropagation();
        toggleCommentMode();
      }}
      aria-pressed={isCommentModeActive}
      aria-label={isCommentModeActive ? 'Hide comments' : 'Show comments'}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200',
        variant === 'compact' ? 'px-3 py-1.5 text-[11px] leading-none' : 'px-4 py-3 text-sm',
        isCommentModeActive
          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 ring-4 ring-slate-200'
          : 'bg-pink-500 text-white shadow-lg shadow-pink-500/25 hover:bg-pink-600 hover:-translate-y-0.5',
        className
      )}
    >
      {isCommentModeActive ? <MessageSquareOff size={variant === 'compact' ? 13 : 16} /> : <MessageSquare size={variant === 'compact' ? 13 : 16} />}
      <span>{isCommentModeActive ? 'Hide Comments' : `Show Comments (${annotations.length})`}</span>
    </button>
  );
};
