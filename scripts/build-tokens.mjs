// Compiles src/design/tokens.json (the design system's single source, also
// published as the Algo Observatory design-system artifact) into CSS custom
// properties. Run after editing tokens.json: node scripts/build-tokens.mjs
// With --check, fails when tokens.css is out of date (used by the unit tests).
import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import console from 'node:console';
import { URL } from 'node:url';

const source = new URL('../src/design/tokens.json', import.meta.url);
const target = new URL('../src/design/tokens.css', import.meta.url);
const tokens = JSON.parse(readFileSync(source, 'utf8'));

const lines = ['/* Algo Observatory — generated from tokens.json by scripts/build-tokens.mjs. Do not edit. */'];

for (const font of tokens.type.fonts) {
  const file = font.file.replace(/^fonts\//, './fonts/');
  lines.push(
    `@font-face { font-family: "${font.family}"; src: url("${file}") format("woff2"); font-weight: ${font.weight}; font-style: ${font.style ?? 'normal'}; font-display: swap; }`,
  );
}

const vars = [];
for (const token of tokens.color.tokens) vars.push(`  --${token.name}: ${token.value};`);
for (const [key, stack] of Object.entries(tokens.type.families)) vars.push(`  --font-${key}: ${stack};`);
for (const family of ['spacing', 'radius', 'shadow', 'size', 'duration']) {
  for (const token of tokens[family]?.tokens ?? []) vars.push(`  --${token.name}: ${token.value};`);
}
lines.push(':root {', ...vars, '}');

// One utility class per type style, named like the token (.t-display, .t-data…).
for (const group of tokens.type.groups) {
  for (const style of group.styles) {
    const family = style.family ?? group.family;
    const rules = [
      `font-family: var(--font-${family})`,
      `font-size: ${style.fontSize}`,
      `line-height: ${style.lineHeight}`,
      `font-weight: ${style.fontWeight}`,
    ];
    if (style.letterSpacing) rules.push(`letter-spacing: ${style.letterSpacing}`);
    if (family === 'mono') rules.push('font-variant-numeric: tabular-nums');
    lines.push(`.t-${style.name} { ${rules.join('; ')}; }`);
  }
}

const css = lines.join('\n') + '\n';
if (process.argv.includes('--check')) {
  const current = readFileSync(target, 'utf8');
  if (current !== css) {
    console.error('src/design/tokens.css is out of date: run node scripts/build-tokens.mjs');
    process.exit(1);
  }
  console.log('tokens.css is up to date');
} else {
  writeFileSync(target, css);
  console.log('wrote src/design/tokens.css');
}
