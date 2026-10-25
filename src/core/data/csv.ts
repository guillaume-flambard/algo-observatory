/**
 * Quotes one CSV field, and neutralizes formulas that spreadsheets may execute
 * when they import user-controlled content (titles, authors, dataset metadata).
 * Numeric measurements remain numeric on import.
 */
export function escapeCsvCell(value: string | number): string {
  const raw = String(value);
  const text = typeof value === 'string' && /^[\s\uFEFF]*[=+\-@]/u.test(raw)
    ? "'" + raw
    : raw;
  return '"' + text.replace(/"/g, '""') + '"';
}
