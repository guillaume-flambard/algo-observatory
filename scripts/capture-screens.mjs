// Captures every route at desktop, tablet and phone widths for visual review.
// Usage: node scripts/capture-screens.mjs <baseUrl> <outDir> [label] [route,route] [desktop,mobile]
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';
import console from 'node:console';
import process from 'node:process';
/* global document */

const [baseUrl = 'http://127.0.0.1:5180', outDir = 'test-results/screens', label = 'shot', only = '', sizes = ''] = process.argv.slice(2);
const routes = only ? only.split(',') : ['home', 'discover', 'lab', 'effects', 'explore', 'methodology'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 900, height: 1100 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const viewport of viewports.filter((entry) => !sizes || sizes.split(',').includes(entry.name))) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.isMobile, hasTouch: viewport.hasTouch, deviceScaleFactor: viewport.deviceScaleFactor ?? 1 });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(baseUrl.replace(/\/$/, '') + '/#/' + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const file = `${outDir}/${label}-${route}-${viewport.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    // Tall pages are also cut into readable tiles.
    const tile = viewport.name === 'mobile' ? 1400 : 1800;
    for (let top = 0, part = 1; height > tile && top < height; top += tile, part += 1) {
      await page.screenshot({ path: file.replace('.png', `-part${part}.png`), fullPage: true, clip: { x: 0, y: top, width: viewport.width, height: Math.min(tile, height - top) } });
    }
    console.log(`${file} height=${height} overflowX=${overflow}`);
  }
  await context.close();
}
await browser.close();
