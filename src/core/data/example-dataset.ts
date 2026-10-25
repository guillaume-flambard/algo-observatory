/**
 * Jeu de données d'EXEMPLE (simulation).
 *
 * PRINCIPE NON NÉGOCIABLE — Vérité des données :
 * ce jeu est fabriqué à titre d'exemple uniquement. Il ne doit JAMAIS être
 * présenté comme un comportement réellement observé sur une plateforme.
 * Dès qu'une vraie donnée Tournesol (ou autre) sera intégrée, ce fichier
 * sera remplacé ou clairement isolé, et la provenance/licence/fraîcheur
 * de la donnée réelle seront affichées (cf. REQ-006, REQ-007).
 */

import type { Dataset, Item, ItemMetric } from './types';

const buildItem = (id: string, title: string, author: string, category: string, metrics: ItemMetric): Item => ({
  id,
  title,
  author,
  category,
  metrics,
});

function createMetrics(
  popularity: number,
  collectiveScore: number,
  diversityScore: number,
  freshness: number,
): ItemMetric {
  return { popularity, collectiveScore, diversityScore, freshness };
}

export const EXAMPLE_DATASET: Dataset = {
  id: 'example-cinema',
  title: 'Cinéma — jeu d\'exemple (simulation)',
  kind: 'example',
  source: 'Algo Observatory — données d\'exemple',
  sourceUrl: undefined,
  license: 'Exemple — libre de droits à des fins de démonstration uniquement',
  licenseUrl: undefined,
  freshness: 'Généré à la construction — pas de fraîcheur réelle',
  itemCount: 8,
  items: [
    buildItem('i-1', 'Le Voyage de Chihiro', 'Studio Ghibli', 'Animation', createMetrics(0.9, 0.85, 0.4, 0.7)),
    buildItem('i-2', 'Parasite', 'Bong Joon-ho', 'Drame', createMetrics(0.8, 0.9, 0.6, 0.8)),
    buildItem('i-3', 'Portrait de la jeune fille en feu', 'Céline Sciamma', 'Drame', createMetrics(0.5, 0.95, 0.9, 0.9)),
    buildItem('i-4', 'Everything Everywhere All At Once', 'Daniel Kwan', 'Science-fiction', createMetrics(0.7, 0.88, 0.7, 0.6)),
    buildItem('i-5', 'Tár', 'Todd Field', 'Drame', createMetrics(0.4, 0.92, 0.8, 0.7)),
    buildItem('i-6', 'Avatar : la voie de l\'eau', 'James Cameron', 'Science-fiction', createMetrics(0.95, 0.6, 0.3, 0.5)),
    buildItem('i-7', 'Anatomie d\'une chute', 'Justine Triet', 'Drame', createMetrics(0.6, 0.94, 0.85, 0.8)),
    buildItem('i-8', 'Spider-Man : Across the Spider-Verse', 'Joaquim Dos Santos', 'Animation', createMetrics(0.85, 0.82, 0.5, 0.7)),
  ],
};
