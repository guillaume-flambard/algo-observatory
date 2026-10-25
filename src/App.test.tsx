import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from './App';

beforeEach(() => {
  window.location.hash = '';
});

describe('Algo Observatory navigation', () => {
  it('affiche la marque et une page d’accueil compréhensible', () => {
    render(<App />);
    expect(screen.getByTestId('app-title')).toHaveTextContent('Algo Observatory');
    expect(screen.getByRole('heading', { name: /Qui décide/i })).toBeInTheDocument();
  });

  it('ouvre le laboratoire depuis le CTA principal et signale la simulation', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Lancer une expérience/i }));
    expect(await screen.findByRole('heading', { name: /Même contenu/i })).toBeInTheDocument();
    expect(await screen.findByTestId('provenance-badge')).toHaveTextContent(/simulation/i);
  });

  it('lie le parcours de découverte au laboratoire', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Comprendre le sujet/i }));
    expect(await screen.findByRole('heading', { name: /Derrière chaque fil/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Ouvrir le laboratoire/i }));
    expect(await screen.findByRole('heading', { name: /Les classements, face à face/i })).toBeInTheDocument();
  });

  it('conserve les six espaces et leur navigation sur petit écran', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }));
    expect(screen.getByRole('navigation', { name: 'Navigation mobile' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('navigation', { name: 'Navigation mobile' }).querySelectorAll('button')[3]!);
    expect(await screen.findByRole('heading', { name: /Les algorithmes ne sont pas neutres/i })).toBeInTheDocument();
  });
  it('conserve la vue actuelle avec le lien de saut clavier', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Lancer une expérience/i }));
    expect(window.location.hash).toBe('#/lab');
    fireEvent.click(screen.getByRole('link', { name: /Aller au contenu/i }));
    expect(document.activeElement).toBe(document.getElementById('main-content'));
    expect(window.location.hash).toBe('#/lab');
    expect(screen.getByRole('heading', { name: /Même contenu/i })).toBeInTheDocument();
  });

  it('partage les véritables données Tournesol entre laboratoire et explorateur', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Lancer une expérience/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Tournesol · données publiques/i }));
    await waitFor(() => expect(screen.getByTestId('provenance-badge')).toHaveTextContent('Données réelles'));
    const primaryNav = screen.getByRole('navigation', { name: 'Navigation principale' });
    fireEvent.click(primaryNav.querySelectorAll('button')[4]!);
    expect(await screen.findByRole('heading', { name: /Contenus et métriques/i }, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /Les milliardaires, compatibles avec la démocratie/i })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(25);
    expect(screen.getByText('Tournesol — recommandations vidéos')).toBeInTheDocument();
  });
});
