'use client';

import { type ButtonHTMLAttributes } from 'react';

import { cn } from '@/shared/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary to-primary-dark text-background font-semibold ' +
    'hover:shadow-[0_0_24px_4px_rgba(5,166,107,0.35)] active:scale-[0.97] transition-shadow',
  secondary: 'bg-secondary text-foreground hover:bg-elevated active:scale-[0.97]',
  ghost:     'bg-transparent text-foreground hover:bg-elevated active:scale-[0.97]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8  px-3 text-sm  rounded-xl',
  md: 'h-12 px-5 text-base rounded-xl',
  lg: 'h-14 px-6 text-lg  rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
