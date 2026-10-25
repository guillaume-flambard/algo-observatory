import { describe, it, expect } from 'vitest';
import { SimulationTournesolAdapter, adaptTournesolToInternal } from '@/core/adapters/tournesol-adapter';
import { TournesolDatasetSchema } from '@/core/domain/tournesol-types';

describe('Tournesol Data Layer', () => {
  it('valide le schéma Zod du dataset de simulation', async () => {
    const adapter = new SimulationTournesolAdapter();
    const dataset = await adapter.getDataset();
    
    expect(() => TournesolDatasetSchema.parse(dataset)).not.toThrow();
    expect(dataset.kind).toBe('example');
    expect(dataset.items.length).toBeGreaterThan(0);
  });

  it('adapte correctement le dataset Tournesol vers le format interne du Lab', async () => {
    const adapter = new SimulationTournesolAdapter();
    const tournesolDataset = await adapter.getDataset();
    const internalDataset = adaptTournesolToInternal(tournesolDataset);

    expect(internalDataset.id).toBe(tournesolDataset.id);
    expect(internalDataset.items).toHaveLength(tournesolDataset.items.length);
    expect(internalDataset.items[0]!.id).toBe(tournesolDataset.items[0]!.uid);
    expect(internalDataset.items[0]!.metrics.collectiveScore).toBe(tournesolDataset.items[0]!.collectiveScore);
  });
});
