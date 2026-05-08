'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  maxHeight?: number;
}

export function Select({ value, onChange, options, placeholder = '선택...', className, maxHeight = 220 }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center justify-between rounded-3xl border bg-surface px-4 py-3 text-sm transition-colors',
          open ? 'border-primary ring-4 ring-primary/10' : 'border-border hover:border-border/60',
          selected ? 'text-foreground' : 'text-subtle',
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-black/20"
        >
          <ul
            className="overflow-y-auto py-1"
            style={{ maxHeight }}
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={cn(
                    'flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors',
                    opt.value === value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-background',
                  )}
                >
                  {opt.label}
                  {opt.value === value && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
