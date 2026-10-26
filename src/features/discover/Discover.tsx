import { ArrowLeft, ArrowRight, ArrowUpRight, EyeOff, Layers3, ListOrdered, MousePointer2 } from 'lucide-react';

interface DiscoverProps {
  onNavigate: (view: 'home' | 'discover' | 'lab') => void;
}

const steps = [
  {
    index: '01',
    icon: Layers3,
    title: 'Un catalogue de contenus',
    text: 'Une plateforme possède plus de contenus qu’elle ne peut en afficher à la fois : vidéos, articles, morceaux de musique…',
  },
  {
    index: '02',
    icon: MousePointer2,
    title: 'Des signaux transformés en scores',
    text: 'Popularité, évaluations, préférences ou diversité peuvent être combinées selon des règles différentes.',
  },
  {
    index: '03',
    icon: ListOrdered,
    title: 'Un ordre de présentation',
    text: 'Les contenus sont classés. Ce qui apparaît en tête reçoit généralement plus de visibilité.',
  },
];

export function Discover({ onNavigate }: DiscoverProps) {
  return (
    <main className="ao-interior ao-discover">
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-12 sm:px-8 lg:px-12 lg:pb-20">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="mb-12 inline-flex items-center gap-2 text-xs font-medium text-neutral-500 transition hover:text-neutral-900"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Retour à l’accueil
          </button>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.5fr] lg:items-end">
            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.17em] text-neutral-500">Guide / 01 — Comprendre</p>
              <h1 className="max-w-4xl text-[clamp(2.8rem,6vw,5.7rem)] font-semibold leading-[1.04] tracking-[-0.065em]">
                Derrière chaque fil, <span className="text-neutral-400">un choix.</span>
              </h1>
            </div>
            <p className="max-w-md text-base leading-8 text-neutral-600">
              Un algorithme de recommandation ne crée pas forcément les contenus que vous voyez.
              Il choisit lesquels montrer et dans quel ordre. Le résultat dépend des critères qui
              lui sont donnés.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.42fr_1fr] lg:gap-24 lg:px-12 lg:py-24">
        <div>
          <div className="lg:sticky lg:top-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-neutral-500">Le mécanisme</p>
            <h2 className="mt-4 max-w-xs text-3xl font-semibold tracking-[-0.045em]">Comment un classement se construit.</h2>
            <p className="mt-5 max-w-xs text-sm leading-7 text-neutral-600">
              Trois étapes simplifiées pour comprendre ce que le laboratoire rend visible.
              Les plateformes réelles peuvent employer des systèmes beaucoup plus complexes.
            </p>
          </div>
        </div>
        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {steps.map(({ index, icon: Icon, title, text }) => (
            <article key={index} className="grid gap-5 py-9 sm:grid-cols-[48px_1fr] sm:gap-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white">
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <p className="mb-2 font-mono text-[11px] text-neutral-400">{index} / 03</p>
                <h3 className="text-xl font-semibold tracking-[-0.025em]">{title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-24 lg:px-12 lg:py-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-neutral-500">Une conséquence très concrète</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
              Changer le critère, c’est changer ce qui devient visible.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-8 text-neutral-600">
              Un même contenu peut apparaître en premier avec une stratégie de popularité,
              mais plus bas avec une stratégie qui privilégie les évaluations collectives.
              Un classement n’est jamais indépendant de ses objectifs.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-[#f7f7f5] p-7 sm:p-9">
            <div className="mb-8 flex items-center gap-2 text-xs font-semibold">
              <EyeOff size={17} aria-hidden="true" /> Ce qu’on ne peut pas déduire
            </div>
            <p className="text-sm leading-7 text-neutral-700">
              Notre laboratoire compare des règles explicites sur un jeu de données identifié.
              Il <strong>ne révèle pas</strong> les poids, les mécanismes internes ou les
              intentions d’une plateforme dont nous n’avons pas observé le système.
            </p>
            <p className="mt-5 border-t border-neutral-200 pt-5 text-xs leading-6 text-neutral-500">
              Simulation et observations sont signalées séparément. Aucune conclusion sur
              une plateforme réelle n’est tirée de données fabriquées.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-8 bg-neutral-900 p-8 text-white sm:p-12 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-neutral-400">À vous de jouer</p>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
              Ne nous croyez pas sur parole. Comparez.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-300">
              Sélectionnez des stratégies, ajustez leurs paramètres et inspectez chaque résultat.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('lab')}
            className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
          >
            Ouvrir le laboratoire <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
        <a
          href="https://github.com/guillaume-flambard/algo-observatory"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 text-xs text-neutral-500 underline-offset-4 hover:underline"
        >
          Explorer le code et les méthodes du projet <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
