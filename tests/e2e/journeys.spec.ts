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
    await expect(page.getByText('0 / 8 positions modifiées')).toBeVisible();
    await slider.fill('100');
    await expect(slider).toHaveValue('100');
    await expect(page.getByText('0 / 8 positions modifiées')).toHaveCount(0);
    const mobileLedger = page.locator('.ao-mobile-rank-list');
    const item = await mobileLedger.isVisible()
      ? mobileLedger.locator('button').filter({ hasText: 'Parasite' }).first()
      : page.locator('.ao-rank-origin').getByRole('button', { name: /Parasite/i }).first();
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
    await expect(page.getByTestId('strategy-diversity')).toHaveAttribute('aria-pressed', 'true');
    const ledger = page.getByRole('list', { name: /Classement Diversité/ }).filter({ visible: true });
    await expect(ledger).toBeVisible();
    await ledger.getByRole('button').first().click();
    await expect(page.getByRole('complementary', { name: 'Contenu suivi' })).toContainText(/rang \d+ avec Popularité, rang 1 avec Diversité/);
    await page.getByLabel(/comparer avec/i).selectOption('collective');
    await expect(page.getByRole('list', { name: /comparé à Score collectif/ }).filter({ visible: true })).toBeVisible();
    await page.getByTestId('strategy-hybrid').click();
    await expect(page.getByLabel('Poids popularité')).toBeVisible();
    await page.getByLabel('Poids popularité').press('End');
    await expect(page.locator('output[for="hybrid-w_popularity"]')).toHaveText('100%');
    await expect(page.getByRole('heading', { name: /Ce que la règle change/ })).toBeVisible();
  });

  test('avec mouvement réduit, le classement se met à jour sans animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#/lab');
    await page.getByLabel('Poids popularité').fill('0');
    await page.getByLabel('Poids score collectif').fill('0');
    await page.getByLabel('Poids diversité').fill('1');
    // No tween: the first visible row is already the final rank-1 item.
    const ledger = page.getByRole('list', { name: /Classement Hybride/ }).filter({ visible: true });
    const first = ledger.locator('li').filter({ has: page.getByRole('button') }).first();
    const positions = await ledger.locator('li').evaluateAll((rows) => rows.map((row) => (row as HTMLElement).style.transform));
    expect(positions.every((value) => /translateY\((0|\d+)px\)/.test(value) && Number(value.match(/-?\d+(\.\d+)?/)![0]) % 4 === 0)).toBeTruthy();
    await expect(first).toContainText('Portrait de la jeune fille en feu');
  });

  test('le catalogue public Tournesol est utilisable sans accès API direct', async ({ page }) => {
    await page.route('https://api.tournesol.app/**', (route) => route.abort());
    await page.goto('/');
    await navigate(page, 'Laboratoire');
    await page.getByRole('button', { name: /Tournesol, données publiques/i }).click();
    await expect(page.getByTestId('provenance-badge')).toContainText('Données réelles');
    await expect(page.getByText(/24 contenus/).first()).toBeVisible();
    await page.getByText('Voir la provenance').click();
    await expect(page.getByText(/transformation|transformés|transformées/i).first()).toBeVisible();
    await navigate(page, 'Données');
    await expect(page.locator('tbody tr')).toHaveCount(24);
    if (await page.locator('.dw-mobile-results').isVisible()) {
      await expect(page.locator('.dw-mobile-item').filter({ hasText: /Les milliardaires, compatibles avec la démocratie/i })).toBeVisible();
    } else {
      await expect(page.getByRole('cell', { name: /Les milliardaires, compatibles avec la démocratie/i })).toBeVisible();
    }
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
    if (await page.locator('.dw-mobile-results').isVisible()) {
      await expect(page.locator('.dw-mobile-item').filter({ hasText: /Le Voyage de Chihiro/ })).toBeVisible();
    } else {
      await expect(page.getByRole('cell', { name: /Le Voyage de Chihiro/ })).toBeVisible();
    }
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Exporter CSV/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/algo-observatory-.*\.csv/);
    await page.getByRole('button', { name: /Effacer les filtres/i }).click();
    await expect(page.locator('tbody tr')).toHaveCount(8);
  });

  test('les sources publiques sont accessibles directement depuis Données', async ({ page }) => {
    await page.goto('/');
    await navigate(page, 'Données');
    const publicSource = page.getByRole('button', { name: /Tournesol 24 contenus/i });
    await publicSource.click();
    await expect(publicSource).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('Source publique datée')).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(24);
    await page.getByRole('button', { name: /Jeu d’exemple 8 contenus/i }).click();
    await expect(page.locator('tbody tr')).toHaveCount(8);
    await expect(page.getByText('Simulation pédagogique')).toBeVisible();
  });

  test('l’inspecteur montre le détail et les rangs calculés d’un contenu', async ({ page }) => {
    await page.goto('/');
    await navigate(page, 'Données');
    await expect(page.getByRole('heading', { name: /Contenus et métriques/i })).toBeVisible();
    const mobile = await page.locator('.dw-mobile-results').isVisible();
    const item = mobile
      ? page.locator('.dw-mobile-item-heading').filter({ hasText: 'Parasite' })
      : page.locator('.dw-name button').filter({ hasText: 'Parasite' });
    await item.click();
    if (await page.locator('.dw-mobile-results').isVisible()) {
      await expect(page.locator('.dw-mobile-detail')).toContainText('Rangs calculés par stratégie');
      await expect(page.locator('.dw-mobile-item.is-selected')).toContainText('Parasite');
    } else {
      await expect(page.getByRole('complementary', { name: /Inspecter le contenu sélectionné/i })).toContainText('Parasite');
      await expect(page.getByText('Rangs calculés par l’application')).toBeVisible();
    }
    await expect(page.getByRole('button', { name: /Comparer dans le laboratoire/i })).toBeVisible();
  });

  test('la méthodologie explique les provenances et les limites', async ({ page }) => {
    await page.goto('/');
    await navigate(page, 'Méthodologie');
    for (const title of ['Provenance', 'Licence', 'Tournesol', 'Bluesky']) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }
    await expect(page.getByText(/n’observe actuellement ni flux Bluesky/i)).toBeVisible();
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
    await navigate(page, 'Données');
    await expect(page.getByRole('heading', { name: /Contenus et métriques/i })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('data-workbench.png'), fullPage: true });
    await navigate(page, 'Méthodologie');
    await expect(page.getByRole('heading', { name: /Les résultats comptent/i })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('methodology.png'), fullPage: true });
  });
});
