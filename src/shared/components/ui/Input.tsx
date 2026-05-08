'use client';

import { type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export function Input({ label, error, leftIcon, rightElement, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={cn(
            'h-12 w-full rounded-xl bg-elevated text-foreground',
            'border border-border placeholder:text-subtle',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            'transition-all duration-200',
            leftIcon ? 'pl-11' : 'pl-4',
            rightElement ? 'pr-11' : 'pr-4',
            error && 'border-error/50 focus:border-error focus:ring-error/15',
            className,
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <p className="animate-fade-in text-sm text-error">{error}</p>
      )}
    </div>
  );
}
