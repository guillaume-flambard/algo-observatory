import { test, expect } from '@playwright/test';

test.describe('Algo Observatory — parcours principaux', () => {
  test('accueil affiche le titre et la description', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-title')).toContainText('Algo Observatory');
    await expect(page.getByRole('heading', { name: /Algo Observatory/ })).toBeVisible();
  });

  test('navigation vers Découvrir affiche le parcours algorithme', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-decouvrir').click();
    await expect(
      page.getByRole('heading', { name: /Qu'est-ce qu'un algorithme de recommandation/ }),
    ).toBeVisible();
  });

  test('navigation vers Laboratoire affiche stratégies et provenance', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-laboratoire').click();
    await expect(page.getByTestId('provenance-badge')).toBeVisible();
    await expect(page.getByTestId('strategy-popularity')).toBeVisible();
    await expect(page.getByTestId('strategy-collective')).toBeVisible();
    await expect(page.getByTestId('strategy-diversity')).toBeVisible();
    await expect(page.getByTestId('strategy-hybrid')).toBeVisible();
  });

  test('navigation vers Comprendre les effets affiche les effets', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-effets').click();
    await expect(page.getByText(/Les algorithmes ne sont pas neutres/)).toBeVisible();
    await expect(page.getByText(/Biais de popularité/)).toBeVisible();
    await expect(page.getByText(/Bulle de filtre/)).toBeVisible();
    await expect(page.getByText(/Homogénéité/)).toBeVisible();
    await expect(page.getByText(/Équilibre hybride/)).toBeVisible();
  });

  test('navigation vers Données affiche le tableau des contenus', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-donnees').click();
    await expect(page.getByText(/Contenus et métriques/)).toBeVisible();
    await expect(page.getByRole('cell', { name: /Le Voyage de Chihiro/ })).toBeVisible();
  });

  test('navigation vers Méthodologie affiche provenance et sources', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-methodologie').click();
    await expect(page.getByRole('heading', { name: /Provenance/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Licence/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Tournesol/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Bluesky/ })).toBeVisible();
  });

  test("API Tournesol indisponible affiche une bannière d'erreur explicite", async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-laboratoire').click();
    // Le bouton "Données réelles Tournesol (API)" tente l'API réelle (404)
    await page.getByRole('button', { name: /Données réelles Tournesol \(API\)/ }).first().click();
    await expect(page.getByRole('heading', { name: /Erreur de chargement/ })).toBeVisible();
    await expect(page.getByText(/API Tournesol est indisponible/)).toBeVisible();
  });

  test('retour à l\'accueil depuis n\'importe quelle page fonctionne', async ({ page }) => {
    await page.goto('/effects');
    await page.getByTestId('nav-accueil').click();
    await expect(page.getByTestId('app-title')).toContainText('Algo Observatory');
  });
});
