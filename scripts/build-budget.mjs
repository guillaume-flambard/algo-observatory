import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = new URL('../dist/', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const entry = html.match(/<script[^>]+src="\/([^"]+\.js)"/)?.[1];
const stylesheet = html.match(/<link[^>]+href="\/([^"]+\.css)"/)?.[1];
if (!entry || !stylesheet) {
  throw new Error('Production entry JS or stylesheet not found in dist/index.html.');
}

const budgets = [
  { name: 'Entrypoint JS (gzip)', path: entry, limit: 100_000 },
  { name: 'Styles (gzip)', path: stylesheet, limit: 12_000 },
];
let failed = false;
for (const item of budgets) {
  const bytes = gzipSync(readFileSync(join(root.pathname, item.path))).byteLength;
  const percent = Math.round((bytes / item.limit) * 100);
  console.log(item.name + ': ' + (bytes / 1000).toFixed(1) + ' kB / ' +
    (item.limit / 1000).toFixed(0) + ' kB (' + percent + '% of budget)');
  if (bytes > item.limit) failed = true;
}
if (failed) {
  console.error('The initial route exceeds the frontend download budget.');
  process.exitCode = 1;
}
