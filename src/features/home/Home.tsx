import { ArrowDownRight, ArrowRight, ArrowUpRight, Database, SlidersHorizontal } from 'lucide-react';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { COLLECTIVE_STRATEGY, POPULARITY_STRATEGY, computeResults } from '@/core/data/strategies';

interface HomeProps {
  onNavigate: (view: 'home' | 'discover' | 'lab') => void;
}

const comparisons = [
  { name: 'Popularité', results: computeResults(EXAMPLE_DATASET.items, POPULARITY_STRATEGY, {}) },
  { name: 'Score collectif', results: computeResults(EXAMPLE_DATASET.items, COLLECTIVE_STRATEGY, {}) },
];

export function Home({ onNavigate }: HomeProps) {
  return (
    <main>
      <section className="border-b border-neutral-200">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-16 pt-16 sm:px-8 md:pb-24 md:pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:items-center lg:gap-20 lg:px-12">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.17em] text-neutral-500">
              <span className="h-px w-8 bg-neutral-500" />
              Laboratoire indépendant · 001
            </div>
            <h1 className="max-w-3xl text-[clamp(3rem,6.3vw,6.6rem)] font-semibold leading-[1.015] tracking-[-0.075em]">
              Qui décide
              <br />
              <span className="text-neutral-400">ce que vous</span>
              <br />
              voyez ?
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-neutral-600 sm:text-lg">
              Les algorithmes ne montrent pas tous la même chose. Ici, vous pouvez voir comment
              différentes règles de recommandation modifient un classement, sur des données
              dont l’origine et les limites sont explicites.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('lab')}
                className="inline-flex items-center gap-3 rounded-xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Lancer une expérience <ArrowRight size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('discover')}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-sm font-semibold transition hover:border-neutral-500"
              >
                Comprendre le sujet <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              L’aperçu ci-contre utilise uniquement des données simulées.
            </p>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_24px_80px_-60px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">Aperçu pédagogique</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">Un catalogue, deux classements.</h2>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100">
                <SlidersHorizontal size={17} className="text-neutral-600" aria-hidden="true" />
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-neutral-100">
              {comparisons.map(({ name, results }) => (
                <div key={name} className="min-w-0 p-4 sm:p-6">
                  <div className="mb-5 text-xs font-semibold text-neutral-700">{name}</div>
                  <ol className="space-y-4">
                    {results.slice(0, 4).map(({ item, score }, index) => (
                      <li key={item.id}>
                        <div className="flex items-start gap-2">
                          <span className="w-5 shrink-0 font-mono text-[11px] text-neutral-400">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 min-h-[2.5em] text-xs font-medium leading-5 text-neutral-800">
                              {item.title}
                            </p>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                              <div className="h-full rounded-full bg-neutral-900" style={{ width: Math.round(score * 100) + '%' }} />
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-6 py-4 text-[11px] text-neutral-500">
              <span>Simulation · {EXAMPLE_DATASET.itemCount} contenus</span>
              <span>Les rangs changent <ArrowDownRight size={13} className="inline" aria-hidden="true" /></span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.17em] text-neutral-500">Le principe</p>
            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
              Moins d’affirmations. Plus de preuves.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-neutral-600">
            Un espace pour observer, manipuler et questionner des modèles de classement sans
            confondre expériences et comportements réels de plateformes.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 md:grid-cols-3">
          {[
            { icon: Database, number: '01', title: 'Vérifier les données', text: 'Source, licence, date et nature des données visibles avant toute interprétation.' },
            { icon: SlidersHorizontal, number: '02', title: 'Modifier les règles', text: 'Choisissez une stratégie et ajustez ses paramètres pour comparer les effets.' },
            { icon: ArrowRight, number: '03', title: 'Expliquer les rangs', text: 'Découvrez pourquoi un contenu remonte ou recule et quelles limites restent.' },
          ].map(({ icon: Icon, number, title, text }) => (
            <div key={number} className="bg-white p-7 sm:p-9">
              <div className="mb-10 flex items-center justify-between text-neutral-500">
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                <span className="font-mono text-xs">{number} / 03</span>
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.025em]">{title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-7 text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center lg:px-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">Prêt à comparer ?</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Changez une règle. Observez le résultat.</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('lab')}
            className="inline-flex items-center gap-3 rounded-xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
          >
            Entrer dans le laboratoire <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
