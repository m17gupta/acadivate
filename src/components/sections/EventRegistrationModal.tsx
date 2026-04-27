'use client';

import React, { useState } from 'react';
import { X, ChevronRight, CheckCircle2 } from 'lucide-react';

type FormField = {
  fieldLabel: string;
  fieldType: string;
  required: boolean;
};

type EventRegistrationModalProps = {
  customForm?: FormField[];
  eventTitle: string;
};

export const EventRegistrationModal = ({ customForm = [], eventTitle }: EventRegistrationModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => setIsSubmitted(false), 500); // Reset after closing
    }, 2000);
  };

  // If no custom form is defined, provide some default fields
  const fieldsToRender = customForm.length > 0 
    ? customForm 
    : [
        { fieldLabel: 'Full Name', fieldType: 'Text', required: true },
        { fieldLabel: 'Email Address', fieldType: 'Email', required: true },
        { fieldLabel: 'Phone Number', fieldType: 'Text', required: false },
      ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-sh-sm transition-all duration-300 text-lg flex items-center justify-center gap-2"
      >
        Register Now <ChevronRight size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm transition-opacity" 
            onClick={() => !isSubmitted && setIsOpen(false)}
          />
          
          <div className="relative bg-white rounded-[2rem] shadow-sh-lg w-full max-w-lg overflow-hidden transform transition-all">
            <div className="p-6 sm:p-8 border-b border-border-light flex items-start justify-between bg-bg-soft">
              <div>
                <h2 className="text-2xl font-extrabold text-navy">Event Registration</h2>
                <p className="text-sm text-text-muted mt-1">{eventTitle}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-border-light flex items-center justify-center text-text-muted hover:text-navy transition-colors"
                disabled={isSubmitted}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-2">Registration Successful!</h3>
                  <p className="text-text-muted">Thank you for registering. We look forward to seeing you at the event.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {fieldsToRender.map((field, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <label className="block text-sm font-bold text-navy">
                        {field.fieldLabel} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.fieldType.toLowerCase() === 'textarea' ? (
                        <textarea 
                          required={field.required}
                          className="w-full bg-app-bg border border-border-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                          placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
                        />
                      ) : (
                        <input 
                          type={field.fieldType.toLowerCase() === 'email' ? 'email' : 'text'}
                          required={field.required}
                          className="w-full bg-app-bg border border-border-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                          placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4 mt-6 border-t border-border-light">
                    <button 
                      type="submit"
                      className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-3.5 rounded-xl shadow-sh-sm transition-colors text-base"
                    >
                      Complete Registration
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
