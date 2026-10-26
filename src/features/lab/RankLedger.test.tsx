import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { COLLECTIVE_STRATEGY, POPULARITY_STRATEGY, computeResults } from '@/core/data/strategies';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { RankLedger } from './RankLedger';

const items = Array.from({ length: 100 }, (_, index) => {
  const example = EXAMPLE_DATASET.items[index % EXAMPLE_DATASET.items.length]!;
  return {
    ...example,
    id: 'sample-' + index,
    title: 'Contenu ' + index,
    metrics: { ...example.metrics, popularity: (100 - index) / 100, collectiveScore: index / 100 },
  };
});

describe('RankLedger on a large catalogue', () => {
  it('draws only the visible block but keeps the real ranks', () => {
    let selected: string | null = null;
    const { container } = render(
      <RankLedger
        referenceName="Popularité"
        experimentName="Score collectif"
        reference={computeResults(items, POPULARITY_STRATEGY, {})}
        experiment={computeResults(items, COLLECTIVE_STRATEGY, {})}
        selectedId={null}
        onSelect={(id) => { selected = id; }}
        limit={10}
      />,
    );

    const list = screen.getByRole('list', { name: 'Classement Score collectif, comparé à Popularité' });
    const rows = within(list).getAllByRole('button');
    expect(rows).toHaveLength(10);
    // Collective order is the reverse of popularity: rank 1 comes from rank 100.
    expect(rows[0]).toHaveTextContent('Contenu 99');
    expect(rows[0]).toHaveTextContent('monte de 99, depuis le rang 100');
    // Paths only for items visible in either column: 10 leaving + 10 entering.
    expect(container.querySelectorAll('.ledger-path')).toHaveLength(20);
    fireEvent.click(rows[0]!);
    expect(selected).toBe('sample-99');
  });
});
