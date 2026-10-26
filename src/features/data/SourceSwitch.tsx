import { Loader2 } from 'lucide-react';
import type { Dataset } from '@/core/data/types';
import { DatasetProvenance } from './dataset-provenance';

interface SourceSwitchProps {
  dataset: Dataset;
  onSelect: (source: 'simulation' | 'snapshot') => void;
  loading?: boolean;
}

/** The one data source picker, followed by the provenance stamp of what is loaded. */
export function SourceSwitch({ dataset, onSelect, loading = false }: SourceSwitchProps) {
  const real = dataset.kind === 'real';
  return (
    <div className="source-bar">
      <div className="segmented" role="group" aria-label="Source des données">
        <button type="button" aria-pressed={!real} onClick={() => onSelect('simulation')} disabled={loading}>
          Données d’exemple <span className="segmented-sub">8 contenus simulés</span>
        </button>
        <button type="button" aria-pressed={real} onClick={() => onSelect('snapshot')} disabled={loading}>
          Tournesol, données publiques
          {loading ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <span className="segmented-sub">24 contenus réels</span>}
        </button>
      </div>
      <DatasetProvenance dataset={dataset} />
    </div>
  );
}
