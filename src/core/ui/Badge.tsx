import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'example' | 'real' | 'neutral';
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
    example: 'bg-amber-100 text-amber-800 border border-amber-200',
    real: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span
      data-testid={dataTestid}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
