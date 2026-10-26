import { useCallback, useMemo, useState } from 'react';
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
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Section } from '@/core/ui/Section';
import { Container } from '@/core/ui/Container';

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
  const style = active
    ? 'border-indigo-200 bg-indigo-50 shadow-sm'
    : 'border-slate-200 bg-white shadow-sm';

  return (
    <Card variant="default" className={style} padded={false}>
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full flex items-center gap-2 text-left bg-transparent border-transparent hover:bg-transparent shadow-none focus-visible:ring-0"
          >
            <span
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                active ? 'bg-slate-900 border-slate-900' : 'border border-slate-300'
              }`}
            />
            <span className="font-medium text-slate-900 truncate">{strategy.name}</span>
            <span className="ml-auto text-xs text-slate-400">{results.length} résultats</span>
          </Button>
        </div>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">{strategy.description}</p>

        {strategy.parameters.length > 0 && (
          <div className="space-y-3 mb-4">
            {strategy.parameters.map((param) => {
              const value = Number(params[param.id] ?? param.default);
              return (
                <div key={param.id} className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700 w-28">
                    {param.name}
                  </label>
                  <input
                    type="range"
                    min={param.min ?? 0}
                    max={param.max ?? 1}
                    step={param.step ?? 0.1}
                    value={String(value)}
                    className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    onChange={(e) => onParamChange(param.id, Number(e.target.value))}
                  />
                  <span className="text-xs font-mono text-slate-500 w-10 text-right">
                    {value.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <ul className="space-y-1">
          {results.length === 0 ? (
            <li className="text-sm text-slate-400 italic">Aucun résultat.</li>
          ) : (
            results.map(({ item, score, explanation }) => (
              <li key={item.id} className="flex items-start gap-2 p-2 rounded-xl border border-slate-100 bg-white">
                <span className="flex-shrink-0 w-8 text-right text-xs font-bold text-slate-900">
                  {Math.round(score * 100)}%
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500">
                    {item.author} · {item.category}
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{explanation}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </Card>
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
      setSource(src);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors du chargement.');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectSimulation = () => {
    setError(null);
    setDataset(EXAMPLE_DATASET);
    setSource('simulation');
  };

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

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <header className="relative overflow-hidden py-16 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-50/50 rounded-full blur-[140px] -translate-y-1/3" />
        </div>
        <Container>
          <div className="max-w-2xl">
            <Section
              eyebrow="Laboratoire"
              title="Comparez les stratégies de recommandation"
              description="Choisissez les stratégies à comparer, ajustez leurs paramètres et observez comment le classement change en temps réel."
            />
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                variant={source === 'simulation' && !error ? 'primary' : 'secondary'}
                onClick={selectSimulation}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Chargement…' : 'Données d\'exemple (simulation)'}
              </Button>
              <Button
                variant={source === 'api' && !error ? 'primary' : 'secondary'}
                onClick={() => loadFromSource('api')}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Tournesol (API)…' : 'Données réelles Tournesol (API)'}
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {error && (
        <section className="px-6 py-4">
          <Container>
            <Card variant="default" className="border-red-200 bg-red-50 shadow-sm">
              <div className="flex gap-3 p-6">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-700">
                  !
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 text-sm mb-1">Erreur de chargement</h3>
                  <p className="text-sm text-red-800 mb-3">{error}</p>
                  <Button variant="ghost" size="sm" onClick={selectSimulation} className="text-red-700">
                    Revenir aux données d'exemple
                  </Button>
                </div>
              </div>
            </Card>
          </Container>
        </section>
      )}

      <div className="flex-1 px-6 pb-12">
        <Container>
          <Section
            title="Source de données"
            description="Choisissez l'origine des données. Les données d'exemple sont une simulation pédagogique ; les données réelles proviennent de l'API Tournesol."
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant={source === 'simulation' ? 'primary' : 'secondary'}
                onClick={selectSimulation}
                disabled={loading}
                className="flex-1"
              >
                <span className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border ${source === 'simulation' ? 'bg-white border-slate-900' : 'border-slate-300'}`} />
                  {source === 'simulation' ? 'Données d\'exemple (simulation)' : 'Données d\'exemple'}
                </span>
              </Button>
              <Button
                variant={source === 'api' ? 'primary' : 'secondary'}
                onClick={() => loadFromSource('api')}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Chargement Tournesol…' : 'Données réelles Tournesol (API)'}
              </Button>
            </div>
            <div className="mt-4">
              <DatasetProvenance dataset={dataset} />
            </div>
          </Section>
        </Container>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 space-y-6">
            <Section title="Stratégies" description="Sélectionnez les stratégies à comparer." />
            <div className="space-y-2">
              {strategies.map(({ strategy, active }) => (
                <Button
                  key={strategy.id}
                  dataTestid={`strategy-${strategy.id}`}
                  variant={active ? 'primary' : 'secondary'}
                  onClick={() => toggleStrategy(strategy.id)}
                  disabled={loading}
                  className="w-full flex items-center gap-3 text-left bg-transparent border-transparent shadow-none focus-visible:ring-0 px-4 py-2.5"
                >
                  {active ? (
                    <span className="w-3 h-3 rounded-full bg-white border border-slate-900" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-slate-300" />
                  )}
                  {strategy.name}
                </Button>
              ))}
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-6">
            <Section title="Résultats comparés" description="Chaque stratégie classe les mêmes contenus différemment. Le score indique la force du favoritisme de l'algorithme pour ce contenu." />
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
        </div>

        <Card variant="soft" className="mt-8 p-6">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-[10px] font-bold text-amber-700">!</span>
            <div>
              <h3 className="font-bold text-amber-900 text-sm mb-1">Comment lire ces résultats</h3>
              <p className="text-sm text-amber-800 leading-relaxed mb-3">
                Les mêmes contenus apparaissent dans chaque colonne, mais dans un ordre différent selon la stratégie. La stratégie Popularité favorise les contenus les plus populaires, la stratégie Score collectif ceux les mieux notés par la communauté, et la stratégie Diversité ceux dont la catégorie est sous-représentée. La stratégie Hybride combine les trois selon les poids que vous choisissez.
              </p>
              <p className="text-xs text-amber-700">
                {dataset.kind === 'example'
                  ? 'Ces données sont un exemple pédagogique (simulation) et ne reflètent aucun comportement réellement observé sur une plateforme.'
                  : 'Ces données proviennent d’une source réelle ; leur provenance, licence et fraîcheur sont affichées ci-dessus.'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
