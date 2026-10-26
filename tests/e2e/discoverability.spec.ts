import { expect, test } from '@playwright/test';

// Machine-readable files and link previews: what a search engine, a chat app or a model reads first.
test.describe('Découvrabilité', () => {
  test('llms.txt, llms-full.txt, sitemap, manifeste et images sont servis', async ({ request }) => {
    const files = [
      { path: '/llms.txt', type: 'text/plain', contains: '# Algo Observatory' },
      { path: '/llms-full.txt', type: 'text/plain', contains: 'ODC-BY 1.0' },
      { path: '/sitemap.xml', type: 'xml', contains: '<loc>https://guillaume-flambard.github.io/algo-observatory/</loc>' },
      { path: '/manifest.webmanifest', type: '', contains: '"name": "Algo Observatory"' },
    ];
    for (const file of files) {
      const response = await request.get(file.path);
      expect(response.status(), file.path).toBe(200);
      expect(response.headers()['content-type'] ?? '', file.path).toContain(file.type);
      expect(await response.text(), file.path).toContain(file.contains);
    }
    for (const image of ['/og-image.png', '/apple-touch-icon.png']) {
      const response = await request.get(image);
      expect(response.status(), image).toBe(200);
      expect(response.headers()['content-type'], image).toBe('image/png');
    }
  });

  test('la page porte titre, description, aperçu de partage et données structurées', async ({ page }) => {
    await page.goto('/');
    const meta = (selector: string) => page.locator(selector).first().getAttribute('content');
    expect(await meta('meta[name="description"]')).toBeTruthy();
    expect(await meta('meta[property="og:image"]')).toBe('https://guillaume-flambard.github.io/algo-observatory/og-image.png');
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://guillaume-flambard.github.io/algo-observatory/');
    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
    expect(ld['@type']).toBe('WebApplication');
    expect(ld.license).toBe('https://opensource.org/licenses/MIT');
  });
});
