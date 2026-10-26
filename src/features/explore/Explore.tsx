import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Download, Search, X } from 'lucide-react';
import type { Dataset, Item } from '@/core/data/types';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { getTournesolPublicDataset } from '@/core/data/tournesol-public';
import { ALL_STRATEGIES, computeResults } from '@/core/data/strategies';
import { escapeCsvCell } from '@/core/data/csv';
import { useApp } from '@/App';
import { PageHead } from '@/core/ui/PageHead';
import { SourceSwitch } from '@/features/data/SourceSwitch';
import './Explore.css';

interface ExploreProps { dataset: Dataset }
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
const sorts: { value: SortKey; label: string }[] = [
  { value: 'popularity', label: 'Popularité' },
  { value: 'collectiveScore', label: 'Score collectif' },
  { value: 'diversityScore', label: 'Diversité' },
  { value: 'freshness', label: 'Fraîcheur' },
  { value: 'title', label: 'Titre' },
];

function MetricValue({ value, label }: { value: number; label: string }) {
  const percentage = Math.round(value * 100);
  return (
    <span className="dw-metric" role="img" aria-label={label + ' : ' + percentage + ' %'}>
      <span className="dw-meter" aria-hidden="true"><span style={{ width: percentage + '%' }} /></span>
      <span className="dw-metric-number">{percentage}</span>
    </span>
  );
}

export function Explore({ dataset }: ExploreProps) {
  const { setView, setDataset } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortKey>('popularity');
  const [direction, setDirection] = useState<SortDirection>('desc');
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null;
  const selectedRanks = useMemo(() => {
    if (!selected) return [];
    return ALL_STRATEGIES.map((strategy) => ({
      id: strategy.id,
      name: strategy.name,
      rank: computeResults(dataset.items, strategy, {}).findIndex(({ item }) => item.id === selected.id) + 1,
    }));
  }, [dataset, selected]);

  const setSorting = (key: SortKey) => {
    if (sort === key) setDirection((previous) => previous === 'asc' ? 'desc' : 'asc');
    else { setSort(key); setDirection(key === 'title' ? 'asc' : 'desc'); }
  };

  const switchSource = (next: 'example' | 'tournesol') => {
    setDataset(next === 'example' ? EXAMPLE_DATASET : getTournesolPublicDataset());
    setQuery('');
    setCategory('all');
    setSelectedId(null);
  };

  const exportCsv = () => {
    const headings = ['Titre', 'Auteur', 'Catégorie', ...metricKeys.map((key) => metricLabels[key])];
    const dataRows = filtered.map((item) => [
      item.title, item.author, item.category, ...metricKeys.map((key) => item.metrics[key]),
    ]);
    const metadata = [
      ['Jeu de données', dataset.title],
      ['Nature', dataset.kind === 'example' ? 'Simulation pédagogique' : 'Données publiques'],
      ['Source', dataset.source],
      ['Licence', dataset.license],
      ['Fraîcheur', dataset.freshness],
      [],
    ];
    const lines = [...metadata, headings, ...dataRows].map((row) => row.map(escapeCsvCell).join(';')).join('\r\n');
    const blob = new Blob(['\uFEFF' + lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'algo-observatory-' + dataset.id.replace(/[^a-zA-Z0-9_-]/g, '-') + '.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <main className="page dw-workbench" aria-labelledby="dw-title">
      <PageHead
        titleId="dw-title"
        title="Explorez les données."
        lead="Toutes les données utilisées par le laboratoire, avec leur origine. Cherchez un contenu, triez par critère, puis touchez une ligne pour voir sa place dans chaque classement."
        aside={(
          <div className="dw-count" aria-live="polite">
            <strong>{dataset.items.length.toString().padStart(2, '0')}</strong>
            <span>contenus<br />dans la source</span>
          </div>
        )}
      >
        <SourceSwitch dataset={dataset} onSelect={(next) => switchSource(next === 'simulation' ? 'example' : 'tournesol')} />
      </PageHead>



      <div className="dw-layout">
        <aside className="dw-sidebar" aria-label="Filtres et provenance">
          <div className="dw-aside-title"><span>Filtrer</span></div>
          <label htmlFor="dataset-search">Rechercher un contenu</label>
          <div className="dw-search">
            <Search size={17} aria-hidden="true" />
            <input id="dataset-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Titre, auteur, catégorie…" autoComplete="off" />
            {query && <button type="button" aria-label="Effacer la recherche" onClick={() => setQuery('')}><X size={15} aria-hidden="true" /></button>}
          </div>
          <label htmlFor="category-filter">Catégorie</label>
          <select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">Toutes les catégories</option>
            {categories.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <div className="dw-mobile-sort">
            <label htmlFor="dw-sort-mobile">Trier par</label>
            <div className="dw-sort-controls">
              <select id="dw-sort-mobile" value={sort} onChange={(event) => setSorting(event.target.value as SortKey)}>
                {sorts.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
              </select>
              <button type="button" aria-label={direction === 'asc' ? 'Tri croissant' : 'Tri décroissant'} title="Inverser l’ordre" onClick={() => setDirection((value) => value === 'asc' ? 'desc' : 'asc')}>
                {direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              </button>
            </div>
          </div>
          <div className="dw-filter-footer">
            <strong role="status">{filtered.length} résultat{filtered.length > 1 ? 's' : ''} sur {dataset.items.length}</strong>
            {(query || category !== 'all') && <button type="button" onClick={() => { setQuery(''); setCategory('all'); }}><X size={13} /> Effacer les filtres</button>}
          </div>
          <div className="dw-provenance">
            <div className="dw-aside-title">Provenance</div>
            <dl>
              <div><dt>Origine</dt><dd>{dataset.source}</dd></div>
              <div><dt>Licence</dt><dd>{dataset.license}</dd></div>
              <div><dt>État</dt><dd>{dataset.kind === 'example' ? 'Exemple fictif' : 'Capture publique, pas un flux en direct'}</dd></div>
            </dl>
            {dataset.sourceUrl && <a href={dataset.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-link">Consulter la source <ArrowUpRight size={14} aria-hidden="true" /></a>}
          </div>
        </aside>

        <section className="dw-results" aria-labelledby="explore-table-title">
          <div className="dw-results-head">
            <div><h2 id="explore-table-title">Contenus et métriques</h2></div>
            <button type="button" className="btn btn-secondary dw-export" onClick={exportCsv} disabled={filtered.length === 0}>
              <Download size={16} aria-hidden="true" /> Exporter CSV
            </button>
          </div>
          <div className="dw-table-frame">
            <table className="dw-data-table">
              <thead><tr>
                <th scope="col"><button type="button" onClick={() => setSorting('title')}>Contenu {sort === 'title' ? (direction === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : null}</button></th>
                <th scope="col">Catégorie</th>
                {metricKeys.map((key) => <th scope="col" key={key}><button type="button" onClick={() => setSorting(key)} aria-label={'Trier par ' + metricLabels[key]}>{metricLabels[key]} {sort === key && (direction === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />)}</button></th>)}
              </tr></thead>
              <tbody>
                {filtered.map((item, index) => <tr key={item.id} className={selected?.id === item.id ? 'is-selected' : ''}>
                  <td><div className="dw-name"><span className="dw-row-index">{String(index + 1).padStart(2, '0')}</span>
                    <button type="button" aria-pressed={selected?.id === item.id} onClick={() => setSelectedId(item.id)}><strong>{item.title}</strong><small>{item.author}</small></button>
                  </div></td>
                  <td><span className="dw-category">{item.category}</span></td>
                  {metricKeys.map((key) => <td key={key}><MetricValue label={metricLabels[key]} value={item.metrics[key]} /></td>)}
                </tr>)}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="dw-empty"><Search size={24} aria-hidden="true" /><h3>Aucun contenu trouvé</h3><p>Modifiez la recherche ou la catégorie.</p></div>}
          </div>
          <div className="dw-mobile-results">
            {filtered.map((item, index) => <article key={item.id} className={'dw-mobile-item' + (selected?.id === item.id ? ' is-selected' : '')}>
              <button type="button" aria-pressed={selected?.id === item.id} onClick={() => setSelectedId(item.id)} className="dw-mobile-item-heading">
                <span className="dw-row-index">{String(index + 1).padStart(2, '0')}</span>
                <span><strong>{item.title}</strong><small>{item.author}, {item.category}</small></span>
                <span aria-hidden="true">↗</span>
              </button>
              <div className="dw-mobile-metrics">{metricKeys.map((key) => <div key={key}><span>{metricLabels[key]}</span><MetricValue label={metricLabels[key]} value={item.metrics[key]} /></div>)}</div>
              {selected?.id === item.id && (
                <div className="dw-mobile-detail">
                  <span>Rangs calculés par stratégie</span>
                  <div className="dw-mobile-rank-grid">
                    {selectedRanks.map((rank) => <div key={rank.id}><span>{rank.name}</span><strong>#{String(rank.rank).padStart(2, '0')}</strong></div>)}
                  </div>
                  <button type="button" className="btn btn-primary" onClick={() => setView('lab')}>Comparer dans le labo <ArrowRight size={15} aria-hidden="true" /></button>
                </div>
              )}
            </article>)}
            {filtered.length === 0 && <div className="dw-empty"><h3>Aucun contenu trouvé</h3><p>Modifiez la recherche ou la catégorie.</p></div>}
          </div>
          <p className="dw-results-foot">Métriques normalisées de 0 à 1. Les rangs présentés ci-dessous sont calculés par l’application, et non observés sur une plateforme.</p>
        </section>

        <aside className="dw-inspector" aria-label="Inspecter le contenu sélectionné">
          <div className="dw-aside-title">Inspecter</div>
          {selected ? <>
            <div className="dw-inspector-title"><span>Contenu sélectionné</span><h2>{selected.title}</h2><p>{selected.author}, {selected.category}</p></div>
            <div className="dw-inspector-metrics">
              {metricKeys.map((key) => <div key={key}><span>{metricLabels[key]}</span><strong>{Math.round(selected.metrics[key] * 100)}<small> / 100</small></strong></div>)}
            </div>
            <div className="dw-inspector-ranks">
              <span>Rangs calculés par l’application</span>
              {selectedRanks.map((rank) => <div key={rank.id}><span>{rank.name}</span><strong>#{String(rank.rank).padStart(2, '0')}</strong></div>)}
            </div>
            <button type="button" className="btn btn-primary dw-inspect-cta" onClick={() => setView('lab')}>Comparer dans le labo <ArrowRight size={15} aria-hidden="true" /></button>
          </> : <p className="dw-no-selection">Aucun contenu ne correspond aux filtres actuels.</p>}
        </aside>
      </div>
    </main>
  );
}
