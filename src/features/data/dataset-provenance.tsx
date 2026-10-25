import type { Dataset } from '@/core/data/types';

interface DatasetProvenanceProps {
  dataset: Dataset;
}

export function DatasetProvenance({ dataset }: DatasetProvenanceProps) {
  const isExample = dataset.kind === 'example';

  return (
    <section className="border border-slate-200 rounded-lg bg-white p-4">
      <div className="flex items-start gap-2 mb-2">
        {isExample ? (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
            Données d'exemple — simulation
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
            Donnée réelle
          </span>
        )}
        <span className="ml-auto text-xs text-slate-500">{dataset.itemCount} items</span>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <dt className="font-medium text-slate-700">Source</dt>
        <dd className="text-slate-600">{dataset.source}</dd>
        <dt className="font-medium text-slate-700">Licence</dt>
        <dd className="text-slate-600">{dataset.license}</dd>
        <dt className="font-medium text-slate-700">Fraîcheur</dt>
        <dd className="text-slate-600">{dataset.freshness}</dd>
        <dt className="font-medium text-slate-700">Type de donnée</dt>
        <dd className="text-slate-600 capitalize">{dataset.kind}</dd>
      </dl>
      {isExample && (
        <p className="mt-3 text-xs text-amber-700 bg-amber-50/50 rounded p-2">
          Ce jeu de données est fabriqué à titre d'exemple uniquement. Il ne reflète
          aucun comportement réellement observé sur une plateforme.
        </p>
      )}
    </section>
  );
}
