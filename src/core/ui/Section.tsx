import type { ReactNode } from 'react';

interface SectionProps {
  children?: ReactNode;
  title?: string;
  description?: string;
  eyebrow?: string;
  className?: string;
}

export function Section({
  children,
  title,
  description,
  eyebrow,
  className = '',
}: SectionProps) {
  return (
    <section className={className}>
      <div className="mb-8">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-4 block">
            {eyebrow}
          </span>
        )}
        {title && <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-balance mb-2">{title}</h2>}
        {description && (
          <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-2xl">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}
