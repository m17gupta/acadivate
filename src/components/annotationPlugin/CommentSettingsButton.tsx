'use client';

import * as React from 'react';
import { Settings2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAnnotatorStore } from './store';

type CommentSettingsButtonProps = {
  className?: string;
};

export const CommentSettingsButton: React.FC<CommentSettingsButtonProps> = ({
  className,
}) => {
  const { isCommentModeActive, isSettingsOpen, toggleSettingsOpen } = useAnnotatorStore();

  if (!isCommentModeActive) {
    return null;
  }

  return (
    <button
      type="button"
      data-annotator-ui="true"
      onClick={(e) => {
        e.stopPropagation();
        toggleSettingsOpen();
      }}
      aria-pressed={isSettingsOpen}
      aria-label="Plugin settings"
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
        isSettingsOpen
          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 ring-4 ring-slate-200'
          : 'bg-white text-slate-600 shadow-lg shadow-black/10 hover:bg-slate-50',
        className
      )}
    >
      <Settings2 size={16} />
    </button>
  );
};
