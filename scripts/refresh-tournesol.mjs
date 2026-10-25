/**
 * Explicit, human-triggered refresh of the versioned Tournesol public snapshot.
 * This never runs in the browser or in production. Review the diff before merge.
 *
 * Run: node scripts/refresh-tournesol.mjs
 */
import { writeFile } from 'node:fs/promises';
import { URL, fileURLToPath } from 'node:url';

const endpoint = 'https://api.tournesol.app/polls/videos/recommendations/?limit=24';
const result = await globalThis.fetch(endpoint, { signal: globalThis.AbortSignal.timeout(20_000), headers: { Accept: 'application/json' } });
if (!result.ok) throw new Error('Tournesol HTTP ' + result.status);
const data = await result.json();
if (!Array.isArray(data.results) || data.results.length !== 24) {
  throw new Error('Unexpected Tournesol recommendation count; keep previous snapshot');
}

const items = data.results.map((row) => {
  const entity = row.entity;
  const rating = row.collective_rating;
  if (!entity?.uid || !entity?.metadata?.name || !Number.isFinite(rating?.tournesol_score)) {
    throw new Error('Unexpected Tournesol schema; keep previous snapshot');
  }
  const criterion = rating.criteria_scores?.find((entry) => entry.criteria === 'diversity_inclusion');
  return {
    uid: entity.uid,
    title: entity.metadata.name,
    author: entity.metadata.uploader || 'Auteur non renseigné',
    views: Number.isFinite(entity.metadata.views) ? entity.metadata.views : null,
    language: entity.metadata.language || null,
    tags: Array.isArray(entity.metadata.tags) ? entity.metadata.tags.slice(0, 3) : [],
    publicationDate: entity.metadata.publication_date || null,
    tournesolScore: rating.tournesol_score,
    nComparisons: rating.n_comparisons ?? 0,
    nContributors: rating.n_contributors ?? 0,
    diversityInclusion: Number.isFinite(criterion?.score) ? criterion.score : null,
  };
});
const snapshot = {
  retrievedAt: new Date().toISOString(),
  endpoint,
  sourceUrl: 'https://tournesol.app/',
  license: 'ODC-BY-1.0',
  totalAvailable: data.count,
  items,
};
const target = new URL('../src/core/data/tournesol-public-snapshot.json', import.meta.url);
await writeFile(fileURLToPath(target), JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
globalThis.process.stdout.write('Refreshed Tournesol snapshot: ' + items.length + ' / ' + data.count + ' entities. Review changes and attribution.\n');
