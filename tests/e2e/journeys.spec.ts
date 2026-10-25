import { test, expect } from '@playwright/test';

test.describe('Algo Observatory — parcours principaux', () => {
  test('accueil affiche le titre et la description', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-title')).toContainText('Algo Observatory');
    await expect(page.getByRole('heading', { name: /Algo Observatory/ })).toBeVisible();
  });

  test('navigation vers Découvrir affiche le parcours algorithme', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Découvrir' }).click();
    await expect(page.getByRole('heading', { name: /Qu'est-ce qu'un algorithme de recommandation/ })).toBeVisible();
  });

  test('navigation vers Laboratoire affiche stratégies et provenance', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Laboratoire' }).click();
    await expect(page.getByTestId('provenance-badge')).toBeVisible();
    await expect(page.getByTestId('strategy-popularity')).toBeVisible();
    await expect(page.getByTestId('strategy-collective')).toBeVisible();
    await expect(page.getByTestId('strategy-diversity')).toBeVisible();
    await expect(page.getByTestId('strategy-hybrid')).toBeVisible();
  });

  test('navigation vers Comprendre les effets affiche les effets', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Effets' }).click();
    await expect(page.getByRole('heading', { name: /Les algorithmes ne sont pas neutres/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Biais de popularité/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Bulle de filtre/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Homogénéité/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Équilibre hybride/ })).toBeVisible();
  });

  test('navigation vers Données affiche le tableau des contenus', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Données' }).click();
    await expect(page.getByRole('heading', { name: /Contenus et métriques/ })).toBeVisible();
    await expect(page.getByRole('cell', { name: /Le Voyage de Chihiro/ })).toBeVisible();
  });

  test('navigation vers Méthodologie affiche provenance et sources', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Méthodologie' }).click();
    await expect(page.getByRole('heading', { name: /Provenance/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Licence/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Tournesol/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Bluesky/ })).toBeVisible();
  });

  test("API Tournesol indisponible affiche une bannière d'erreur explicite", async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Laboratoire' }).click();
    // Le bouton "Données réelles Tournesol (API)" tente l'API réelle (404)
    await page.getByRole('button', { name: /Données réelles Tournesol \(API\)/ }).click();
    await expect(page.getByRole('heading', { name: /Erreur de chargement/ })).toBeVisible();
    await expect(page.getByText(/API Tournesol est indisponible/)).toBeVisible();
  });

  test('retour à l\'accueil depuis n\'importe quelle page fonctionne', async ({ page }) => {
    await page.goto('/effects');
    await page.getByRole('button', { name: 'Accueil' }).click();
    await expect(page.getByTestId('app-title')).toContainText('Algo Observatory');
  });
});
