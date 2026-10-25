import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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
});
