import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Home } from './Home';

describe('The Ranking Machine — accueil interactif', () => {
  it('affiche un dispositif pédagogique sourcé comme simulation', () => {
    render(<Home onNavigate={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /Qui décide ce que vous voyez/i })).toBeInTheDocument();
    expect(screen.getByText(/entièrement simulé/i)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Machine interactive de classement/i })).toBeInTheDocument();
    expect(screen.getByTestId('hero-algorithm-weight')).toHaveValue('65');
  });

  it('recalcule le classement et met à jour les positions sans changer le catalogue', () => {
    render(<Home onNavigate={vi.fn()} />);
    const slider = screen.getByRole('slider', { name: /Influence du score collectif/i });
    fireEvent.change(slider, { target: { value: '0' } });
    expect(screen.getByText('0 / 8 POSITIONS MODIFIÉES')).toBeInTheDocument();
    fireEvent.change(slider, { target: { value: '100' } });
    expect(screen.getByText(/8 POSITIONS MODIFIÉES/i).textContent).not.toBe('0 / 8 POSITIONS MODIFIÉES');
    const comparison = screen.getByRole('region', { name: /Machine interactive de classement/i });
    expect(comparison.querySelectorAll('.ao-rank-row')).toHaveLength(16);
  });

  it('permet de suivre un titre par clavier et explique son déplacement', () => {
    render(<Home onNavigate={vi.fn()} />);
    const choice = screen.getAllByRole('button', { name: /^\d{2} Parasite$/i })[0]!;
    fireEvent.click(choice);
    expect(choice).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Parasite', { selector: '.ao-readout-label strong' })).toBeInTheDocument();
    expect(screen.getByText(/\d+ → \d+/, { selector: '.ao-readout-delta small' })).toBeInTheDocument();
  });

  it('garde un accès direct au laboratoire et au contexte pédagogique', () => {
    const onNavigate = vi.fn();
    render(<Home onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole('button', { name: /Lancer une expérience/i }));
    expect(onNavigate).toHaveBeenCalledWith('lab');
    fireEvent.click(screen.getByRole('button', { name: /Comprendre le sujet/i }));
    expect(onNavigate).toHaveBeenCalledWith('discover');
  });
});
