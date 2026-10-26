import snapshot from './tournesol-public-snapshot.json';
import type { Dataset, Item } from './types';

/**
 * Attribution: Tournesol public recommendations, ODC-BY 1.0.
 * All recorded fields are observed values. The lab's 0..1 input
 * values are derived and must NOT be confused with raw Tournesol scores.
 * A versioned snapshot avoids browser CORS restrictions and silent fallback.
 */
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const normalizeScore = (value: number) => clamp01((value + 100) / 200);

export function getTournesolPublicDataset(): Dataset {
  const maxViews = Math.max(1, ...snapshot.items.map((item) => item.views ?? 0));
  const asOf = new Date(snapshot.retrievedAt).getTime();

  const items: Item[] = snapshot.items.map((item) => {
    const views = item.views ?? 0;
    const ageDays = item.publicationDate
      ? Math.max(0, (asOf - new Date(item.publicationDate).getTime()) / 86_400_000)
      : 0;

    return {
      id: item.uid,
      title: item.title,
      author: item.author || 'Auteur non renseigné',
      // Tournesol tags are public source metadata, not guessed subjects.
      category: item.tags[0] || item.language || 'Non classé',
      metrics: {
        popularity: clamp01(Math.log1p(views) / Math.log1p(maxViews)),
        collectiveScore: item.tournesolScore === null ? 0 : normalizeScore(item.tournesolScore),
        diversityScore: item.diversityInclusion === null ? 0 : normalizeScore(item.diversityInclusion),
        freshness: clamp01(Math.exp(-ageDays / 730)),
      },
      evidence: {
        tournesolScore: item.tournesolScore,
        nComparisons: item.nComparisons,
        nContributors: item.nContributors,
        views: item.views ?? null,
        url: 'https://tournesol.app/entities/' + item.uid,
      },
    };
  });

  return {
    id: 'tournesol-public-' + snapshot.retrievedAt.slice(0, 10),
    title: 'Tournesol — recommandations publiques (instantané)',
    kind: 'real',
    source: 'Tournesol — recommandations vidéos',
    sourceUrl: snapshot.endpoint,
    license: 'Open Data Commons Attribution (ODC-BY 1.0)',
    licenseUrl: 'https://opendatacommons.org/licenses/by/1-0/',
    freshness: snapshot.retrievedAt.slice(0, 10) + ' (instantané de ' + items.length + ' recommandations)',
    itemCount: items.length,
    items,
    methodologyNote: 'Jeu public figé : ' + items.length + ' recommandations parmi ' +
      snapshot.totalAvailable + ' au moment de la collecte. Score collectif et diversité-inclusion : scores Tournesol transformés de [-100,100] vers [0,1]. Popularité : vues YouTube transformées en logarithme et rapportées au maximum de cet échantillon. Fraîcheur : décroissance à partir de la date de publication. Les classements restent des simulations, pas un classement observé de YouTube.',
  };
}
