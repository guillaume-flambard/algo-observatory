import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('affiche le titre Algo Observatory', () => {
    render(<App />);
    expect(screen.getByTestId('app-title')).toBeInTheDocument();
  });
});
