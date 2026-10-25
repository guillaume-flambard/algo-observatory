import { ChevronDown, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Dataset } from '@/core/data/types';
import { Badge } from '@/core/ui/Badge';

interface DatasetProvenanceProps {
  dataset: Dataset;
}

export function DatasetProvenance({ dataset }: DatasetProvenanceProps) {
  const example = dataset.kind === 'example';

  return (
    <div className="mt-5 border-t border-neutral-100 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant={example ? 'example' : 'real'} dataTestid="provenance-badge">
          {example ? "Données d'exemple — simulation" : 'Données réelles'}
        </Badge>
        <span className="font-mono text-[11px] text-neutral-400">{dataset.items.length} contenus</span>
      </div>
      <details className="group mt-4">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900">
          <ShieldCheck size={15} aria-hidden="true" />
          Voir la provenance
          <ChevronDown size={13} className="ml-auto transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <dl className="mt-4 space-y-3 text-[11px]">
          {[
            { label: 'Source', value: dataset.source },
            { label: 'Licence', value: dataset.license },
            { label: 'Fraîcheur', value: dataset.freshness },
          ].map(({ label, value }) => (
            <div key={label} className="border-t border-neutral-100 pt-3">
              <dt className="mb-1 font-semibold text-neutral-500">{label}</dt>
              <dd className="break-words leading-5 text-neutral-800">{value}</dd>
            </div>
          ))}
        </dl>
        {dataset.sourceUrl && (
          <a
            href={dataset.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold underline underline-offset-2"
          >
            Source des données <ExternalLink size={12} aria-hidden="true" />
          </a>
        )}
        <p className="mt-4 text-[11px] leading-5 text-neutral-500">
          {example
            ? 'Jeu fabriqué pour apprendre : il ne décrit aucun comportement réellement observé.'
            : 'Données publiques utilisées pour une expérience de classement. Aucune plateforme n’est observée ici.'}
        </p>
      </details>
    </div>
  );
}
