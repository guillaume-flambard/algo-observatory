import type { ReactNode } from 'react';

interface SectionProps {
  children?: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function Section({
  children,
  title,
  description,
  className = '',
}: SectionProps) {
  return (
    <section className={className}>
      {title || description ? (
        <div className="mb-5">
          {title && (
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          )}
        </div>
      ) : null}
      <div>{children}</div>
    </section>
  );
}
