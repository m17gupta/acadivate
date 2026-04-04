import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 1 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-border-light bg-white p-8 shadow-sh-lg"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-crimson-2 text-crimson mb-6">
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-2xl font-black tracking-tight text-navy mb-3">
                {title}
              </h3>
              <p className="text-sm leading-6 text-text-muted mb-8">
                {message}
              </p>

              <div className="flex w-full gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 rounded-2xl h-12 font-bold"
                  onClick={onClose}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="gold"
                  className="flex-1 rounded-2xl h-12 font-bold bg-crimson text-white hover:bg-crimson/90 border-none group"
                  onClick={onConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Deleting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Trash2 size={16} className="transition-transform group-hover:scale-110" />
                       Delete entry
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full p-2 text-text-subtle transition hover:bg-bg-soft hover:text-navy outline-none"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
