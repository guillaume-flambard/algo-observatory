import { useEffect, useRef, useState } from 'react';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Animates numeric positions (one per item id) towards their targets.
 * Rows and slopegraph paths read the same values, so a row and its path
 * always travel together. Under reduced motion values jump immediately.
 */
export function useTweenedPositions(targets: Record<string, number>, duration = 340): Record<string, number> {
  const [values, setValues] = useState(targets);
  const current = useRef(targets);
  const frame = useRef<number | null>(null);
  const key = JSON.stringify(targets);

  useEffect(() => {
    const goal = JSON.parse(key) as Record<string, number>;
    const start = { ...current.current };
    if (frame.current !== null) cancelAnimationFrame(frame.current);

    const settle = () => {
      current.current = goal;
      setValues(goal);
    };
    if (prefersReducedMotion() || typeof requestAnimationFrame !== 'function') {
      settle();
      return;
    }

    const began = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - began) / duration);
      const eased = easeOut(progress);
      const next: Record<string, number> = {};
      for (const [id, to] of Object.entries(goal)) {
        const from = start[id] ?? to;
        next[id] = from + (to - from) * eased;
      }
      current.current = next;
      setValues(next);
      frame.current = progress < 1 ? requestAnimationFrame(step) : null;
    };
    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [key, duration]);

  return values;
}
