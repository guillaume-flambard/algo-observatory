import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('affiche le titre Algo Observatory', () => {
    render(<App />);
    expect(screen.getByTestId('app-title')).toBeInTheDocument();
  });

  it('permet de naviguer de l’accueil vers le laboratoire', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /lancer une expérience/i }));
    expect(screen.getByRole('heading', { name: /même contenu/i })).toBeInTheDocument();
    expect(screen.getByTestId('provenance-badge')).toHaveTextContent(/simulation/i);
  });

  it('relie la page pédagogique au laboratoire', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /comprendre le sujet/i }));
    expect(screen.getByRole('heading', { name: /derrière chaque fil/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /ouvrir le laboratoire/i }));
    expect(screen.getByRole('heading', { name: /les classements, face à face/i })).toBeInTheDocument();
  });
});
