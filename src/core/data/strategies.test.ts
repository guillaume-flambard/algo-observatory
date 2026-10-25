import { describe, it, expect } from 'vitest';
import {
  ALL_STRATEGIES,
  POPULARITY_STRATEGY,
  COLLECTIVE_STRATEGY,
  DIVERSITY_STRATEGY,
  HYBRID_STRATEGY,
  computeResults,
} from './strategies';
import type { Item } from './types';

const item: Item = {
  id: 'i-1',
  title: 'Test',
  author: 'Auteur',
  category: 'Cat',
  metrics: { popularity: 0.9, collectiveScore: 0.4, diversityScore: 0.2, freshness: 0.5 },
};

describe('strategies', () => {
  it('expose quatre stratégies', () => {
    expect(ALL_STRATEGIES).toHaveLength(4);
    expect(ALL_STRATEGIES.map((s) => s.id)).toEqual([
      'popularity',
      'collective',
      'diversity',
      'hybrid',
    ]);
  });

  it('popularity returns popularity as score', () => {
    expect(POPULARITY_STRATEGY.score(item, {})).toBe(0.9);
  });

  it('collective returns collectiveScore as score', () => {
    expect(COLLECTIVE_STRATEGY.score(item, {})).toBe(0.4);
  });

  it('hybrid combines metrics with weights', () => {
    const score = HYBRID_STRATEGY.score(item, {
      w_popularity: 0.5,
      w_collective: 0.3,
      w_diversity: 0.2,
    });
    expect(score).toBeCloseTo(0.9 * 0.5 + 0.4 * 0.3 + 0.2 * 0.2);
  });

  it('computeResults sorts descending by score', () => {
    const low: Item = { ...item, id: 'low', metrics: { ...item.metrics, popularity: 0.1 } };
    const results = computeResults([item, low], POPULARITY_STRATEGY, {});
    expect(results[0]!.item.id).toBe('i-1');
    expect(results[1]!.item.id).toBe('low');
    expect(results[0]!.explanation).toContain('Popularité');
  });

  it('hybrid explanation mentions weights', () => {
    const explanation = HYBRID_STRATEGY.explain(
      item,
      { w_popularity: 0.6, w_collective: 0.2, w_diversity: 0.2 },
      0.5,
    );
    expect(explanation).toContain('60%');
    expect(explanation).toContain('20%');
  });

  it('DIVERSITY_STRATEGY and COLLECTIVE_STRATEGY are distinct instances', () => {
    expect(DIVERSITY_STRATEGY.id).toBe('diversity');
    expect(COLLECTIVE_STRATEGY.id).toBe('collective');
  });

  it('DIVERSITY_STRATEGY interleaves categories instead of clustering them', () => {
    const animation1: Item = {
      id: 'a-1', title: 'Anim 1', author: 'A1', category: 'Animation',
      metrics: { popularity: 0.5, collectiveScore: 0.5, diversityScore: 0.9, freshness: 0.5 },
    };
    const animation2: Item = {
      id: 'a-2', title: 'Anim 2', author: 'A2', category: 'Animation',
      metrics: { popularity: 0.5, collectiveScore: 0.5, diversityScore: 0.9, freshness: 0.5 },
    };
    const animation3: Item = {
      id: 'a-3', title: 'Anim 3', author: 'A3', category: 'Animation',
      metrics: { popularity: 0.5, collectiveScore: 0.5, diversityScore: 0.9, freshness: 0.5 },
    };
    const drame1: Item = {
      id: 'd-1', title: 'Drame 1', author: 'D1', category: 'Drame',
      metrics: { popularity: 0.5, collectiveScore: 0.5, diversityScore: 0.8, freshness: 0.5 },
    };
    const drame2: Item = {
      id: 'd-2', title: 'Drame 2', author: 'D2', category: 'Drame',
      metrics: { popularity: 0.5, collectiveScore: 0.5, diversityScore: 0.8, freshness: 0.5 },
    };

    const results = computeResults(
      [animation1, animation2, animation3, drame1, drame2],
      DIVERSITY_STRATEGY,
      {},
    );

    const categories = results.map((r) => r.item.category);
    // Les trois premiers résultats ne doivent pas tous être de la même catégorie.
    const firstThree = categories.slice(0, 3);
    expect(new Set(firstThree).size).toBeGreaterThan(1);
  });
});
