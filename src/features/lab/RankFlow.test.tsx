import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { COLLECTIVE_STRATEGY, POPULARITY_STRATEGY, computeResults } from '@/core/data/strategies';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { RankFlow } from './RankFlow';

describe('RankFlow sur un catalogue volumineux', () => {
  it('conserve les rangs réels et limite le nombre de trajectoires rendues', () => {
    const items = Array.from({ length: 100 }, (_, index) => {
      const example = EXAMPLE_DATASET.items[index % EXAMPLE_DATASET.items.length]!;
      return {
        ...example,
        id: 'sample-' + index,
        title: 'Contenu ' + index,
        metrics: {
          ...example.metrics,
          popularity: (100 - index) / 100,
          collectiveScore: index / 100,
        },
      };
    });

    const { container } = render(
      <RankFlow
        strategies={[POPULARITY_STRATEGY, COLLECTIVE_STRATEGY]}
        resultsByStrategy={{
          popularity: computeResults(items, POPULARITY_STRATEGY, {}),
          collective: computeResults(items, COLLECTIVE_STRATEGY, {}),
        }}
      />,
    );

    expect(screen.getByText(/Évolution par contenu · 12 \/ 100/)).toBeInTheDocument();
    const flow = screen.getByRole('img', { name: /Évolution des rangs/i });
    expect(flow.querySelectorAll('path')).toHaveLength(12);
    expect(screen.getByText(/100 contenus changent de position/i)).toBeInTheDocument();
    const entry = screen.getByRole('button', { name: /Contenu 1/i });
    fireEvent.click(entry);
    expect(entry).toHaveAttribute('aria-pressed', 'true');
    expect(container.querySelectorAll('svg[role="img"]')).toHaveLength(1);
  });
});
