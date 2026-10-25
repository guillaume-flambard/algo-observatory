import { ArrowRight, ArrowUpRight, BookOpenCheck, Database, Fingerprint, RefreshCcw, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useApp } from '@/App';

const principles = [
  {
    number: '01', icon: Database, title: 'Provenance',
    description: 'Afficher d’où viennent les données et distinguer explicitement une observation publique d’une simulation pédagogique.',
  },
  {
    number: '02', icon: ShieldCheck, title: 'Licence',
    description: 'Indiquer les conditions de réutilisation connues et ne pas présenter des données sans origine documentée comme publiques.',
  },
  {
    number: '03', icon: RefreshCcw, title: 'Fraîcheur',
    description: 'Documenter la date ou la méthode de génération, et ne jamais présenter une donnée d’exemple comme une mesure actuelle.',
  },
  {
    number: '04', icon: Fingerprint, title: 'Reproductibilité',
    description: 'Appliquer des règles déterministes : mêmes contenus, même stratégie et mêmes paramètres produisent le même ordre.',
  },
];

const sources = [
  {
    name: 'Données d’exemple',
    status: 'Actif — simulation',
    note: 'Un petit catalogue construit pour les démonstrations. Les valeurs des métriques sont fabriquées, et les noms des œuvres ne sont pas des observations de plateforme.',
    url: null as string | null,
  },
  {
    name: 'Tournesol',
    status: 'Actif — instantané public',
    note: '24 recommandations issues de l’API publique Tournesol, collectées le 25 octobre 2026 et conservées localement sous licence ODC-BY 1.0. Les vues YouTube, scores collectifs et notes de diversité-inclusion sont transformés en entrées normalisées. Aucun accès direct à l’API ni classement de YouTube n’est revendiqué.',
    url: 'https://tournesol.app/',
  },
  {
    name: 'Bluesky',
    status: 'Piste de recherche',
    note: 'Une éventuelle future étude des flux publics et de leurs mécanismes de sélection. Aucune intégration Bluesky n’est opérationnelle dans le laboratoire actuel.',
    url: 'https://bsky.social/',
  },
];

export function Methodology() {
  const { setView } = useApp();

  return (
    <main>
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-14 sm:px-8 lg:px-12 lg:pb-20">
          <p className="mb-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-neutral-500">
            <BookOpenCheck size={15} aria-hidden="true" /> Méthode / 05 — Sources
          </p>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.58fr] lg:items-end">
            <h1 className="max-w-4xl text-[clamp(2.9rem,5.7vw,5.5rem)] font-semibold leading-[1.04] tracking-[-0.065em]">
              Les résultats comptent. <span className="text-neutral-400">La méthode aussi.</span>
            </h1>
            <p className="max-w-lg text-base leading-8 text-neutral-600">
              Chaque expérience doit permettre de vérifier la nature des données, les règles
              de calcul et les limites de ce qu’on peut raisonnablement en déduire.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mb-10 grid gap-5 lg:grid-cols-[0.65fr_1fr] lg:items-end">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.17em] text-neutral-500">Engagement de transparence</p>
            <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Quatre critères de confiance.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-neutral-600">
            Nous privilégions une expérience modeste mais vérifiable à des visualisations spectaculaires
            qui feraient passer une démonstration pour une enquête sur une plateforme réelle.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 md:grid-cols-2">
          {principles.map(({ number, icon: Icon, title, description }) => (
            <article key={number} className="bg-white p-7 sm:p-9">
              <div className="mb-9 flex items-center justify-between">
                <Icon size={21} strokeWidth={1.5} className="text-neutral-600" aria-hidden="true" />
                <span className="font-mono text-xs text-neutral-400">{number} / 04</span>
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.035em]">{title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-neutral-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mb-9">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.17em] text-neutral-500">Catalogue des sources</p>
            <h2 className="text-3xl font-semibold tracking-[-0.045em]">Ce qui est connecté. Ce qui ne l’est pas.</h2>
          </div>
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {sources.map((source, index) => (
              <article key={source.name} className="grid gap-5 py-8 lg:grid-cols-[60px_240px_1fr] lg:gap-8">
                <span className="font-mono text-xs text-neutral-400">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-lg font-semibold">{source.name}</h3>
                  <span className="mt-2 inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
                    {source.status}
                  </span>
                </div>
                <div>
                  <p className="max-w-2xl text-sm leading-7 text-neutral-600">{source.note}</p>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 underline-offset-4 hover:underline"
                    >
                      Site du projet <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-10 rounded-[24px] border border-neutral-200 bg-white p-7 sm:p-10 lg:grid-cols-[0.7fr_1fr] lg:gap-16">
          <div>
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100">
              <SlidersHorizontal size={20} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">Stratégies implémentées.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600">
              Les stratégies du laboratoire sont des modèles simplifiés et inspectables.
              Elles ne prétendent pas reconstruire l’algorithme d’une entreprise.
            </p>
          </div>
          <div className="divide-y divide-neutral-100">
            {[
              { title: 'Popularité', text: 'Classement par score de popularité fourni avec le jeu de données.' },
              { title: 'Score collectif', text: 'Classement par score collectif fourni avec le jeu de données.' },
              { title: 'Diversité', text: 'Sélection itérative qui ajuste la priorité des catégories déjà retenues.' },
              { title: 'Hybride', text: 'Combinaison pondérée des trois signaux ; les poids sont modifiables.' },
            ].map(({ title, text }, index) => (
              <div key={title} className="grid gap-3 py-4 sm:grid-cols-[36px_150px_1fr]">
                <span className="font-mono text-xs text-neutral-400">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-xs leading-6 text-neutral-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
          <p className="max-w-xl text-xs leading-6 text-neutral-500">
            Retrouvez les explications exactes de chaque contenu directement dans le laboratoire.
          </p>
          <button
            type="button"
            onClick={() => setView('lab')}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-semibold text-white transition hover:bg-neutral-700"
          >
            Vérifier un classement <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
