import { ExternalLink } from 'lucide-react';
import type { Item, Strategy } from '@/core/data/types';
import type { Composition, MetricKey, MetricMeans, Movement } from './analysis';
import { METRIC_LABELS, explainMovement } from './analysis';

const METRIC_COLOR: Record<MetricKey, string> = {
  popularity: 'var(--metric-popularity)',
  collectiveScore: 'var(--crit-largely-recommended)',
  diversityScore: 'var(--crit-diversity-inclusion)',
};

/** A strategy's score for one item, split into the weighted contribution of each metric. */
export function CompositionBar({ strategy, composition, code }: { strategy: Strategy; composition: Composition; code: string }) {
  const visible = composition.parts.filter((part) => part.share > 0);
  return (
    <figure className="composition">
      <figcaption className="composition-head">
        <span><span className="composition-code">{code}</span> {strategy.name}</span>
        <span className="t-data">score {Math.round(composition.score * 100)}</span>
      </figcaption>
      <div className="composition-track" aria-hidden="true">
        {visible.map((part) => (
          <span
            key={part.metric}
            className="composition-part"
            style={{ width: part.contribution * 100 + '%', background: METRIC_COLOR[part.metric] }}
          />
        ))}
      </div>
      <ul className="composition-legend">
        {visible.map((part) => (
          <li key={part.metric}>
            <span className="composition-swatch" style={{ background: METRIC_COLOR[part.metric] }} aria-hidden="true" />
            {METRIC_LABELS[part.metric]}
            <span className="t-data">
              {Math.round(part.value * 100)}{part.share < 1 ? ' × ' + Math.round(part.share * 100) + ' %' : ''}
            </span>
          </li>
        ))}
      </ul>
      {composition.diversity && composition.diversity.sameCategoryAbove > 0 && (
        <p className="composition-note">
          Sélection diversifiée : {composition.diversity.sameCategoryAbove} contenu(s) de la même catégorie déjà placés,
          score ajusté <span className="t-data">{Math.round(composition.diversity.adjustedScore * 100)}</span>.
        </p>
      )}
    </figure>
  );
}

interface InspectorProps {
  item: Item;
  move: Movement;
  reference: { strategy: Strategy; composition: Composition };
  experiment: { strategy: Strategy; composition: Composition };
  lastChange: { from: number; to: number } | null;
  simulated: boolean;
  means: MetricMeans;
}

export function Inspector({ item, move, reference, experiment, lastChange, simulated, means }: InspectorProps) {
  const others = move.delta >= 0 ? move.overtook : move.overtakenBy;
  return (
    <aside className="inspector" aria-label="Contenu suivi">
      <h3 className="inspector-title">{item.title}</h3>
      <p className="inspector-meta">{item.author}, {item.category}</p>

      <div className="inspector-move">
        <span className={'t-figure inspector-figure' + (move.delta > 0 ? ' is-up' : '')}>
          {move.delta === 0 ? '=' : (move.delta > 0 ? '+' : '−') + Math.abs(move.delta)}
        </span>
        <span className="inspector-ranks">
          <span className="t-data">{move.before} → {move.after}</span>
          <span>{move.delta === 0 ? 'même rang' : move.delta > 0 ? 'rangs gagnés' : 'rangs perdus'}</span>
        </span>
      </div>
      {lastChange && lastChange.from !== lastChange.to && (
        <p className="inspector-last t-data">Dernier réglage : {lastChange.from} → {lastChange.to}</p>
      )}

      <div className="inspector-why">
        <h4 className="t-title-3">Pourquoi cette position</h4>
        <CompositionBar code="A" strategy={reference.strategy} composition={reference.composition} />
        <CompositionBar code="B" strategy={experiment.strategy} composition={experiment.composition} />
        <p className="inspector-sentence">{explainMovement(item, move, reference, experiment, means)}</p>
        {others.length > 0 && (
          <p className="inspector-others">
            <strong>{move.delta >= 0 ? 'Passe devant :' : 'Dépassé par :'}</strong>{' '}
            {others.slice(0, 3).map((other) => other.title).join(', ')}
            {others.length > 3 ? ' et ' + (others.length - 3) + ' autre(s)' : ''}
          </p>
        )}
      </div>

      {item.evidence ? (
        <dl className="inspector-evidence">
          <div><dt>Score Tournesol</dt><dd className="t-data">{item.evidence.tournesolScore === null ? 'non noté' : Math.round(item.evidence.tournesolScore)}</dd></div>
          <div><dt>Comparaisons</dt><dd><span className="t-data">{item.evidence.nComparisons}</span> par <span className="t-data">{item.evidence.nContributors}</span> contributeurs</dd></div>
          {item.evidence.views !== null && <div><dt>Vues YouTube</dt><dd className="t-data">{item.evidence.views.toLocaleString('fr-FR')}</dd></div>}
          <a href={item.evidence.url} target="_blank" rel="noopener noreferrer" className="inspector-source">
            Voir sur Tournesol <ExternalLink size={13} aria-hidden="true" />
          </a>
        </dl>
      ) : (
        <p className="inspector-simulated">
          {simulated ? 'Valeurs simulées : ce contenu n’a aucune mesure observée.' : 'Aucune mesure source pour ce contenu.'}
        </p>
      )}
    </aside>
  );
}
