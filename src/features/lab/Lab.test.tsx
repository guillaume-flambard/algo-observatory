import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ApiTournesolAdapter } from '@/core/adapters/tournesol-adapter';
import { Lab } from './Lab';

afterEach(() => vi.restoreAllMocks());

describe('Lab', () => {
  it('affiche la provenance de la simulation sans faire passer ces résultats pour réels', () => {
    render(<Lab />);
    expect(screen.getByTestId('provenance-badge')).toHaveTextContent(/données d'exemple — simulation/i);
    expect(screen.getByRole('button', { name: /^Tournesol \(API\)$/i })).toBeInTheDocument();
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

  it('préserve les données simulées si Tournesol est indisponible', async () => {
    vi.spyOn(ApiTournesolAdapter.prototype, 'isAvailable').mockResolvedValue(false);
    render(<Lab />);
    fireEvent.click(screen.getByRole('button', { name: /^Tournesol \(API\)$/i }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/source indisponible/i));
    expect(screen.getByTestId('provenance-badge')).toHaveTextContent(/simulation/i);
    fireEvent.click(screen.getByRole('button', { name: /Utiliser les données d’exemple/i }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
