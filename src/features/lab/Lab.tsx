import { useCallback, useMemo, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, Check, ChevronDown, Database, Equal, FlaskConical, GitCompareArrows, Info, Loader2, RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { Dataset, Strategy } from '@/core/data/types';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { ALL_STRATEGIES, computeResults } from '@/core/data/strategies';
import type { TournesolDataset } from '@/core/domain/tournesol-types';
import {
  ApiTournesolAdapter,
  SimulationTournesolAdapter,
  adaptTournesolToInternal,
} from '@/core/adapters/tournesol-adapter';
import { DatasetProvenance } from '@/features/data/dataset-provenance';

type DataSource = 'simulation' | 'api';
type ComputedResults = ReturnType<typeof computeResults>;

const strategyAccent: Record<string, string> = {
  popularity: 'bg-neutral-900',
  collective: 'bg-slate-600',
  diversity: 'bg-emerald-700',
  hybrid: 'bg-amber-700',
};

function ResultColumn({
  strategy,
  results,
  params,
  onParamChange,
  referenceRanks,
  comparisonEnabled,
  reference,
}: {
  strategy: Strategy;
  results: ComputedResults;
  params: Record<string, number | boolean | string>;
  onParamChange: (id: string, value: number) => void;
  referenceRanks: Map<string, number>;
  comparisonEnabled: boolean;
  reference: boolean;
}) {
  const accent = strategyAccent[strategy.id] ?? 'bg-neutral-900';
  const shown = results.slice(0, 8);

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white" aria-label={'Résultats de la stratégie ' + strategy.name}>
      <div className="border-b border-neutral-100 px-5 pb-5 pt-6 sm:px-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={'h-2.5 w-2.5 rounded-full ' + accent} aria-hidden="true" />
            <h3 className="text-lg font-semibold tracking-[-0.03em]">{strategy.name}</h3>
          </div>
          {comparisonEnabled && reference && (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-600">
              Référence
            </span>
          )}
        </div>
        <p className="min-h-[3rem] text-xs leading-6 text-neutral-500">{strategy.description}</p>

        {strategy.parameters.length > 0 && (
          <div className="mt-4 space-y-4 border-t border-neutral-100 pt-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-neutral-500">
              <SlidersHorizontal size={14} aria-hidden="true" />
              Pondérations
            </div>
            {strategy.parameters.map((param) => {
              const value = Number(params[param.id] ?? param.default);
              const id = strategy.id + '-' + param.id;
              return (
                <div key={param.id}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label htmlFor={id} className="text-xs font-medium text-neutral-700">{param.name}</label>
                    <output htmlFor={id} className="font-mono text-[11px] text-neutral-500">{Math.round(value * 100)}%</output>
                  </div>
                  <input
                    id={id}
                    type="range"
                    min={param.min ?? 0}
                    max={param.max ?? 1}
                    step={param.step ?? 0.1}
                    value={value}
                    className="h-1.5 w-full cursor-pointer accent-neutral-900"
                    onChange={(event) => onParamChange(param.id, Number(event.target.value))}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-neutral-500 sm:px-6">
        <span>Classement</span>
        <span>Score calculé</span>
      </div>
      {shown.length > 0 ? (
        <ol className="divide-y divide-neutral-100">
          {shown.map(({ item, score, explanation }, index) => {
            const rank = index + 1;
            const rankDelta = (referenceRanks.get(item.id) ?? rank) - rank;
            return (
              <li key={item.id} className="group px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <span className="w-5 shrink-0 pt-0.5 font-mono text-xs text-neutral-400">
                    {String(rank).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[13px] font-semibold leading-5 text-neutral-900">{item.title}</p>
                      <span className="shrink-0 font-mono text-[11px] font-medium text-neutral-700">
                        {Math.round(score * 100)}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{item.author}</span>
                      {comparisonEnabled && !reference && (
                        <span
                          className={[
                            'ml-auto inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono',
                            rankDelta > 0 ? 'bg-emerald-50 text-emerald-700' : rankDelta < 0 ? 'bg-rose-50 text-rose-700' : 'bg-neutral-100 text-neutral-500',
                          ].join(' ')}
                          title="Différence de rang par rapport à la stratégie de référence"
                        >
                          {rankDelta > 0 ? <ArrowUp size={11} aria-hidden="true" /> : rankDelta < 0 ? <ArrowDown size={11} aria-hidden="true" /> : <Equal size={11} aria-hidden="true" />}
                          {rankDelta === 0 ? '0' : Math.abs(rankDelta)}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100" aria-hidden="true">
                      <div className={'h-full rounded-full transition-[width] duration-300 ' + accent} style={{ width: Math.round(score * 100) + '%' }} />
                    </div>
                    <details className="mt-3 text-xs">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-neutral-500 hover:text-neutral-900">
                        Pourquoi ce rang ? <ChevronDown size={12} aria-hidden="true" />
                      </summary>
                      <p className="mt-2 rounded-lg bg-neutral-50 p-3 leading-6 text-neutral-600">{explanation}</p>
                    </details>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="px-6 py-12 text-center text-sm text-neutral-500">Aucun contenu à classer dans ce jeu de données.</p>
      )}
      {results.length > shown.length && (
        <p className="border-t border-neutral-100 px-6 py-4 text-xs text-neutral-500">
          {shown.length} premiers résultats sur {results.length} contenus.
        </p>
      )}
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
    () => ALL_STRATEGIES.reduce(
      (acc, strategy) => {
        acc[strategy.id] = Object.fromEntries(strategy.parameters.map((parameter) => [parameter.id, parameter.default]));
        return acc;
      },
      {} as Record<string, Record<string, number | boolean | string>>,
    ),
  );

  const loadFromSource = useCallback(async (requested: DataSource) => {
    setLoading(true);
    setError(null);
    try {
      let tournesolDataset: TournesolDataset;
      if (requested === 'simulation') {
        tournesolDataset = await new SimulationTournesolAdapter().getDataset();
      } else {
        const adapter = new ApiTournesolAdapter();
        if (!(await adapter.isAvailable())) {
          throw new Error('La source Tournesol n’est pas disponible actuellement.');
        }
        tournesolDataset = await adapter.getDataset();
      }
      setDataset(adaptTournesolToInternal(tournesolDataset));
      setSource(requested);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'La source ne peut pas être chargée.');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectSimulation = () => {
    setError(null);
    setSource('simulation');
    setDataset(EXAMPLE_DATASET);
  };

  const selectedStrategies = useMemo(
    () => ALL_STRATEGIES.filter((strategy) => activeIds.includes(strategy.id)),
    [activeIds],
  );

  const resultsByStrategy = useMemo(
    () => Object.fromEntries(
      selectedStrategies.map((strategy) => [
        strategy.id,
        computeResults(dataset.items, strategy, params[strategy.id] ?? {}),
      ]),
    ) as Record<string, ComputedResults>,
    [dataset, selectedStrategies, params],
  );

  const referenceStrategy = selectedStrategies[0];
  const referenceRanks = useMemo<Map<string, number>>(
    () => new Map<string, number>((referenceStrategy ? (resultsByStrategy[referenceStrategy.id] ?? []) : []).map(({ item }, index): [string, number] => [item.id, index + 1])),
    [referenceStrategy, resultsByStrategy],
  );

  const toggleStrategy = (id: string) => {
    setActiveIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  };

  const updateParam = (strategyId: string, paramId: string, value: number) => {
    setParams((current) => ({
      ...current,
      [strategyId]: { ...current[strategyId], [paramId]: value },
    }));
  };

  return (
    <main>
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-12 sm:px-8 lg:px-12 lg:pb-12">
          <div className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-neutral-500">
            <FlaskConical size={14} aria-hidden="true" /> Laboratoire / 02
          </div>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-[clamp(2.8rem,5.2vw,5rem)] font-semibold leading-[1.05] tracking-[-0.065em]">
                Même contenu. <span className="text-neutral-400">Autre classement.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Choisissez des données, activez des stratégies, puis comparez ce qui monte ou descend.
                Tout est calculé ici selon des règles transparentes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                selectSimulation();
                setActiveIds(['popularity', 'collective']);
                setParams(Object.fromEntries(ALL_STRATEGIES.map((strategy) => [strategy.id, Object.fromEntries(strategy.parameters.map((parameter) => [parameter.id, parameter.default]))])));
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-medium transition hover:border-neutral-500"
            >
              <RotateCcw size={14} aria-hidden="true" /> Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10 lg:px-12">
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start" aria-label="Paramètres du laboratoire">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold">01 / Données</h2>
              <Database size={16} className="text-neutral-400" aria-hidden="true" />
            </div>
            <p className="mb-4 text-xs leading-6 text-neutral-500">
              Commencez avec un exemple pédagogique, ou chargez les données publiques de Tournesol.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={selectSimulation}
                disabled={loading}
                aria-pressed={source === 'simulation'}
                className={[
                  'flex w-full items-center justify-between gap-2 rounded-lg border px-3.5 py-3 text-left text-xs font-semibold transition disabled:opacity-50',
                  source === 'simulation' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400',
                ].join(' ')}
              >
                Données d’exemple <span className="text-[10px] font-normal opacity-70">Simulation</span>
              </button>
              <button
                type="button"
                onClick={() => loadFromSource('api')}
                disabled={loading}
                aria-pressed={source === 'api'}
                className={[
                  'flex w-full items-center justify-between gap-2 rounded-lg border px-3.5 py-3 text-left text-xs font-semibold transition disabled:opacity-50',
                  source === 'api' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400',
                ].join(' ')}
              >
                Tournesol (API)
                {loading ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <span aria-hidden="true" className="text-[10px] font-normal opacity-70">Publique</span>}
              </button>
            </div>
            <DatasetProvenance dataset={dataset} />
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold">02 / Stratégies</h2>
              <SlidersHorizontal size={16} className="text-neutral-400" aria-hidden="true" />
            </div>
            <p className="mb-4 text-xs leading-6 text-neutral-500">Sélectionnez les classements à afficher côte à côte.</p>
            <div className="space-y-2">
              {ALL_STRATEGIES.map((strategy) => {
                const active = activeIds.includes(strategy.id);
                return (
                  <button
                    key={strategy.id}
                    type="button"
                    data-testid={'strategy-' + strategy.id}
                    aria-pressed={active}
                    onClick={() => toggleStrategy(strategy.id)}
                    disabled={loading}
                    className={[
                      'flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-xs font-semibold transition disabled:opacity-50',
                      active ? 'border-neutral-300 bg-neutral-100 text-neutral-900' : 'border-transparent text-neutral-500 hover:border-neutral-200 hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    <span className={[
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                      active ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white',
                    ].join(' ')}>
                      {active && <Check size={11} strokeWidth={2.8} aria-hidden="true" />}
                    </span>
                    {strategy.name}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 border-t border-neutral-100 pt-4 text-[11px] text-neutral-500">
              {selectedStrategies.length} / {ALL_STRATEGIES.length} stratégies actives
            </p>
          </section>
        </aside>

        <div className="min-w-0 space-y-6">
          {error && (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <AlertCircle size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-semibold">Source indisponible</p>
                <p className="mt-1 leading-6">{error}</p>
                <button type="button" onClick={selectSimulation} className="mt-2 text-xs font-semibold underline underline-offset-4">
                  Utiliser les données d’exemple
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-3">
            <div className="bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Contenus analysés</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{dataset.items.length}</p>
            </div>
            <div className="bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Stratégies actives</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{selectedStrategies.length}</p>
            </div>
            <div className="col-span-2 bg-white p-5 sm:col-span-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Nature des données</p>
              <p className="mt-3 text-sm font-semibold">{dataset.kind === 'example' ? 'Simulation' : 'Source réelle'}</p>
            </div>
          </div>

          <section aria-label="Comparaison des classements">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-neutral-500">
                  <GitCompareArrows size={15} aria-hidden="true" /> 03 / Comparaison
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">Les classements, face à face.</h2>
                <p className="mt-2 max-w-xl text-xs leading-6 text-neutral-500">
                  Les chiffres indiquent les scores propres à chaque stratégie, et non des mesures de visibilité réelle.
                  {selectedStrategies.length > 1 && ' Les flèches indiquent les changements de rang par rapport à la première stratégie.'}
                </p>
              </div>
            </div>
            {loading && (
              <p role="status" className="mb-4 flex items-center gap-2 text-xs text-neutral-500">
                <Loader2 size={15} className="animate-spin" aria-hidden="true" /> Chargement des données…
              </p>
            )}
            {selectedStrategies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-8 py-20 text-center">
                <Info size={25} className="mx-auto text-neutral-400" aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold">Aucune stratégie sélectionnée</h3>
                <p className="mt-2 text-sm text-neutral-500">Activez au moins une stratégie dans le panneau de gauche.</p>
              </div>
            ) : (
              <div className="grid gap-5 xl:grid-cols-2" aria-live="polite">
                {selectedStrategies.map((strategy, index) => (
                  <ResultColumn
                    key={strategy.id}
                    strategy={strategy}
                    results={resultsByStrategy[strategy.id] ?? []}
                    params={params[strategy.id] ?? {}}
                    onParamChange={(id, value) => updateParam(strategy.id, id, value)}
                    referenceRanks={referenceRanks}
                    comparisonEnabled={selectedStrategies.length > 1}
                    reference={index === 0}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-5 text-xs leading-6 text-neutral-600">
            <Info size={18} className="mt-0.5 shrink-0 text-neutral-400" aria-hidden="true" />
            <div>
              <h3 className="mb-1 text-sm font-semibold text-neutral-900">Ce que montre cette expérience</h3>
              <p>
                Chaque stratégie trie les mêmes contenus d’après ses règles et les scores calculés.
                En ouvrant « Pourquoi ce rang ? », vous pouvez inspecter l’explication de ce calcul.
                {dataset.kind === 'example'
                  ? ' Les valeurs utilisées ici sont entièrement simulées et ne correspondent à aucune plateforme observée.'
                  : ' Ces résultats sont recalculés sur un jeu de données public ; ils ne constituent pas le classement observé d’une plateforme.'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
