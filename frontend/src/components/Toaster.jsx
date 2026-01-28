import React, { useEffect } from 'react';

/**
 * Toast Component
 * A professional, responsive error notification that vanishes after 10 seconds.
 * [Requirement 2.38, 2.224]
 */
const Toast = ({ title = "Error", message, onClose }) => {
  useEffect(() => {
    // Timer to automatically vanish the toaster in 10s [User Request]
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[var(--color-dark-surface)] border-l-4 border-[var(--color-dark-primary)] p-4 rounded-lg shadow-2xl flex items-start gap-3 border border-[var(--color-dark-border)]">
        
        {/* Error Icon */}
        <div className="mt-0.5 text-[var(--color-dark-primary)]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="text-sm font-bold text-[var(--color-dark-text)] uppercase tracking-wider">
            {title}
          </h3>
          <p className="mt-1 text-xs text-[var(--color-dark-muted)] leading-relaxed">
            {message}
          </p>
        </div>

        {/* Manual Close Button */}
        <button 
          onClick={onClose}
          className="text-[var(--color-dark-muted)] hover:text-[var(--color-dark-text)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;