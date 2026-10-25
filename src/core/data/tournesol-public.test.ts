import { describe, expect, it } from 'vitest';
import snapshot from './tournesol-public-snapshot.json';
import { getTournesolPublicDataset } from './tournesol-public';

describe('Tournesol versioned public snapshot', () => {
  it('is attributable and never presented as live YouTube rankings', () => {
    const dataset = getTournesolPublicDataset();
    expect(dataset.kind).toBe('real');
    expect(dataset.sourceUrl).toBe(snapshot.endpoint);
    expect(dataset.license).toContain('ODC-BY');
    expect(dataset.methodologyNote).toMatch(/classements.*simulations/i);
    expect(dataset.items).toHaveLength(24);
    expect(dataset.items[0]?.title).toContain('Les milliardaires');
  });

  it('derives finite bounded metrics deterministically from the captured observations', () => {
    const first = getTournesolPublicDataset();
    const second = getTournesolPublicDataset();
    expect(second).toEqual(first);
    for (const item of first.items) {
      expect(item.id).toMatch(/^yt:/);
      expect(item.title.length).toBeGreaterThan(0);
      for (const value of Object.values(item.metrics)) {
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });
});
