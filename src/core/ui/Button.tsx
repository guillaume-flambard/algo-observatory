import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline-accent';
  size?: 'sm' | 'md' | 'lg';
  dataTestid?: string;
  trailingIcon?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  dataTestid,
  trailingIcon = false,
  ...props
}: ButtonProps) {
  const base =
    'rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2';

  const variants: Record<string, string> = {
    primary:
      'bg-slate-900 text-white focus:ring-slate-900 shadow-sm hover:shadow-md',
    secondary:
      'bg-white text-slate-700 border border-slate-200 focus:ring-slate-300 shadow-sm hover:shadow-sm',
    ghost:
      'text-slate-600 hover:bg-slate-100 focus:ring-slate-200',
    danger:
      'bg-red-50 text-red-700 border border-red-100 focus:ring-red-500 shadow-sm hover:bg-red-100',
    'outline-accent':
      'border-2 border-slate-900 text-slate-900 bg-white focus:ring-slate-900 shadow-sm hover:bg-slate-900 hover:text-white',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      data-testid={dataTestid}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {trailingIcon && (
        <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </button>
  );
}
