import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Lab } from './Lab';

describe('Lab', () => {
  it('affiche les données d’exemple par défaut avec leur provenance', () => {
    render(<Lab />);
    expect(screen.getByTestId('provenance-badge')).toBeInTheDocument();
    expect(screen.getByTestId('provenance-badge')).toHaveTextContent(/données d'exemple — simulation/i);
    expect(screen.getByRole('button', { name: /^tournesol \(api\)$/i })).toBeInTheDocument();
  });

  it('affiche quatre stratégies disponibles dans le sélecteur', () => {
    render(<Lab />);
    expect(screen.getByTestId('strategy-popularity')).toBeInTheDocument();
    expect(screen.getByTestId('strategy-collective')).toBeInTheDocument();
    expect(screen.getByTestId('strategy-diversity')).toBeInTheDocument();
    expect(screen.getByTestId('strategy-hybrid')).toBeInTheDocument();
  });
});
