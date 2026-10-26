import { ChevronDown, ExternalLink } from 'lucide-react';
import type { Dataset } from '@/core/data/types';

interface DatasetProvenanceProps {
  dataset: Dataset;
}

/**
 * Provenance stamp: simulated data is hatched, real data is solid and dated.
 * The details stay one click away from every result they qualify.
 */
export function DatasetProvenance({ dataset }: DatasetProvenanceProps) {
  const example = dataset.kind === 'example';

  return (
    <div className="provenance">
      <div className="provenance-line">
        <span className={'provenance-stamp ' + (example ? 'is-simulated' : 'is-real')} data-testid="provenance-badge">
          {example ? "Données d'exemple, simulation" : 'Données réelles'}
        </span>
        <span className="t-data provenance-count">{dataset.items.length} contenus</span>
      </div>
      <details className="provenance-details">
        <summary>
          Voir la provenance
          <ChevronDown size={14} className="provenance-chevron" aria-hidden="true" />
        </summary>
        <div className="provenance-body">
          <dl>
            {[
              { label: 'Source', value: dataset.source },
              { label: 'Licence', value: dataset.license },
              { label: 'Fraîcheur', value: dataset.freshness },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {dataset.sourceUrl && (
            <a href={dataset.sourceUrl} target="_blank" rel="noopener noreferrer">
              Source des données <ExternalLink size={12} aria-hidden="true" />
            </a>
          )}
          {dataset.methodologyNote && (
            <p className="provenance-method">
              <strong>Construction des métriques</strong>
              {dataset.methodologyNote}
            </p>
          )}
          <p className="provenance-caveat">
            {example
              ? 'Jeu fabriqué pour apprendre : il ne décrit aucun comportement réellement observé.'
              : 'Mesures publiques collectées auprès de Tournesol, recalculées pour une expérience de classement. Aucune recommandation observée sur YouTube.'}
          </p>
        </div>
      </details>
    </div>
  );
}
