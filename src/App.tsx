import { useState } from 'react';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { DatasetProvenance } from '@/features/data/dataset-provenance';
import { Home } from '@/features/home/Home';
import { Lab } from '@/features/lab/Lab';

export function App() {
  const [view, setView] = useState<'home' | 'lab'>('home');

  return (
    <div className="min-h-screen flex flex-col">
      {view === 'home' ? (
        <>
          <Home />
          <section className="max-w-4xl mx-auto px-6 py-12">
            <DatasetProvenance dataset={EXAMPLE_DATASET} />
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setView('lab')}
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                Ouvrir le laboratoire
              </button>
            </div>
          </section>
        </>
      ) : (
        <Lab />
      )}
    </div>
  );
}
