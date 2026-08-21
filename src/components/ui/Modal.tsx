import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative w-full bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl z-10 overflow-hidden my-8',
          maxWidths[maxWidth]
        )}
      >
        {(title || description) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a]">
            <div>
              {title && <h3 className="text-base font-bold text-[#fafafa]">{title}</h3>}
              {description && <p className="text-xs text-[#a1a1aa] mt-0.5">{description}</p>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-[#fafafa]"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
