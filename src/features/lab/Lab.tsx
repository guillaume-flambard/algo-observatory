import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AlertCircle, ArrowLeftRight, RotateCcw } from 'lucide-react';
import type { Dataset, Strategy } from '@/core/data/types';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { getTournesolPublicDataset } from '@/core/data/tournesol-public';
import { ALL_STRATEGIES, computeResults, findStrategy } from '@/core/data/strategies';
import { SourceSwitch } from '@/features/data/SourceSwitch';
import type { MetricKey, Params, Ranking } from './analysis';
import { METRIC_LABELS, composition, displacement, indicators, metricMeans, movement, rankMap } from './analysis';
import { RankLedger } from './RankLedger';
import { Inspector } from './Inspector';
import { PageHead } from '@/core/ui/PageHead';
import './lab.css';

type DataSource = 'simulation' | 'snapshot';
interface LabProps {
  dataset?: Dataset;
  onDatasetChange?: (next: Dataset) => void;
}

const DEFAULT_REFERENCE = 'popularity';
const DEFAULT_EXPERIMENT = 'hybrid';
const PARAM_METRIC: Record<string, MetricKey> = {
  w_popularity: 'popularity',
  w_collective: 'collectiveScore',
  w_diversity: 'diversityScore',
};

const PARAM_HINT: Record<string, string> = {
  w_popularity: 'Combien de fois le contenu a été vu.',
  w_collective: 'Ce que la communauté juge utile.',
  w_diversity: 'Favorise les sujets moins représentés.',
};

const defaultParams = () => Object.fromEntries(
  ALL_STRATEGIES.map((strategy) => [strategy.id, Object.fromEntries(strategy.parameters.map((parameter) => [parameter.id, parameter.default]))]),
) as Record<string, Params>;

const pct = (value: number) => Math.round(value * 100);

/** True on phone widths, where secondary detail starts collapsed. */
function useNarrow(query = '(max-width: 720px)') {
  const get = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches;
  const [narrow, setNarrow] = useState(get);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const list = window.matchMedia(query);
    const update = () => setNarrow(list.matches);
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);
  return narrow;
}

function WeightControls({ strategy, params, onChange }: { strategy: Strategy; params: Params; onChange: (id: string, value: number) => void }) {
  const weights = strategy.parameters.map((parameter) => ({ parameter, value: Number(params[parameter.id] ?? parameter.default) }));
  const total = weights.reduce((sum, { value }) => sum + value, 0);
  return (
    <fieldset className="lab-weights">
      <legend className="t-meta">Dosage de la règle {strategy.name}</legend>
      {weights.map(({ parameter, value }) => {
        const id = strategy.id + '-' + parameter.id;
        return (
          <div key={parameter.id} className="lab-weight">
            <label htmlFor={id}>{parameter.name}</label>
            <p id={id + '-hint'} className="lab-weight-hint">{PARAM_HINT[parameter.id]}</p>
            <output htmlFor={id} className="t-data">{pct(value)}%</output>
            <input
              id={id}
              type="range"
              min={parameter.min ?? 0}
              max={parameter.max ?? 1}
              step={parameter.step ?? 0.1}
              value={value}
              aria-describedby={id + '-hint'}
              onChange={(event) => onChange(parameter.id, Number(event.target.value))}
              style={{ '--fill': pct(value) + '%' } as CSSProperties}
            />
          </div>
        );
      })}
      <div className="lab-shares">
        <span className="lab-shares-title">Poids réel de chaque critère</span>
        <div className="lab-shares-track" aria-hidden="true">
          {weights.map(({ parameter, value }) => (
            <span key={parameter.id} data-metric={PARAM_METRIC[parameter.id]} style={{ flexGrow: total ? value : 1 }} />
          ))}
        </div>
        <ul className="lab-shares-legend">
          {weights.map(({ parameter, value }) => (
            <li key={parameter.id}>
              <span className="composition-swatch" data-metric={PARAM_METRIC[parameter.id]} aria-hidden="true" />
              {METRIC_LABELS[PARAM_METRIC[parameter.id]!]} <span className="t-data">{total ? pct(value / total) : 0} %</span>
            </li>
          ))}
        </ul>
        {total === 0 && <p className="lab-shares-warning">Tous les poids sont à zéro : chaque contenu obtient le même score.</p>}
      </div>
    </fieldset>
  );
}

function Measure({ label, a, b, note }: { label: string; a?: string; b: string; note?: string }) {
  return (
    <div className="lab-measure">
      <dt>{label}</dt>
      <dd>
        {a !== undefined && <span className="t-data lab-measure-a">A {a}</span>}
        <span className="t-data lab-measure-b">{a !== undefined ? 'B ' : ''}{b}</span>
      </dd>
      {note && <dd className="lab-measure-note">{note}</dd>}
    </div>
  );
}

function ScoreTable({ code, strategy, ranking }: { code: string; strategy: Strategy; ranking: Ranking }) {
  return (
    <section className="lab-table" aria-label={'Scores calculés par ' + strategy.name}>
      <h3><span className="lab-table-key">{code}</span> {strategy.name}</h3>
      <p className="lab-table-desc">{strategy.description}</p>
      <ol>
        {ranking.map(({ item, score, explanation }, index) => (
          <li key={item.id}>
            <details>
              <summary>
                <span className="t-data">{String(index + 1).padStart(2, '0')}</span>
                <span className="lab-table-title">{item.title}</span>
                <span className="t-data">{pct(score)}</span>
              </summary>
              <p>{explanation}</p>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Lab({ dataset: sharedDataset, onDatasetChange }: LabProps = {}) {
  const [localDataset, setLocalDataset] = useState<Dataset>(EXAMPLE_DATASET);
  const dataset = sharedDataset ?? localDataset;
  const setDataset = useCallback((next: Dataset) => {
    setLocalDataset(next);
    onDatasetChange?.(next);
  }, [onDatasetChange]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState(DEFAULT_REFERENCE);
  const [experimentId, setExperimentId] = useState(DEFAULT_EXPERIMENT);
  const [params, setParams] = useState<Record<string, Params>>(defaultParams);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const reference = findStrategy(referenceId)!;
  const experiment = findStrategy(experimentId)!;
  const referenceRanking = useMemo(() => computeResults(dataset.items, reference, params[reference.id] ?? {}), [dataset, reference, params]);
  const experimentRanking = useMemo(() => computeResults(dataset.items, experiment, params[experiment.id] ?? {}), [dataset, experiment, params]);

  // Track by default the item the rule moves the most: the experiment shows something at once.
  const fallbackId = useMemo(() => {
    const after = rankMap(experimentRanking);
    let best: string | null = referenceRanking[0]?.item.id ?? null;
    let bestShift = -1;
    referenceRanking.forEach(({ item }, index) => {
      const shift = Math.abs(index + 1 - (after.get(item.id) ?? index + 1));
      if (shift > bestShift) { bestShift = shift; best = item.id; }
    });
    return best;
  }, [referenceRanking, experimentRanking]);
  const trackedId = selectedId && dataset.items.some((item) => item.id === selectedId) ? selectedId : fallbackId;
  const tracked = dataset.items.find((item) => item.id === trackedId) ?? null;
  const move = tracked ? movement(tracked.id, referenceRanking, experimentRanking) : null;

  // Rank of the tracked item before the latest rule change.
  const revision = experimentId + JSON.stringify(params[experimentId]) + referenceId + dataset.id;
  const previous = useRef<{ revision: string; ranks: Map<string, number> }>({ revision, ranks: rankMap(experimentRanking) });
  const [lastChange, setLastChange] = useState<{ from: number; to: number } | null>(null);
  useEffect(() => {
    if (previous.current.revision === revision) return;
    const ranks = rankMap(experimentRanking);
    if (trackedId) {
      const from = previous.current.ranks.get(trackedId);
      const to = ranks.get(trackedId);
      setLastChange(from !== undefined && to !== undefined ? { from, to } : null);
    }
    previous.current = { revision, ranks };
  }, [revision, experimentRanking, trackedId]);

  const shift = useMemo(() => displacement(referenceRanking, experimentRanking), [referenceRanking, experimentRanking]);
  const concentrationA = useMemo(() => indicators(referenceRanking, 5), [referenceRanking]);
  const concentrationB = useMemo(() => indicators(experimentRanking, 5), [experimentRanking]);

  // One calm announcement after the user stops moving a control.
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncement(
        `${experiment.name} comparé à ${reference.name} : ${shift.changed} positions sur ${shift.total} changent.` +
        (tracked && move ? ` ${tracked.title} passe du rang ${move.before} au rang ${move.after}.` : ''),
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [experiment.name, reference.name, shift.changed, shift.total, tracked, move]);

  const selectSource = async (requested: DataSource) => {
    setError(null);
    setSelectedId(null);
    setLastChange(null);
    if (requested === 'simulation') {
      setDataset(EXAMPLE_DATASET);
      return;
    }
    setLoading(true);
    try {
      // No live API call: a versioned, attributed public snapshot, offline-ready.
      setDataset(getTournesolPublicDataset());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'La source ne peut pas être chargée.');
    } finally {
      setLoading(false);
    }
  };

  const chooseExperiment = (id: string) => {
    // Picking the reference as experiment swaps them, so A and B never coincide.
    if (id === referenceId) setReferenceId(experimentId);
    setExperimentId(id);
  };
  const chooseReference = (id: string) => {
    if (id === experimentId) setExperimentId(referenceId);
    setReferenceId(id);
  };
  const updateParam = (strategyId: string, paramId: string, value: number) => {
    setParams((current) => ({ ...current, [strategyId]: { ...current[strategyId], [paramId]: value } }));
  };
  const reset = () => {
    void selectSource('simulation');
    setReferenceId(DEFAULT_REFERENCE);
    setExperimentId(DEFAULT_EXPERIMENT);
    setParams(defaultParams());
    setShowAll(false);
  };

  const simulated = dataset.kind === 'example';
  const means = useMemo(() => metricMeans(dataset.items), [dataset]);
  const narrow = useNarrow();
  const limit = showAll ? dataset.items.length : Math.min(dataset.items.length, 10);
  const weighted = [experiment, reference].filter((strategy) => strategy.parameters.length > 0);

  return (
    <main className="page ao-interior lab">
      <PageHead
        title="Même contenu. Autre classement."
        lead="Un algorithme range des contenus selon une règle. Ici, c’est vous qui réglez la règle, et vous voyez le classement changer sous vos yeux."
        actions={(
          <button type="button" onClick={reset} className="btn btn-secondary">
            <RotateCcw size={15} aria-hidden="true" /> Réinitialiser
          </button>
        )}
      >
        <ol className="steps lab-howto" aria-label="Mode d’emploi">
          <li><span className="step-number" aria-hidden="true">1</span><p className="item-title">Choisissez une règle</p><p className="page-small">Popularité, avis de la communauté, diversité, ou un mélange des trois.</p></li>
          <li><span className="step-number" aria-hidden="true">2</span><p className="item-title">Bougez les curseurs</p><p className="page-small">La colonne de droite se réordonne aussitôt : ce qui monte est surligné en jaune.</p></li>
          <li><span className="step-number" aria-hidden="true">3</span><p className="item-title">Touchez un contenu</p><p className="page-small">Le panneau explique pourquoi il a monté ou descendu, chiffres à l’appui.</p></li>
        </ol>
        <SourceSwitch dataset={dataset} onSelect={(next) => void selectSource(next)} loading={loading} />
      </PageHead>

      {error && (
        <div role="alert" className="lab-error">
          <AlertCircle size={18} aria-hidden="true" />
          <div>
            <p className="t-meta">Source indisponible</p>
            <p>{error}</p>
            <button type="button" onClick={() => void selectSource('simulation')}>Utiliser les données d’exemple</button>
          </div>
        </div>
      )}

      <div className="lab-bench">
        <section className="lab-rail" aria-label="Règles comparées">
          <div className="lab-rail-block">
            <p className="t-meta lab-slot"><span className="lab-slot-key is-b">B</span> Règle testée</p>
            <div className="lab-chips" role="group" aria-label="Stratégie testée">
              {ALL_STRATEGIES.map((strategy) => (
                <button
                  key={strategy.id}
                  type="button"
                  data-testid={'strategy-' + strategy.id}
                  aria-pressed={experimentId === strategy.id}
                  onClick={() => chooseExperiment(strategy.id)}
                  className="lab-chip"
                >
                  {strategy.name}
                </button>
              ))}
            </div>
            <p className="lab-rail-desc">{experiment.description}</p>
          </div>

          {weighted.map((strategy) => (
            <WeightControls key={strategy.id} strategy={strategy} params={params[strategy.id] ?? {}} onChange={(id, value) => updateParam(strategy.id, id, value)} />
          ))}

          <div className="lab-rail-block">
            <label htmlFor="lab-reference" className="t-meta lab-slot"><span className="lab-slot-key">A</span> Comparer avec la règle</label>
            <div className="lab-reference">
              <select id="lab-reference" value={referenceId} onChange={(event) => chooseReference(event.target.value)}>
                {ALL_STRATEGIES.map((strategy) => <option key={strategy.id} value={strategy.id}>{strategy.name}</option>)}
              </select>
              <button type="button" className="lab-swap" onClick={() => { setReferenceId(experimentId); setExperimentId(referenceId); }} aria-label="Inverser A et B">
                <ArrowLeftRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <section className="lab-stage" aria-labelledby="rank-flow-heading">
          <div className="lab-stage-head">
            <h2 id="rank-flow-heading" className="instrument-title">Comment les positions changent</h2>
            <p className="lab-stage-caption">
              <span className="lab-caption-wide">À gauche, le classement avec la règle A. À droite, avec la règle B. Chaque trait relie un même contenu. Touchez-en un pour comprendre son déplacement.</span>
              <span className="lab-caption-narrow">Le classement avec la règle B. « A 4 → B 1 » : ce contenu était 4e avec la règle A, il est 1er avec la règle B.</span>
            </p>
          </div>
          <RankLedger
            referenceName={reference.name}
            experimentName={experiment.name}
            reference={referenceRanking}
            experiment={experimentRanking}
            selectedId={trackedId}
            onSelect={setSelectedId}
            limit={limit}
            revision={revision}
          />
          <div className="lab-stage-foot">
            <span className="t-meta"><span className="t-data">{shift.changed} / {shift.total}</span> positions changent, écart maximal <span className="t-data">{shift.maxShift}</span></span>
            {dataset.items.length > 10 && (
              <button type="button" onClick={() => setShowAll((value) => !value)} className="lab-link">
                {showAll ? 'Afficher les 10 premiers' : `Afficher les ${dataset.items.length} contenus`}
              </button>
            )}
          </div>
          <p className="sr-only" aria-live="polite">{announcement}</p>
        </section>

        {tracked && move && (
          <Inspector
            item={tracked}
            move={move}
            reference={{ strategy: reference, composition: composition(tracked, reference, params[reference.id] ?? {}, referenceRanking) }}
            experiment={{ strategy: experiment, composition: composition(tracked, experiment, params[experiment.id] ?? {}, experimentRanking) }}
            lastChange={lastChange}
            simulated={simulated}
            means={means}
          />
        )}
      </div>

      <section className="lab-measures" aria-labelledby="lab-measures-heading">
        <h2 id="lab-measures-heading" className="section-title">Ce que la règle change en haut du classement</h2>
        <p className="section-lead">Les cinq premières places sont celles que l’on voit vraiment. Voici comment elles changent entre la règle A et la règle B.</p>
        <dl>
          <Measure label="Contenus qui changent de place" b={`${shift.changed} / ${shift.total}`} note={`En moyenne, un contenu bouge de ${shift.meanShift.toFixed(1).replace('.', ',')} place(s).`} />
          <Measure
            label={`Sujets différents dans les ${concentrationB.k} premiers`}
            a={String(concentrationA.distinctCategories)}
            b={String(concentrationB.distinctCategories)}
            note="Moins il y en a, plus le haut du classement parle d’un seul sujet."
          />
          <Measure
            label="Place du sujet le plus présent"
            a={`${pct(concentrationA.dominantShare)} %`}
            b={`${pct(concentrationB.dominantShare)} %`}
            note={`Avec la règle B : ${concentrationB.dominantCategory}.`}
          />
          <Measure
            label={`Popularité moyenne des ${concentrationB.k} premiers`}
            a={String(pct(concentrationA.topPopularity))}
            b={String(pct(concentrationB.topPopularity))}
            note={`Moyenne de tout le catalogue : ${pct(concentrationB.catalogPopularity)}. Au-dessus, la règle favorise ce qui est déjà très vu.`}
          />
        </dl>
      </section>

      <section className="lab-compare" aria-labelledby="lab-compare-heading">
        <h2 id="lab-compare-heading" className="section-title">Les classements, face à face.</h2>
        <p className="lab-compare-lead">
          Le détail des notes calculées par chaque règle. Une note n’a de sens qu’à l’intérieur de sa règle : on ne compare pas une note de Popularité à une note d’Hybride. Ouvrez une ligne pour lire le calcul.
        </p>
        <details className="lab-tables-toggle" open={!narrow}>
          <summary>{narrow ? 'Afficher les scores détaillés' : 'Scores détaillés'}</summary>
          <div className="lab-tables">
            <ScoreTable code="A" strategy={reference} ranking={referenceRanking} />
            <ScoreTable code="B" strategy={experiment} ranking={experimentRanking} />
          </div>
        </details>
      </section>

      <section className="lab-limits">
        <h2 className="item-title">Ce que montre cette expérience, et ce qu’elle ne montre pas</h2>
        <p>
          Chaque stratégie trie les mêmes contenus d’après ses règles. Les mouvements affichés sont ceux du calcul, pas d’une plateforme.
          {simulated
            ? ' Les valeurs utilisées ici sont entièrement simulées et ne correspondent à aucune plateforme observée.'
            : ' Ces résultats sont recalculés sur un instantané public de Tournesol ; ils ne constituent pas le classement observé de YouTube ni celui de Tournesol.'}
        </p>
      </section>
    </main>
  );
}
