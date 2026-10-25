import type { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  dataTestid?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  dataTestid,
  ...props
}: ButtonProps) {
  const base =
    'rounded-lg font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants: Record<string, string> = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900',
    secondary:
      'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-300',
    ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-200',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-500',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
  };

  return (
    <button
      data-testid={dataTestid}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
