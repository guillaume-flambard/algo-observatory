import { describe, expect, it } from 'vitest';
import tokens from './tokens.json';
import css from './tokens.css?raw';

describe('design tokens', () => {
  it('keep tokens.css generated from tokens.json (run node scripts/build-tokens.mjs)', () => {
    const declared = [
      ...tokens.color.tokens,
      ...tokens.spacing.tokens,
      ...tokens.radius.tokens,
      ...tokens.shadow.tokens,
      ...tokens.size.tokens,
      ...tokens.duration.tokens,
    ];
    for (const token of declared) expect(css).toContain(`--${token.name}: ${token.value};`);
    for (const font of tokens.type.fonts) expect(css).toContain(font.file.replace(/^fonts\//, './fonts/'));
    for (const group of tokens.type.groups) {
      for (const style of group.styles) expect(css).toContain(`.t-${style.name} {`);
    }
  });

  it('carry a usage note on every colour', () => {
    expect(tokens.color.tokens.filter((token) => !token.usage)).toEqual([]);
  });
});
