import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ApiTournesolAdapter } from '@/core/adapters/tournesol-adapter';
import type { TournesolDataset } from '@/core/domain/tournesol-types';
import { App } from './App';

beforeEach(() => {
  window.location.hash = '';
});
afterEach(() => vi.restoreAllMocks());

describe('Algo Observatory navigation', () => {
  it('affiche la marque et une page d’accueil compréhensible', () => {
    render(<App />);
    expect(screen.getByTestId('app-title')).toHaveTextContent('Algo Observatory');
    expect(screen.getByRole('heading', { name: /Qui décide/i })).toBeInTheDocument();
  });

  it('ouvre le laboratoire depuis le CTA principal et signale la simulation', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Lancer une expérience/i }));
    expect(screen.getByRole('heading', { name: /Même contenu/i })).toBeInTheDocument();
    expect(screen.getByTestId('provenance-badge')).toHaveTextContent(/simulation/i);
  });

  it('lie le parcours de découverte au laboratoire', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Comprendre le sujet/i }));
    expect(screen.getByRole('heading', { name: /Derrière chaque fil/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Ouvrir le laboratoire/i }));
    expect(screen.getByRole('heading', { name: /Les classements, face à face/i })).toBeInTheDocument();
  });

  it('conserve les six espaces et leur navigation sur petit écran', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }));
    expect(screen.getByRole('navigation', { name: 'Navigation mobile' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('navigation', { name: 'Navigation mobile' }).querySelectorAll('button')[3]!);
    expect(screen.getByRole('heading', { name: /Les algorithmes ne sont pas neutres/i })).toBeInTheDocument();
  });
  it('conserve la vue actuelle avec le lien de saut clavier', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Lancer une expérience/i }));
    expect(window.location.hash).toBe('#/lab');
    fireEvent.click(screen.getByRole('link', { name: /Aller au contenu/i }));
    expect(document.activeElement).toBe(document.getElementById('main-content'));
    expect(window.location.hash).toBe('#/lab');
    expect(screen.getByRole('heading', { name: /Même contenu/i })).toBeInTheDocument();
  });

  it('présente dans Données le catalogue chargé depuis le Laboratoire', async () => {
    const observed: TournesolDataset = {
      id: 'observations-fixture', title: 'Observations — fixture de test',
      kind: 'real', source: 'API simulée dans le test', license: 'Licence de test',
      freshness: '2026-10-25', itemCount: 1,
      items: [{
        uid: 'observation-1', title: 'Contenu de test chargé', author: 'Observatoire',
        platform: 'Vidéo', scores: [], collectiveScore: 0.7,
        popularity: 0.8, diversityScore: 0.3, nComparisons: 8,
      }],
    };
    vi.spyOn(ApiTournesolAdapter.prototype, 'isAvailable').mockResolvedValue(true);
    vi.spyOn(ApiTournesolAdapter.prototype, 'getDataset').mockResolvedValue(observed);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Lancer une expérience/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Tournesol \(API\)$/i }));
    await waitFor(() => expect(screen.getByTestId('provenance-badge')).toHaveTextContent('Données réelles'));
    const primaryNav = screen.getByRole('navigation', { name: 'Navigation principale' });
    fireEvent.click(primaryNav.querySelectorAll('button')[4]!);
    expect(screen.getByRole('cell', { name: /Contenu de test chargé/i })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: /Le Voyage de Chihiro/i })).not.toBeInTheDocument();
    expect(screen.getByText('API simulée dans le test')).toBeInTheDocument();
  });

});
