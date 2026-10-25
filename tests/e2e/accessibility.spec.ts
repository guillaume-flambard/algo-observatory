import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  { hash: '/home', name: 'Accueil' },
  { hash: '/discover', name: 'Découvrir' },
  { hash: '/lab', name: 'Laboratoire' },
  { hash: '/effects', name: 'Effets' },
  { hash: '/explore', name: 'Données' },
  { hash: '/methodology', name: 'Méthodologie' },
];

test.describe('Accessibilité des six espaces', () => {
  for (const route of routes) {
    test(route.name + ' : aucun problème WCAG grave détectable automatiquement', async ({ page }) => {
      await page.goto('/#' + route.hash);
      await expect(page.locator('main')).toBeVisible();
      const report = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      const blocking = report.violations.filter((violation) =>
        violation.impact === 'critical' || violation.impact === 'serious',
      );
      const details = blocking.map((violation) =>
        violation.id + ' (' + violation.impact + '): ' +
        violation.nodes.map((node) => node.target.join(' ')).join(', '),
      ).join('\n');
      expect(blocking, details || 'No critical/serious violations').toEqual([]);
    });
  }
});
