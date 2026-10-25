import { useCallback, useMemo, useState } from 'react';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { ALL_STRATEGIES, computeResults } from '@/core/data/strategies';
import type { Dataset, Strategy } from '@/core/data/types';
import type { TournesolDataset } from '@/core/domain/tournesol-types';
import {
  ApiTournesolAdapter,
  SimulationTournesolAdapter,
  adaptTournesolToInternal,
} from '@/core/adapters/tournesol-adapter';
import { DatasetProvenance } from '@/features/data/dataset-provenance';
import { AccessibleRegion } from '@/core/ui/AccessibleRegion';

type DataSource = 'simulation' | 'api';

interface StrategyCardProps {
  strategy: Strategy;
  active: boolean;
  onToggle: () => void;
  params: Record<string, number | boolean | string>;
  onParamChange: (id: string, value: number | boolean | string) => void;
  results: { item: ReturnType<typeof computeResults>[0]['item']; score: number; explanation: string }[];
}

function StrategyCard({
  strategy,
  active,
  onToggle,
  params,
  onParamChange,
  results,
}: StrategyCardProps) {
  return (
    <section className={`rounded-lg border p-4 ${active ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
        >
          {active ? <span className="block w-4 h-4 rounded-full bg-slate-900" /> : <span className="block w-4 h-4 rounded-full border border-slate-300" />}
          {strategy.name}
        </button>
        <span className="text-xs text-slate-500">{results.length} résultats</span>
      </div>
      <p className="text-sm text-slate-600 mb-3">{strategy.description}</p>

      {strategy.parameters.length > 0 && (
        <div className="space-y-2 mb-3">
          {strategy.parameters.map((param) => {
            const value = Number(params[param.id] ?? param.default);
            return (
              <div key={param.id} className="flex items-center gap-3">
                <label className="text-sm text-slate-700 w-24">{param.name}</label>
                <input
                  type="range"
                  min={param.min ?? 0}
                  max={param.max ?? 1}
                  step={param.step ?? 0.1}
                  value={String(value)}
                  className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  onChange={(e) => onParamChange(param.id, Number(e.target.value))}
                />
                <span className="text-sm text-slate-500 w-8 text-right">{value.toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      )}

      <ul className="space-y-2">
        {results.length === 0 ? (
          <li className="text-sm text-slate-400 italic">Aucun résultat.</li>
        ) : (
          results.map(({ item, score, explanation }) => (
            <li key={item.id} className="flex items-start gap-2 p-2 rounded border border-slate-100 bg-white">
              <span className="flex-shrink-0 w-8 text-right text-xs font-bold text-slate-900">
                {Math.round(score * 100)}%
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="text-xs text-slate-500">{item.author} · {item.category}</div>
                <p className="mt-1 text-xs text-slate-600">{explanation}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export function Lab() {
  const [source, setSource] = useState<DataSource>('simulation');
  const [dataset, setDataset] = useState<Dataset>(EXAMPLE_DATASET);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIds, setActiveIds] = useState<string[]>(['popularity', 'collective']);
  const [params, setParams] = useState<Record<string, Record<string, number | boolean | string>>>(
    ALL_STRATEGIES.reduce(
      (acc, s) => {
        acc[s.id] = s.parameters.reduce((p, param) => ({ ...p, [param.id]: param.default }), {});
        return acc;
      },
      {} as Record<string, Record<string, number | boolean | string>>,
    ),
  );

  const loadFromSource = useCallback(async (src: DataSource) => {
    setLoading(true);
    setError(null);
    try {
      let tournesolDs: TournesolDataset;
      if (src === 'simulation') {
        const adapter = new SimulationTournesolAdapter();
        tournesolDs = await adapter.getDataset();
      } else {
        const adapter = new ApiTournesolAdapter();
        const available = await adapter.isAvailable();
        if (!available) {
          throw new Error("L'API Tournesol est indisponible (réponse non OK).");
        }
        tournesolDs = await adapter.getDataset();
      }
      setDataset(adaptTournesolToInternal(tournesolDs));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors du chargement.');
    } finally {
      setLoading(false);
    }
  }, []);

  const strategies = useMemo(
    () => ALL_STRATEGIES.map((s) => ({ strategy: s, active: activeIds.includes(s.id) })),
    [activeIds],
  );

  const resultsByStrategy = useMemo(
    () =>
      Object.fromEntries(
        strategies
          .filter(({ active }) => active)
          .map(({ strategy }) => [strategy.id, computeResults(dataset.items, strategy, params[strategy.id] ?? {})]),
      ),
    [dataset, strategies, params],
  );

  const toggleStrategy = (id: string) => {
    setActiveIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const updateParam = (strategyId: string, paramId: string, value: number | boolean | string) => {
    setParams((prev) => ({ ...prev, [strategyId]: { ...prev[strategyId], [paramId]: value } }));
  };

  const selectSimulation = () => {
    setError(null);
    setDataset(EXAMPLE_DATASET);
    setSource('simulation');
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Laboratoire</h1>
            <p className="text-sm text-slate-600">Comparez plusieurs stratégies de recommandation sur un même jeu de données.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={selectSimulation}
              disabled={loading}
              className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition ${
                source === 'simulation' && !error
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'
              }`}
            >
              {loading ? 'Chargement…' : 'Données d\'exemple'}
            </button>
            <button
              onClick={() => loadFromSource('api')}
              disabled={loading}
              className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition ${
                source === 'api' && !error
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'
              }`}
            >
              {loading ? 'Tournesol (API)…' : 'Tournesol (API)'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Bannière d'erreur */}
        {error && (
          <section className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-[10px] text-red-700 font-bold">!</span>
              </span>
              <div>
                <h3 className="text-sm font-semibold text-red-900">Erreur de chargement</h3>
                <p className="mt-0.5 text-sm text-red-800">{error}</p>
                <button
                  onClick={selectSimulation}
                  className="mt-2 inline-flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                >
                  Revenir aux données d\'exemple
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-3">
            <DatasetProvenance dataset={dataset} />
          </div>

          <aside className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Stratégies</h2>
            <p className="text-sm text-slate-600">Sélectionnez les stratégies à comparer.</p>
            <div className="space-y-2">
              {strategies.map(({ strategy, active }) => (
                <button
                  key={strategy.id}
                  data-testid={`strategy-${strategy.id}`}
                  onClick={() => toggleStrategy(strategy.id)}
                  disabled={loading}
                  className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition ${
                    active
                      ? 'bg-slate-100 border-slate-900 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {active ? (
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-900" />
                  ) : (
                    <span className="flex-shrink-0 w-4 h-4 rounded-full border border-slate-300" />
                  )}
                  {strategy.name}
                </button>
              ))}
            </div>
          </aside>

          <AccessibleRegion aria-label="Résultats des stratégies sélectionnées">
            <main className="col-span-1 md:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Résultats comparés</h2>
              <p className="text-sm text-slate-600">
                Chaque stratégie classe les mêmes contenus différemment. Le score indique la force du favoritisme de l'algorithme pour ce contenu.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {strategies
                  .filter(({ active }) => active)
                  .map(({ strategy }) => (
                    <StrategyCard
                      key={strategy.id}
                      strategy={strategy}
                      active={true}
                      onToggle={() => toggleStrategy(strategy.id)}
                      params={params[strategy.id] ?? {}}
                      onParamChange={(id, value) => updateParam(strategy.id, id, value)}
                      results={resultsByStrategy[strategy.id] ?? []}
                    />
                  ))}
              </div>
            </main>
          </AccessibleRegion>
        </section>

        <section className="p-5 rounded-lg border border-amber-200 bg-amber-50">
          <h3 className="font-semibold text-amber-900">Comment lire ces résultats</h3>
          <p className="mt-1 text-sm text-amber-800 leading-relaxed">
            Les mêmes contenus apparaissent dans chaque colonne, mais dans un ordre différent selon la stratégie. La stratégie Popularité favorise les contenus les plus populaires, la stratégie Score collectif ceux les mieux notés par la communauté, et la stratégie Diversité ceux dont la catégorie est sous-représentée. La stratégie Hybride combine les trois selon les poids que vous choisissez.
          </p>
          <p className="mt-2 text-xs text-amber-700">
            {dataset.kind === 'example'
              ? 'Ces données sont un exemple pédagogique (simulation) et ne reflètent aucun comportement réellement observé sur une plateforme.'
              : 'Ces données proviennent d\'une source réelle ; leur provenance, licence et fraîcheur sont affichées ci-dessus.'}
          </p>
        </section>
      </div>
    </main>
  );
}
