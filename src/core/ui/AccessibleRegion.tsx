import type { ReactNode } from 'react';

interface AccessibleRegionProps {
  'aria-label': string;
  children: ReactNode;
}

export function AccessibleRegion({ 'aria-label': ariaLabel, children }: AccessibleRegionProps) {
  return (
    <section aria-label={ariaLabel}>
      {children}
    </section>
  );
}
