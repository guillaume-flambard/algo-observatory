import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Download, Search, SlidersHorizontal, X } from 'lucide-react';
import type { Dataset, Item } from '@/core/data/types';
import { useApp } from '@/App';

interface ExploreProps {
  dataset: Dataset;
}

type MetricKey = keyof Item['metrics'];
type SortKey = 'title' | MetricKey;
type SortDirection = 'asc' | 'desc';

const metricLabels: Record<MetricKey, string> = {
  popularity: 'Popularité',
  collectiveScore: 'Score collectif',
  diversityScore: 'Diversité',
  freshness: 'Fraîcheur',
};

const metricKeys = Object.keys(metricLabels) as MetricKey[];

function MetricCell({ value, label }: { value: number; label: string }) {
  const percent = Math.round(value * 100);
  return (
    <div className="flex min-w-[115px] items-center justify-end gap-3" aria-label={label + ' : ' + percent + '%'}>
      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-neutral-100" aria-hidden="true">
        <div className="h-full rounded-full bg-neutral-700" style={{ width: percent + '%' }} />
      </div>
      <span className="w-9 text-right font-mono text-xs text-neutral-700">{percent}%</span>
    </div>
  );
}

function escapeCsv(value: string | number) {
  const raw = String(value);
  return '"' + raw.replace(/"/g, '""') + '"';
}

export function Explore({ dataset }: ExploreProps) {
  const { setView } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortKey>('popularity');
  const [direction, setDirection] = useState<SortDirection>('desc');

  const categories = useMemo(
    () => [...new Set(dataset.items.map((item) => item.category))].sort((a, b) => a.localeCompare(b, 'fr')),
    [dataset],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('fr');
    return dataset.items
      .filter((item) =>
        (category === 'all' || item.category === category) &&
        (!normalized || [item.title, item.author, item.category].some((value) => value.toLocaleLowerCase('fr').includes(normalized))),
      )
      .sort((a, b) => {
        const difference = sort === 'title'
          ? a.title.localeCompare(b.title, 'fr')
          : a.metrics[sort] - b.metrics[sort];
        return (direction === 'asc' ? 1 : -1) * difference || a.title.localeCompare(b.title, 'fr');
      });
  }, [dataset, query, category, sort, direction]);

  const setSorting = (key: SortKey) => {
    if (sort === key) setDirection((previous) => previous === 'asc' ? 'desc' : 'asc');
    else {
      setSort(key);
      setDirection(key === 'title' ? 'asc' : 'desc');
    }
  };

  const exportCsv = () => {
    const headings = ['Titre', 'Auteur', 'Catégorie', ...metricKeys.map((key) => metricLabels[key])];
    const dataRows = filtered.map((item) => [
      item.title,
      item.author,
      item.category,
      ...metricKeys.map((key) => item.metrics[key]),
    ]);
    const metadata = [
      ['Jeu de données', dataset.title],
      ['Nature', dataset.kind === 'example' ? 'Simulation pédagogique' : 'Données publiques'],
      ['Source', dataset.source],
      ['Licence', dataset.license],
      ['Fraîcheur', dataset.freshness],
      [],
    ];
    const lines = [...metadata, headings, ...dataRows].map((row) => row.map(escapeCsv).join(';')).join('\r\n');
    const blob = new Blob(['\uFEFF' + lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'algo-observatory-' + dataset.id.replace(/[^a-zA-Z0-9_-]/g, '-') + '.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1440px] px-5 pb-14 pt-12 sm:px-8 lg:px-12 lg:pb-16">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.17em] text-neutral-500">Observatoire / 04 — Données</p>
          <div className="grid gap-7 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <h1 className="max-w-3xl text-[clamp(2.9rem,5.5vw,5.2rem)] font-semibold leading-[1.04] tracking-[-0.065em]">
              Sous les classements, <span className="text-neutral-400">les données.</span>
            </h1>
            <p className="max-w-lg text-sm leading-8 text-neutral-600 sm:text-base">
              Explorez chaque contenu et les métriques qui alimentent nos stratégies.
              Filtrez, triez et exportez les valeurs affichées, avec leur provenance.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] space-y-8 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <section className="grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-3" aria-label="Informations sur le jeu de données">
          {[
            { label: 'Contenus dans le catalogue', value: String(dataset.items.length) },
            { label: 'Type de données', value: dataset.kind === 'example' ? 'Simulation pédagogique' : 'Source publique' },
            { label: 'Origine', value: dataset.source },
          ].map((item) => (
            <div key={item.label} className="min-w-0 bg-white p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-neutral-500">{item.label}</p>
              <p className="mt-3 break-words text-lg font-semibold tracking-tight">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white" aria-labelledby="explore-table-title">
          <div className="border-b border-neutral-100 p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-neutral-500">
                  <SlidersHorizontal size={14} aria-hidden="true" /> Exploration directe
                </p>
                <h2 id="explore-table-title" className="text-2xl font-semibold tracking-[-0.04em]">
                  Contenus et métriques
                </h2>
                <p className="mt-2 text-xs leading-6 text-neutral-500">
                  Valeurs normalisées de 0 à 1, affichées en pourcentage pour faciliter la lecture.
                </p>
              </div>
              <button
                type="button"
                onClick={exportCsv}
                disabled={filtered.length === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download size={15} aria-hidden="true" /> Exporter CSV
              </button>
            </div>
            <div className="mt-7 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="relative">
                <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
                <label htmlFor="dataset-search" className="sr-only">Rechercher un contenu</label>
                <input
                  id="dataset-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher un titre, un auteur…"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pl-11 pr-4 text-sm placeholder:text-neutral-400"
                />
              </div>
              <div>
                <label htmlFor="category-filter" className="sr-only">Filtrer par catégorie</label>
                <select
                  id="category-filter"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-full min-h-[44px] w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
              <span role="status">{filtered.length} résultat{filtered.length > 1 ? 's' : ''} sur {dataset.items.length}</span>
              {(query || category !== 'all') && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setCategory('all'); }}
                  className="inline-flex items-center gap-1 font-semibold text-neutral-700 underline-offset-4 hover:underline"
                >
                  <X size={13} aria-hidden="true" /> Effacer les filtres
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th scope="col" className="px-6 py-4">
                    <button type="button" onClick={() => setSorting('title')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
                      Titre {sort === 'title' ? (direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : null}
                    </button>
                  </th>
                  <th scope="col" className="px-5 py-4 text-[11px] font-semibold text-neutral-500">Catégorie</th>
                  {metricKeys.map((key) => (
                    <th scope="col" key={key} className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSorting(key)}
                        aria-label={'Trier par ' + metricLabels[key]}
                        className="inline-flex items-center justify-end gap-1 whitespace-nowrap text-[11px] font-semibold text-neutral-500 hover:text-neutral-900"
                      >
                        {metricLabels[key]}
                        {sort === key ? (direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : null}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-6 py-5">
                      <p className="max-w-xs font-semibold leading-5 text-neutral-900">{item.title}</p>
                      <p className="mt-1 text-xs text-neutral-500">{item.author}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-5 text-xs text-neutral-600">{item.category}</td>
                    {metricKeys.map((key) => (
                      <td key={key} className="px-4 py-5">
                        <MetricCell label={metricLabels[key]} value={item.metrics[key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="min-w-[500px] px-6 py-16 text-center">
                <Search size={25} className="mx-auto text-neutral-400" aria-hidden="true" />
                <h3 className="mt-4 text-sm font-semibold">Aucun contenu trouvé</h3>
                <p className="mt-2 text-xs text-neutral-500">Essayez une recherche ou une catégorie différente.</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-between gap-3 border-t border-neutral-100 bg-neutral-50 px-6 py-5 text-xs leading-6 text-neutral-500">
            <span>Licence : {dataset.license}</span>
            <span>Fraîcheur : {dataset.freshness}</span>
          </div>
        </section>

        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-sm font-semibold">{dataset.kind === 'example' ? 'Jeu de données simulé' : 'Données publiques'}</p>
            <p className="mt-2 max-w-xl text-xs leading-6 text-neutral-600">
              {dataset.kind === 'example'
                ? 'Ces valeurs ont été construites pour la démonstration. Elles ne décrivent ni des utilisateurs réels ni des décisions prises par une plateforme.'
                : 'Les valeurs viennent d’une source publique identifiée ; les classements présentés dans le laboratoire restent des simulations de stratégies.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView('lab')}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-semibold text-white transition hover:bg-neutral-700"
          >
            Comparer les classements <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </main>
  );
}
