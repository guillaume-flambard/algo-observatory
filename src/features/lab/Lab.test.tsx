import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Lab } from './Lab';

describe('Lab', () => {
  it('affiche la provenance de la simulation sans faire passer ces résultats pour réels', () => {
    render(<Lab />);
    expect(screen.getByTestId('provenance-badge')).toHaveTextContent(/données d'exemple — simulation/i);
    expect(screen.getByRole('button', { name: /Tournesol · données publiques/i })).toBeInTheDocument();
    expect(screen.getByText(/valeurs utilisées ici sont entièrement simulées/i)).toBeInTheDocument();
  });

  it('propose quatre stratégies et affiche une comparaison de rangs', () => {
    render(<Lab />);
    for (const id of ['popularity', 'collective', 'diversity', 'hybrid']) {
      expect(screen.getByTestId('strategy-' + id)).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { name: /Comment les positions changent/i })).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('strategy-diversity'));
    expect(screen.getByTestId('strategy-diversity')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('option', { name: 'Diversité' })).toBeInTheDocument();
  });

  it('charge les 24 recommandations publiques et revient à la simulation', async () => {
    render(<Lab />);
    fireEvent.click(screen.getByRole('button', { name: /Tournesol · données publiques/i }));
    await waitFor(() => expect(screen.getByTestId('provenance-badge')).toHaveTextContent('Données réelles'));
    expect(screen.getAllByText(/24 contenus/).length).toBeGreaterThan(0);
    expect(screen.getByText(/score collectif et diversité-inclusion/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Données d’exemple/i }));
    expect(screen.getByTestId('provenance-badge')).toHaveTextContent(/simulation/i);
  });
});
