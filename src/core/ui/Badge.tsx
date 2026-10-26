import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'example' | 'real' | 'neutral' | 'accent' | 'danger';
  className?: string;
  dataTestid?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  className = '',
  dataTestid,
}: BadgeProps) {
  const variants: Record<string, string> = {
    example:
      'bg-amber-50 text-amber-800 border border-amber-200 shadow-sm',
    real:
      'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm',
    neutral:
      'bg-slate-100 text-slate-700 border border-slate-200 shadow-sm',
    accent:
      'bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-sm',
    danger:
      'bg-red-50 text-red-800 border border-red-200 shadow-sm',
  };

  return (
    <span
      data-testid={dataTestid}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
