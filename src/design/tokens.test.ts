import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import tokens from './tokens.json';

describe('design tokens', () => {
  it('keep tokens.css generated from tokens.json', () => {
    expect(() => execFileSync('node', ['scripts/build-tokens.mjs', '--check'], { stdio: 'pipe' })).not.toThrow();
  });

  it('carry a usage note on every colour', () => {
    expect(tokens.color.tokens.filter((token) => !token.usage)).toEqual([]);
  });
});
