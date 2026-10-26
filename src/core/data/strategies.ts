import type { Item, Strategy } from './types';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/** Score reduction applied, per item of the same category already selected, by diverse selection. */
export const DIVERSITY_PENALTY = 0.2;

export const POPULARITY_STRATEGY: Strategy = {
  id: 'popularity',
  name: 'Popularité',
  description: 'Met en haut les contenus les plus vus, sans regarder leur qualité ni leur variété.',
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
  description: 'Met en haut les contenus que la communauté juge les plus utiles.',
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
  description: 'Alterne les catégories pour que le haut du classement ne parle pas d’un seul sujet.',
  parameters: [],
  score: (item) => item.metrics.diversityScore,
  explain: (item) =>
    `Ce contenu est favorisé par la stratégie Diversité car sa catégorie est sous-représentée (score de diversité ${Math.round(
      item.metrics.diversityScore * 100,
    )}%).`,
  diverseSelection: true,
};

export const HYBRID_STRATEGY: Strategy = {
  id: 'hybrid',
  name: 'Hybride',
  description: 'Mélange les trois critères selon le dosage que vous choisissez avec les curseurs.',
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
  if (strategy.diverseSelection) {
    return computeDiverseResults(items, strategy, params);
  }
  return items
    .map((item) => {
      const score = strategy.score(item, params);
      const explanation = strategy.explain(item, params, score);
      return { item, score, explanation };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Sélection itérative qui favorise la diversité des catégories.
 *
 * À chaque étape, l'item retenu est celui qui maximise un score ajusté :
 * score de base pénalisé par la présence déjà sélectionnée de sa catégorie.
 * Cela évite d'enchaîner plusieurs contenus de la même catégorie et fait
 * émerger des catégories sous-représentées plus tôt dans le classement.
 */
function computeDiverseResults(
  items: Item[],
  strategy: Strategy,
  params: Record<string, number | boolean | string>,
): { item: Item; score: number; explanation: string }[] {
  const remaining = [...items];
  const selected: { item: Item; score: number; explanation: string }[] = [];
  const categoryCount = new Map<string, number>();

  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestAdjustedScore = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const item = remaining[i]!;
      const baseScore = strategy.score(item, params);
      const alreadySelected = categoryCount.get(item.category) ?? 0;
      // Pénalité de 0.2 par item déjà sélectionné de la même catégorie.
      const penalty = DIVERSITY_PENALTY * alreadySelected;
      const adjustedScore = baseScore * Math.max(0, 1 - penalty);

      if (adjustedScore > bestAdjustedScore) {
        bestAdjustedScore = adjustedScore;
        bestIndex = i;
      }
    }

    const item = remaining.splice(bestIndex, 1)[0]!;
    const score = strategy.score(item, params);
    const explanation = strategy.explain(item, params, score);
    selected.push({ item, score, explanation });
    categoryCount.set(item.category, (categoryCount.get(item.category) ?? 0) + 1);
  }

  return selected;
}
