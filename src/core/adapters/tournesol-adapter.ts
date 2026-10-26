import type { TournesolAdapter, TournesolDataset } from '../domain/tournesol-types';
import { TournesolDatasetSchema } from '../domain/tournesol-types';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import type { Dataset, Item } from '@/core/data/types';

/**
 * Adaptateur de simulation (données d'exemple explicitement marquées).
 */
export class SimulationTournesolAdapter implements TournesolAdapter {
  async isAvailable(): Promise<boolean> {
    return true;
  }

  async getDataset(): Promise<TournesolDataset> {
    // Conversion du format interne Dataset vers TournesolDataset validé par Zod
    const tournesolDataset: TournesolDataset = {
      id: EXAMPLE_DATASET.id,
      title: EXAMPLE_DATASET.title,
      kind: 'example',
      source: EXAMPLE_DATASET.source,
      sourceUrl: EXAMPLE_DATASET.sourceUrl,
      license: EXAMPLE_DATASET.license,
      freshness: EXAMPLE_DATASET.freshness,
      itemCount: EXAMPLE_DATASET.itemCount,
      items: EXAMPLE_DATASET.items.map((item) => ({
        uid: item.id,
        title: item.title,
        author: item.author,
        platform: 'YouTube',
        scores: [
          { criteriaName: 'Utilité publique', score: item.metrics.collectiveScore, uncertainty: 0.1, nComparisons: 42 },
          { criteriaName: 'Fiabilité', score: item.metrics.collectiveScore * 0.9, uncertainty: 0.15, nComparisons: 38 },
        ],
        collectiveScore: item.metrics.collectiveScore,
        popularity: item.metrics.popularity,
        diversityScore: item.metrics.diversityScore,
        nComparisons: 80,
      })),
    };

    return TournesolDatasetSchema.parse(tournesolDataset);
  }
}

/**
 * Adaptateur de conversion TournesolDataset -> Dataset interne pour le Lab
 */
export function adaptTournesolToInternal(tournesolDataset: TournesolDataset): Dataset {
  return {
    id: tournesolDataset.id,
    title: tournesolDataset.title,
    kind: tournesolDataset.kind,
    source: tournesolDataset.source,
    sourceUrl: tournesolDataset.sourceUrl,
    license: tournesolDataset.license,
    freshness: tournesolDataset.freshness,
    itemCount: tournesolDataset.itemCount,
    items: tournesolDataset.items.map((entity): Item => ({
      id: entity.uid,
      title: entity.title,
      author: entity.author,
      category: entity.platform,
      metrics: {
        popularity: entity.popularity,
        collectiveScore: entity.collectiveScore,
        diversityScore: entity.diversityScore,
        freshness: 0.7,
      },
    })),
  };
}
