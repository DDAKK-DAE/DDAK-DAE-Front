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
        <label htmlFor={id} className="text-sm font-semibold text-foreground ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={cn(
            'h-13 w-full rounded-3xl bg-elevated text-foreground text-base shadow-sm',
            'border border-border placeholder:text-subtle',
            'focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10',
            'transition-all duration-300 ease-out hover:border-primary/50',
            leftIcon ? 'pl-12' : 'pl-4',
            rightElement ? 'pr-12' : 'pr-4',
            error && 'border-error/60 focus:border-error focus:ring-error/15 shadow-error/5',
            className,
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <p className="animate-slide-up text-[13px] font-medium text-error ml-1 mt-0.5">{error}</p>
      )}
    </div>
  );
}

