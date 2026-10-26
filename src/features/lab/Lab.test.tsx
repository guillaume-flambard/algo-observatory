import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Lab } from './Lab';

describe('Lab', () => {
  it('affiche la provenance de la simulation sans faire passer ces résultats pour réels', () => {
    render(<Lab />);
    expect(screen.getByTestId('provenance-badge')).toHaveTextContent(/données d'exemple, simulation/i);
    expect(screen.getByRole('button', { name: /Tournesol, données publiques/i })).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole('button', { name: /Tournesol, données publiques/i }));
    await waitFor(() => expect(screen.getByTestId('provenance-badge')).toHaveTextContent('Données réelles'));
    expect(screen.getAllByText(/24 contenus/).length).toBeGreaterThan(0);
    expect(screen.getByText(/score collectif et diversité-inclusion/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Données d’exemple/i }));
    expect(screen.getByTestId('provenance-badge')).toHaveTextContent(/simulation/i);
  });

  it('réordonne le classement B quand on change un poids, et explique le mouvement', () => {
    render(<Lab />);
    fireEvent.change(screen.getByLabelText('Poids popularité'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Poids score collectif'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Poids diversité'), { target: { value: '1' } });
    const list = screen.getByRole('list', { name: 'Classement Hybride, comparé à Popularité' });
    // Highest diversity score in the example catalogue: Portrait de la jeune fille en feu (0.9).
    expect(within(list).getAllByRole('button')[0]).toHaveTextContent('Portrait de la jeune fille en feu');
    fireEvent.click(within(list).getAllByRole('button')[0]!);
    const inspector = screen.getByRole('complementary', { name: 'Contenu suivi' });
    expect(inspector).toHaveTextContent('Portrait de la jeune fille en feu');
    expect(inspector).toHaveTextContent('7 → 1');
    expect(inspector).toHaveTextContent('son atout est « Diversité » : 90');
    expect(inspector).toHaveTextContent(/Valeurs simulées/);
  });

  it('montre les mesures Tournesol observées du contenu suivi', async () => {
    render(<Lab />);
    fireEvent.click(screen.getByRole('button', { name: /Tournesol, données publiques/i }));
    await waitFor(() => expect(screen.getByTestId('provenance-badge')).toHaveTextContent('Données réelles'));
    const list = screen.getByRole('list', { name: 'Classement Hybride, comparé à Popularité' });
    fireEvent.click(within(list).getByRole('button', { name: /Les milliardaires, compatibles avec la démocratie/ }));
    const inspector = screen.getByRole('complementary', { name: 'Contenu suivi' });
    expect(inspector).toHaveTextContent('362 par 88 contributeurs');
    expect(within(inspector).getByRole('link', { name: /Voir sur Tournesol/ })).toHaveAttribute('href', 'https://tournesol.app/entities/yt:n-oujbO9fdQ');
  });
});
