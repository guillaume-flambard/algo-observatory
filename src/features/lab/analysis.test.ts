import { describe, expect, it } from 'vitest';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { COLLECTIVE_STRATEGY, DIVERSITY_STRATEGY, HYBRID_STRATEGY, POPULARITY_STRATEGY, computeResults } from '@/core/data/strategies';
import { composition, displacement, explainMovement, indicators, metricMeans, movement, rankMap } from './analysis';

const items = EXAMPLE_DATASET.items;
const byPopularity = computeResults(items, POPULARITY_STRATEGY, {});
const byCollective = computeResults(items, COLLECTIVE_STRATEGY, {});

describe('movement', () => {
  it('reads ranks from the two real rankings and lists who was passed', () => {
    // Avatar: most popular (rank 1), lowest collective score (rank 8).
    const move = movement('i-6', byPopularity, byCollective)!;
    expect(move).toMatchObject({ before: 1, after: 8, delta: -7 });
    expect(move.overtakenBy).toHaveLength(7);
    expect(move.overtook).toHaveLength(0);

    const portrait = movement('i-3', byPopularity, byCollective)!;
    expect(portrait.after).toBe(rankMap(byCollective).get('i-3'));
    expect(portrait.delta).toBeGreaterThan(0);
    expect(portrait.overtook.length).toBe(portrait.delta);
  });

  it('returns null for an item absent from a ranking', () => {
    expect(movement('missing', byPopularity, byCollective)).toBeNull();
  });
});

describe('composition', () => {
  it('normalises hybrid weights into effective shares that sum to 1', () => {
    const item = items[0]!;
    const params = { w_popularity: 1, w_collective: 1, w_diversity: 0 };
    const ranking = computeResults(items, HYBRID_STRATEGY, params);
    const result = composition(item, HYBRID_STRATEGY, params, ranking);
    expect(result.parts.map((part) => part.share)).toEqual([0.5, 0.5, 0]);
    const summed = result.parts.reduce((sum, part) => sum + part.contribution, 0);
    expect(summed).toBeCloseTo(result.score, 10);
  });

  it('reports the diverse-selection penalty actually applied', () => {
    const ranking = computeResults(items, DIVERSITY_STRATEGY, {});
    const dramas = ranking.filter(({ item }) => item.category === 'Drame');
    const second = dramas[1]!.item;
    const result = composition(second, DIVERSITY_STRATEGY, {}, ranking);
    expect(result.diversity?.sameCategoryAbove).toBe(1);
    expect(result.diversity?.adjustedScore).toBeCloseTo(second.metrics.diversityScore * 0.8, 10);
  });
});

describe('explainMovement', () => {
  it('names the strategies, the ranks and the metric that handicaps a falling item', () => {
    const item = items.find((entry) => entry.id === 'i-6')!;
    const move = movement(item.id, byPopularity, byCollective)!;
    const text = explainMovement(
      item,
      move,
      { strategy: POPULARITY_STRATEGY, composition: composition(item, POPULARITY_STRATEGY, {}, byPopularity) },
      { strategy: COLLECTIVE_STRATEGY, composition: composition(item, COLLECTIVE_STRATEGY, {}, byCollective) },
      metricMeans(items),
    );
    expect(text).toContain('Descend de 7 rang(s)');
    expect(text).toContain('rang 1 avec Popularité, rang 8 avec Score collectif');
    // Avatar's collective score (60) is the catalogue's lowest; the mean is 86.
    expect(text).toContain('son point faible est « Score collectif » : 60 contre 86 en moyenne');
    expect(text).toContain('seul « Popularité » comptait (95)');
    expect(text).toContain('7 contenu(s) passent devant lui');
  });

  it('names the weighted advantage of a rising item under a hybrid rule', () => {
    const params = { w_popularity: 0, w_collective: 1, w_diversity: 1 };
    const hybrid = computeResults(items, HYBRID_STRATEGY, params);
    const item = items.find((entry) => entry.id === 'i-3')!;
    const move = movement(item.id, byPopularity, hybrid)!;
    const text = explainMovement(
      item,
      move,
      { strategy: POPULARITY_STRATEGY, composition: composition(item, POPULARITY_STRATEGY, {}, byPopularity) },
      { strategy: HYBRID_STRATEGY, composition: composition(item, HYBRID_STRATEGY, params, hybrid) },
      metricMeans(items),
    );
    expect(move.delta).toBeGreaterThan(0);
    expect(text).toContain('son atout est « Diversité » : 90');
    expect(text).toContain('qui pèse 50 % de la règle');
  });
});

describe('indicators and displacement', () => {
  it('measures concentration of the top of a ranking', () => {
    const result = indicators(byCollective, 5);
    expect(result.k).toBe(5);
    expect(result.dominantCategory).toBe('Drame');
    expect(result.dominantShare).toBeGreaterThanOrEqual(0.6);
    expect(result.catalogPopularity).toBeCloseTo(items.reduce((sum, item) => sum + item.metrics.popularity, 0) / items.length, 10);
  });

  it('counts moved items between two rankings', () => {
    expect(displacement(byPopularity, byPopularity)).toMatchObject({ changed: 0, maxShift: 0, meanShift: 0 });
    const result = displacement(byPopularity, byCollective);
    expect(result.total).toBe(8);
    expect(result.maxShift).toBe(7);
    expect(result.changed).toBeGreaterThan(0);
  });
});
