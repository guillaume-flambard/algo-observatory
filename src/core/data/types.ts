export type DataKind = 'real' | 'example';

export interface ItemMetric {
  popularity: number; // 0..1
  collectiveScore: number; // 0..1
  diversityScore: number; // 0..1
  freshness: number; // 0..1
}

export interface Item {
  id: string;
  title: string;
  author: string;
  category: string;
  metrics: ItemMetric;
}

export interface Dataset {
  id: string;
  title: string;
  kind: DataKind;
  source: string; // nom de la source (Tournesol, Bluesky, Exemple...)
  sourceUrl?: string;
  license: string; // licence de la donnée
  licenseUrl?: string;
  freshness: string; // date de fraîcheur / génération
  itemCount: number;
  methodologyNote?: string; // how public source fields were transformed into 0..1 experiment inputs
  items: Item[];
}

export interface Parameter {
  id: string;
  name: string;
  type: 'number' | 'boolean' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  default: number | boolean | string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  parameters: Parameter[];
  // score(item, params) => number ; plus le score est élevé, plus l'item est remonté
  score: (item: Item, params: Record<string, number | boolean | string>) => number;
  explain: (item: Item, params: Record<string, number | boolean | string>, score: number) => string;
  // Lorsque true, computeResults applique une sélection itérative qui favorise
  // la diversité des catégories au lieu d'un simple tri par score.
  diverseSelection?: boolean;
}

export interface StrategyResult {
  strategyId: string;
  items: Item[];
}

export interface LabState {
  datasetId: string | null;
  strategyIds: string[];
  params: Record<string, Record<string, number | boolean | string>>;
}
