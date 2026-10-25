import { z } from 'zod';

export const TournesolScoreSchema = z.object({
  criteriaName: z.string(),
  score: z.number().min(0).max(1),
  uncertainty: z.number().min(0).max(1).optional(),
  nComparisons: z.number().int().nonnegative().optional(),
});

export const TournesolEntitySchema = z.object({
  uid: z.string(),
  title: z.string(),
  author: z.string(),
  url: z.string().url().optional(),
  platform: z.string().default('YouTube'),
  thumbnailUrl: z.string().url().optional(),
  scores: z.array(TournesolScoreSchema),
  collectiveScore: z.number().min(0).max(1),
  popularity: z.number().min(0).max(1),
  diversityScore: z.number().min(0).max(1),
  nComparisons: z.number().int().nonnegative(),
});

export const TournesolDatasetSchema = z.object({
  id: z.string(),
  title: z.string(),
  kind: z.enum(['real', 'example']),
  source: z.string(),
  sourceUrl: z.string().url().optional(),
  license: z.string(),
  freshness: z.string(),
  itemCount: z.number().int().nonnegative(),
  items: z.array(TournesolEntitySchema),
});

export type TournesolScore = z.infer<typeof TournesolScoreSchema>;
export type TournesolEntity = z.infer<typeof TournesolEntitySchema>;
export type TournesolDataset = z.infer<typeof TournesolDatasetSchema>;

export interface TournesolAdapter {
  getDataset(): Promise<TournesolDataset>;
  isAvailable(): Promise<boolean>;
}
