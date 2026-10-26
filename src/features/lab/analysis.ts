import type { Item, Strategy } from '@/core/data/types';
import { DIVERSITY_PENALTY, type computeResults } from '@/core/data/strategies';

/**
 * Read-only analysis of rankings already produced by computeResults.
 * Nothing here ranks items: it explains and measures what the real
 * strategies did, so the interface never shows a simulated movement.
 */

export type Ranking = ReturnType<typeof computeResults>;
export type Params = Record<string, number | boolean | string>;
export type MetricKey = 'popularity' | 'collectiveScore' | 'diversityScore';

export const METRIC_LABELS: Record<MetricKey, string> = {
  popularity: 'Popularité',
  collectiveScore: 'Score collectif',
  diversityScore: 'Diversité',
};

export interface CompositionPart {
  metric: MetricKey;
  value: number; // the item's 0..1 metric
  share: number; // the metric's effective weight, 0..1, shares sum to 1
  contribution: number; // value × share
}

export interface Composition {
  parts: CompositionPart[];
  score: number; // the strategy's own score for the item
  /** Diverse selection only: same-category items placed above, and the adjusted score used to place it. */
  diversity?: { sameCategoryAbove: number; adjustedScore: number };
}

export function rankMap(ranking: Ranking): Map<string, number> {
  return new Map(ranking.map(({ item }, index) => [item.id, index + 1]));
}

const SINGLE_METRIC: Record<string, MetricKey> = {
  popularity: 'popularity',
  collective: 'collectiveScore',
  diversity: 'diversityScore',
};

/** How a strategy builds the score of one item, mirroring its scoring rule. */
export function composition(item: Item, strategy: Strategy, params: Params, ranking: Ranking): Composition {
  const score = strategy.score(item, params);
  let parts: CompositionPart[];
  const single = SINGLE_METRIC[strategy.id];
  if (single) {
    parts = [{ metric: single, value: item.metrics[single], share: 1, contribution: item.metrics[single] }];
  } else {
    const weights: [MetricKey, number][] = [
      ['popularity', Number(params.w_popularity ?? 0.4)],
      ['collectiveScore', Number(params.w_collective ?? 0.4)],
      ['diversityScore', Number(params.w_diversity ?? 0.2)],
    ];
    const total = weights.reduce((sum, [, weight]) => sum + weight, 0) || 1;
    parts = weights.map(([metric, weight]) => ({
      metric,
      value: item.metrics[metric],
      share: weight / total,
      contribution: (item.metrics[metric] * weight) / total,
    }));
  }

  if (!strategy.diverseSelection) return { parts, score };
  const position = ranking.findIndex((entry) => entry.item.id === item.id);
  const sameCategoryAbove = ranking.slice(0, Math.max(0, position)).filter((entry) => entry.item.category === item.category).length;
  return {
    parts,
    score,
    diversity: { sameCategoryAbove, adjustedScore: score * Math.max(0, 1 - DIVERSITY_PENALTY * sameCategoryAbove) },
  };
}

export interface Movement {
  before: number;
  after: number;
  delta: number; // positive: the item rises
  overtook: Item[]; // above it in the reference, below it in the experiment
  overtakenBy: Item[]; // below it in the reference, above it in the experiment
}

export function movement(itemId: string, reference: Ranking, experiment: Ranking): Movement | null {
  const before = rankMap(reference);
  const after = rankMap(experiment);
  const from = before.get(itemId);
  const to = after.get(itemId);
  if (from === undefined || to === undefined) return null;
  const overtook: Item[] = [];
  const overtakenBy: Item[] = [];
  for (const { item } of experiment) {
    if (item.id === itemId) continue;
    const otherFrom = before.get(item.id);
    const otherTo = after.get(item.id);
    if (otherFrom === undefined || otherTo === undefined) continue;
    if (otherFrom < from && otherTo > to) overtook.push(item);
    if (otherFrom > from && otherTo < to) overtakenBy.push(item);
  }
  return { before: from, after: to, delta: from - to, overtook, overtakenBy };
}

const pct = (value: number) => Math.round(value * 100);

export type MetricMeans = Record<MetricKey, number>;

/** Mean of each metric over a catalogue: the yardstick for "strong" or "weak". */
export function metricMeans(items: Item[]): MetricMeans {
  const mean = (key: MetricKey) => items.length ? items.reduce((sum, item) => sum + item.metrics[key], 0) / items.length : 0;
  return { popularity: mean('popularity'), collectiveScore: mean('collectiveScore'), diversityScore: mean('diversityScore') };
}

/**
 * Factual sentences on why the item moved, built only from the two
 * compositions: the metric that gives it the largest weighted edge (or
 * handicap) against the catalogue average under the experiment's rule.
 */
export function explainMovement(
  item: Item,
  move: Movement,
  reference: { strategy: Strategy; composition: Composition },
  experiment: { strategy: Strategy; composition: Composition },
  means: MetricMeans,
): string {
  const where = `rang ${move.before} avec ${reference.strategy.name}, rang ${move.after} avec ${experiment.strategy.name}`;
  if (move.delta === 0) {
    return `Position inchangée (${where}) : les contenus qui l’entourent obtiennent des scores qui restent dans le même ordre.`;
  }

  const rises = move.delta > 0;
  const edges = experiment.composition.parts
    .filter((part) => part.share > 0)
    .map((part) => ({ part, edge: part.share * (part.value - means[part.metric]) }))
    .sort((a, b) => (rises ? b.edge - a.edge : a.edge - b.edge));
  const decisive = edges[0];
  const share = (part: CompositionPart) => (part.share < 1 ? `, qui pèse ${pct(part.share)} % de la règle` : '');
  let reason: string;
  if (decisive && (rises ? decisive.edge > 0 : decisive.edge < 0)) {
    const { part } = decisive;
    reason = `Avec ${experiment.strategy.name}, ${rises ? 'son atout' : 'son point faible'} est « ${METRIC_LABELS[part.metric]} » : ${pct(part.value)} contre ${pct(means[part.metric])} en moyenne dans le catalogue${share(part)}.`;
  } else {
    const strongest = [...experiment.composition.parts].sort((a, b) => b.contribution - a.contribution)[0]!;
    reason = `Avec ${experiment.strategy.name}, sa plus forte contribution vient de « ${METRIC_LABELS[strongest.metric]} » (${pct(strongest.value)}${share(strongest)}), mais d’autres contenus gagnent davantage.`;
  }
  const referencePart = reference.composition.parts.length === 1 ? reference.composition.parts[0] : undefined;
  const context = referencePart ? ` Avec ${reference.strategy.name}, seul « ${METRIC_LABELS[referencePart.metric]} » comptait (${pct(referencePart.value)}).` : '';
  const penalty = experiment.composition.diversity && experiment.composition.diversity.sameCategoryAbove > 0
    ? ` La sélection diversifiée réduit aussi son score : ${experiment.composition.diversity.sameCategoryAbove} contenu(s) de la catégorie « ${item.category} » sont déjà placés au-dessus (score ajusté ${pct(experiment.composition.diversity.adjustedScore)}).`
    : '';
  const passed = rises
    ? ` Il passe devant ${move.overtook.length} contenu(s).`
    : ` ${move.overtakenBy.length} contenu(s) passent devant lui.`;
  return `${rises ? 'Monte' : 'Descend'} de ${Math.abs(move.delta)} rang(s) (${where}). ${reason}${context}${penalty}${passed}`;
}

export interface Indicators {
  k: number;
  distinctCategories: number; // in the top k
  dominantCategory: string;
  dominantShare: number; // 0..1, share of the top k held by the most frequent category
  topPopularity: number; // mean popularity of the top k
  catalogPopularity: number; // mean popularity of the whole catalogue
}

/** Concentration of a ranking's top k: how many categories, how popular. */
export function indicators(ranking: Ranking, k = 5): Indicators {
  const top = ranking.slice(0, k);
  const counts = new Map<string, number>();
  for (const { item } of top) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  const [dominantCategory, dominantCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['—', 0];
  const mean = (entries: Ranking) => entries.length ? entries.reduce((sum, { item }) => sum + item.metrics.popularity, 0) / entries.length : 0;
  return {
    k: top.length,
    distinctCategories: counts.size,
    dominantCategory,
    dominantShare: top.length ? dominantCount / top.length : 0,
    topPopularity: mean(top),
    catalogPopularity: mean(ranking),
  };
}

export interface Displacement {
  changed: number;
  total: number;
  maxShift: number;
  meanShift: number;
}

export function displacement(reference: Ranking, experiment: Ranking): Displacement {
  const after = rankMap(experiment);
  const shifts = reference.map(({ item }, index) => Math.abs(index + 1 - (after.get(item.id) ?? index + 1)));
  return {
    changed: shifts.filter((shift) => shift > 0).length,
    total: reference.length,
    maxShift: shifts.reduce((max, shift) => Math.max(max, shift), 0),
    meanShift: shifts.length ? shifts.reduce((sum, shift) => sum + shift, 0) / shifts.length : 0,
  };
}
