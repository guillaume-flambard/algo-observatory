import { expect, test } from '@playwright/test';

async function navigate(page: import('@playwright/test').Page, label: string) {
  const menu = page.getByRole('button', { name: 'Ouvrir le menu' });
  if (await menu.isVisible()) {
    await menu.click();
    await page.getByRole('navigation', { name: 'Navigation mobile' }).getByRole('button', { name: label }).click();
  } else {
    await page.getByRole('navigation', { name: 'Navigation principale' }).getByRole('button', { name: label }).click();
  }
}

test.describe('Algo Observatory — expériences réelles des visiteurs', () => {
  test('l’accueil explique le projet et permet de lancer l’expérience', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-title')).toContainText('Algo Observatory');
    await expect(page.getByRole('heading', { name: /Qui décide/i })).toBeVisible();
    await expect(page.getByText(/entièrement simulé/i)).toBeVisible();
    await page.getByRole('button', { name: /Lancer une expérience/i }).click();
    await expect(page.getByRole('heading', { name: /Même contenu/i })).toBeVisible();
    await expect(page.getByTestId('provenance-badge')).toContainText('simulation');
  });

  test('la machine de classement réagit réellement au réglage, sur clavier et tactile', async ({ page }) => {
    await page.goto('/');
    const slider = page.getByRole('slider', { name: /Influence du score collectif/i });
    await expect(slider).toHaveValue('65');
    await slider.fill('0');
    await expect(page.getByText('0 / 8 POSITIONS MODIFIÉES')).toBeVisible();
    await slider.fill('100');
    await expect(slider).toHaveValue('100');
    await expect(page.getByText('0 / 8 POSITIONS MODIFIÉES')).toHaveCount(0);
    const mobileLedger = page.locator('.ao-mobile-rank-list');
    const item = await mobileLedger.isVisible()
      ? mobileLedger.locator('button').filter({ hasText: 'Parasite' }).first()
      : page.getByRole('button', { name: /Suivre Parasite dans les deux classements/i }).first();
    await item.click();
    await expect(item).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.ao-readout-label strong')).toHaveText('Parasite');
    const currentRank = await page.locator('.ao-readout-delta small').textContent();
    expect(currentRank).toMatch(/^\d+ → \d+$/);
    await expect.poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    ).toBeTruthy();
  });

  test('l’explication mène au laboratoire', async ({ page }) => {
    await page.goto('/');
    await navigate(page, 'Découvrir');
    await expect(page.getByRole('heading', { name: /Derrière chaque fil/i })).toBeVisible();
    await page.getByRole('button', { name: /Ouvrir le laboratoire/i }).click();
    await expect(page.getByRole('heading', { name: /Les classements, face à face/i })).toBeVisible();
  });

  test('les quatre stratégies et les trajectoires sont manipulables', async ({ page }) => {
    await page.goto('/');
    await navigate(page, 'Laboratoire');
    await expect(page.getByTestId('provenance-badge')).toBeVisible();
    for (const id of ['popularity', 'collective', 'diversity', 'hybrid']) {
      await expect(page.getByTestId('strategy-' + id)).toBeVisible();
    }
    await expect(page.getByRole('heading', { name: /Comment les positions changent/i })).toBeVisible();
    await page.getByTestId('strategy-diversity').click();
    await page.getByLabel('Comparer avec').selectOption('diversity');
    const flow = page.getByLabel(/Évolution des rangs/);
    if (await flow.isVisible()) {
      await expect(flow).toBeVisible();
    } else {
      await expect(page.getByText(/Évolution par contenu/i)).toBeVisible();
      await expect(page.getByText(/rang 1 avec Popularité/i)).toBeVisible();
    }
    await page.getByTestId('strategy-hybrid').click();
    await expect(page.getByLabel('Poids popularité')).toBeVisible();
    await page.getByLabel('Poids popularité').press('End');
    await expect(page.locator('output[for="hybrid-w_popularity"]')).toHaveText('100%');
  });

  test('le catalogue public Tournesol est utilisable sans accès API direct', async ({ page }) => {
    await page.route('https://api.tournesol.app/**', (route) => route.abort());
    await page.goto('/');
    await navigate(page, 'Laboratoire');
    await page.getByRole('button', { name: /Tournesol · données publiques/i }).click();
    await expect(page.getByTestId('provenance-badge')).toContainText('Données réelles');
    await expect(page.getByText(/24 contenus/).first()).toBeVisible();
    await page.getByText('Voir la provenance').click();
    await expect(page.getByText(/transformation|transformés|transformées/i).first()).toBeVisible();
    await navigate(page, 'Données');
    await expect(page.locator('tbody tr')).toHaveCount(24);
    await expect(page.getByRole('cell', { name: /Les milliardaires, compatibles avec la démocratie/i })).toBeVisible();
  });

  test('la page effets ne confond pas les hypothèses et les preuves', async ({ page }) => {
    await page.goto('/');
    await navigate(page, 'Effets');
    await expect(page.getByRole('heading', { name: /Les algorithmes ne sont pas neutres/i })).toBeVisible();
    for (const title of ['Biais de popularité', 'Bulle de filtre', 'Homogénéité', 'Équilibre hybride']) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }
    await expect(page.getByText(/Ce laboratoire ne mesure donc pas l’existence d’une bulle de filtre/i)).toBeVisible();
  });

  test('les données sont filtrables, triables et exportables', async ({ page }) => {
    await page.goto('/');
    await navigate(page, 'Données');
    await expect(page.getByRole('heading', { name: /Contenus et métriques/i })).toBeVisible();
    await page.getByRole('searchbox', { name: 'Rechercher un contenu' }).fill('Chihiro');
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.getByRole('cell', { name: /Le Voyage de Chihiro/ })).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Exporter CSV/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/algo-observatory-.*\.csv/);
    await page.getByRole('button', { name: /Effacer les filtres/i }).click();
    await expect(page.locator('tbody tr')).toHaveCount(8);
  });

  test('la méthodologie explique les provenances et les limites', async ({ page }) => {
    await page.goto('/');
    await navigate(page, 'Méthodologie');
    for (const title of ['Provenance', 'Licence', 'Tournesol', 'Bluesky']) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }
    await expect(page.getByText(/Aucune intégration Bluesky n’est opérationnelle/i)).toBeVisible();
  });

  test('navigation directe et retour dans l’historique', async ({ page }) => {
    await page.goto('/#/effects');
    await expect(page.getByRole('heading', { name: /Les algorithmes ne sont pas neutres/i })).toBeVisible();
    await navigate(page, 'Accueil');
    await expect(page.getByRole('heading', { name: /Qui décide/i })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole('heading', { name: /Les algorithmes ne sont pas neutres/i })).toBeVisible();
  });


  test('une nouvelle vue reprend en haut, même après une longue lecture', async ({ page }) => {
    await page.goto('/#/methodology');
    await expect(page.getByRole('heading', { name: /Les résultats comptent/i })).toBeVisible();
    await page.evaluate(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
    });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
    await navigate(page, 'Laboratoire');
    await expect(page.getByRole('heading', { name: /Même contenu/i })).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  });

  test('aucun débordement horizontal global sur l’appareil', async ({ page }, testInfo) => {
    await page.goto('/');
    const views = ['Accueil', 'Découvrir', 'Laboratoire', 'Effets', 'Données', 'Méthodologie'];
    for (const label of views) {
      await navigate(page, label);
      await expect.poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
      ).toBeTruthy();
    }
    await navigate(page, 'Accueil');
    await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: true });
    await navigate(page, 'Laboratoire');
    await page.screenshot({ path: testInfo.outputPath('laboratory.png'), fullPage: true });
  });
});
