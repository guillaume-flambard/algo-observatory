import type { Dataset } from '@/core/data/types';
import { Badge } from '@/core/ui/Badge';
import { Card } from '@/core/ui/Card';

interface DatasetProvenanceProps {
  dataset: Dataset;
}

export function DatasetProvenance({ dataset }: DatasetProvenanceProps) {
  const isExample = dataset.kind === 'example';

  return (
    <Card className={isExample ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}>
      <div className="p-4">
        <div className="flex items-start gap-2 mb-3">
          <Badge variant={isExample ? 'example' : 'real'} dataTestid="provenance-badge">
            {isExample ? 'Données d\'exemple — simulation' : 'Donnée réelle'}
          </Badge>
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
          <p className="mt-3 text-xs text-amber-700">
            Ce jeu de données est fabriqué à titre d’exemple uniquement. Il ne reflète
            aucun comportement réellement observé sur une plateforme.
          </p>
        )}
      </div>
    </Card>
  );
}
