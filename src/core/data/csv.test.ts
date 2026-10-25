import { describe, expect, it } from 'vitest';
import { escapeCsvCell } from './csv';

describe('CSV export hardening', () => {
  it('escapes separators and quotes without changing ordinary text', () => {
    expect(escapeCsvCell('Bonjour; "monde"')).toBe('"Bonjour; ""monde"""');
  });

  it('prevents spreadsheet formula execution in textual sources', () => {
    expect(escapeCsvCell('=HYPERLINK("https://example.test")')).toBe(
      '"\'=HYPERLINK(""https://example.test"")"',
    );
    expect(escapeCsvCell('  @SUM(1,2)')).toBe('"\'  @SUM(1,2)"');
    expect(escapeCsvCell('\n+cmd')).toBe('"\'\n+cmd"');
  });

  it('keeps numeric metrics usable by spreadsheets', () => {
    expect(escapeCsvCell(0.85)).toBe('"0.85"');
    expect(escapeCsvCell(-4)).toBe('"-4"');
  });
});
