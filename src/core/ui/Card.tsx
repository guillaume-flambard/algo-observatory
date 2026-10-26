import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'soft';
}

export function Card({
  children,
  className = '',
  padded = true,
  variant = 'default',
}: CardProps) {
  const variants: Record<string, string> = {
    default: 'border border-slate-200 bg-white shadow-sm',
    elevated: 'border border-slate-200 bg-white shadow-lg',
    outlined: 'border-2 border-slate-900 bg-white shadow-sm',
    soft: 'border border-slate-100 bg-slate-50 shadow-none',
  };

  return (
    <section
      className={`rounded-2xl ${variants[variant]} ${padded ? 'p-6' : ''} transition-all duration-200 hover:shadow-lg ${className}`}
    >
      {children}
    </section>
  );
}
