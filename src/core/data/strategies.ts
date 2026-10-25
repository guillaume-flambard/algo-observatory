import type { Item, Strategy } from './types';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const POPULARITY_STRATEGY: Strategy = {
  id: 'popularity',
  name: 'Popularité',
  description: 'Fait remonter les contenus les plus populaires, indépendamment de leur qualité ou de leur diversité.',
  parameters: [],
  score: (item) => item.metrics.popularity,
  explain: (item) =>
    `Ce contenu est favorisé par la stratégie Popularité car son score de popularité est élevé (${Math.round(
      item.metrics.popularity * 100,
    )}%).`,
};

export const COLLECTIVE_STRATEGY: Strategy = {
  id: 'collective',
  name: 'Score collectif',
  description: 'Fait remonter les contenus les mieux notés par la communauté (scores collectifs).',
  parameters: [],
  score: (item) => item.metrics.collectiveScore,
  explain: (item) =>
    `Ce contenu est favorisé par la stratégie Score collectif car il est bien noté par la communauté (${Math.round(
      item.metrics.collectiveScore * 100,
    )}%).`,
};

export const DIVERSITY_STRATEGY: Strategy = {
  id: 'diversity',
  name: 'Diversité',
  description: 'Fait remonter les contenus peu représentés afin de diversifier les catégories proposées.',
  parameters: [],
  score: (item) => item.metrics.diversityScore,
  explain: (item) =>
    `Ce contenu est favorisé par la stratégie Diversité car sa catégorie est sous-représentée (score de diversité ${Math.round(
      item.metrics.diversityScore * 100,
    )}%).`,
};

export const HYBRID_STRATEGY: Strategy = {
  id: 'hybrid',
  name: 'Hybride',
  description: "Combinaison pondérée de popularité, de score collectif et de diversité, selon les poids choisis.",
  parameters: [
    { id: 'w_popularity', name: 'Poids popularité', type: 'number', min: 0, max: 1, step: 0.1, default: 0.4 },
    { id: 'w_collective', name: 'Poids score collectif', type: 'number', min: 0, max: 1, step: 0.1, default: 0.4 },
    { id: 'w_diversity', name: 'Poids diversité', type: 'number', min: 0, max: 1, step: 0.1, default: 0.2 },
  ],
  score: (item, params) => {
    const wp = Number(params.w_popularity ?? 0.4);
    const wc = Number(params.w_collective ?? 0.4);
    const wd = Number(params.w_diversity ?? 0.2);
    const total = wp + wc + wd || 1;
    return clamp01(
      (wp * item.metrics.popularity + wc * item.metrics.collectiveScore + wd * item.metrics.diversityScore) / total,
    );
  },
  explain: (_item, params, score) => {
    const wp = Number(params.w_popularity ?? 0.4);
    const wc = Number(params.w_collective ?? 0.4);
    const wd = Number(params.w_diversity ?? 0.2);
    return `Ce contenu est favorisé par la stratégie Hybride (score ${Math.round(score * 100)}%), qui combine
popularité (${Math.round(wp * 100)}%), score collectif (${Math.round(wc * 100)}%) et diversité
(${Math.round(wd * 100)}%).`;
  },
};

export const ALL_STRATEGIES: Strategy[] = [
  POPULARITY_STRATEGY,
  COLLECTIVE_STRATEGY,
  DIVERSITY_STRATEGY,
  HYBRID_STRATEGY,
];

export function findStrategy(id: string): Strategy | undefined {
  return ALL_STRATEGIES.find((s) => s.id === id);
}

export function computeResults(
  items: Item[],
  strategy: Strategy,
  params: Record<string, number | boolean | string>,
): { item: Item; score: number; explanation: string }[] {
  return items
    .map((item) => {
      const score = strategy.score(item, params);
      const explanation = strategy.explain(item, params, score);
      return { item, score, explanation };
    })
    .sort((a, b) => b.score - a.score);
}
