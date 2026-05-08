'use client';

import { useEffect, type ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative w-full max-w-lg rounded-t-3xl bg-surface p-6 sm:rounded-3xl',
          'animate-slide-up sm:animate-scale-in',
          className,
        )}
      >
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
        )}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-muted hover:text-foreground"
          aria-label="닫기"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
