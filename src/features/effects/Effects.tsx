import { ArrowRight, ArrowUpRight, Fingerprint, Layers3, Scale } from 'lucide-react';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { ALL_STRATEGIES, computeResults } from '@/core/data/strategies';
import { useApp } from '@/App';
import { useState } from 'react';
import { RankLedger } from '@/features/lab/RankLedger';

const observations = [
  {
    number: '01',
    icon: ArrowUpRight,
    title: 'Biais de popularité',
    subtitle: 'Renforcement des contenus déjà visibles',
    body: 'Un classement par popularité fait remonter les contenus ayant les plus forts scores de popularité. Les autres signaux n’interviennent pas dans cette stratégie pédagogique.',
    limit: 'Ce mécanisme seul ne démontre pas une amplification réelle sur une plateforme.',
  },
  {
    number: '02',
    icon: Fingerprint,
    title: 'Bulle de filtre',
    subtitle: 'Une hypothèse à tester, pas un résultat établi ici',
    body: 'La personnalisation peut réduire l’exposition à des contenus différents des préférences déduites. Notre jeu de démonstration ne contient aucun profil utilisateur ni historique de navigation.',
    limit: 'Ce laboratoire ne mesure donc pas l’existence d’une bulle de filtre.',
  },
  {
    number: '03',
    icon: Layers3,
    title: 'Homogénéité',
    subtitle: 'Des catégories parfois concentrées',
    body: 'En comparant les rangs, on peut observer si des contenus de même catégorie occupent les premières positions. La stratégie Diversité applique une sélection itérative qui favorise l’alternance.',
    limit: 'Le résultat dépend entièrement du catalogue et des règles choisies.',
  },
  {
    number: '04',
    icon: Scale,
    title: 'Équilibre hybride',
    subtitle: 'Des objectifs que l’on peut pondérer',
    body: 'La stratégie Hybride combine popularité, score collectif et diversité. Modifier un poids peut déplacer un contenu même si ses métriques ne changent pas.',
    limit: 'Le meilleur équilibre est un choix de conception, pas un score universel.',
  },
];

export function Effects() {
  const { setView } = useApp();
  const [targetId, setTargetId] = useState('collective');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const target = ALL_STRATEGIES.find((strategy) => strategy.id === targetId) ?? ALL_STRATEGIES[1]!;
  const resultsByStrategy = Object.fromEntries(
    ALL_STRATEGIES.map((strategy) => [strategy.id, computeResults(EXAMPLE_DATASET.items, strategy, {})]),
  );

  return (
    <main className="ao-interior ao-effects">
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-14 sm:px-8 lg:px-12 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.6fr] lg:items-end">
            <h1 className="max-w-4xl text-[clamp(2.9rem,5.7vw,5.5rem)] font-semibold leading-[1.04] tracking-[-0.065em]">
              Les algorithmes ne sont pas neutres.
            </h1>
            <p className="max-w-md text-base leading-8 text-neutral-600">
              Modifier une règle de classement peut changer le parcours d’un contenu.
              Voici ce que notre simulation permet de voir, et ce qu’elle ne permet pas d’affirmer.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.05em]">Un catalogue. Plusieurs ordres.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
              Les traits correspondent à des classements réellement calculés dans cette application,
              mais sur un catalogue <strong>entièrement simulé</strong>. Testez plusieurs comparaisons.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView('lab')}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-semibold text-white transition hover:bg-neutral-700"
          >
            Modifier les paramètres <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="effects-ledger">
          <div className="effects-ledger-head">
            <label htmlFor="effects-target" className="t-label">Comparer Popularité avec</label>
            <select id="effects-target" value={targetId} onChange={(event) => { setTargetId(event.target.value); setSelectedId(null); }}>
              {ALL_STRATEGIES.slice(1).map((strategy) => <option key={strategy.id} value={strategy.id}>{strategy.name}</option>)}
            </select>
          </div>
          <RankLedger
            referenceName={ALL_STRATEGIES[0]!.name}
            experimentName={target.name}
            reference={resultsByStrategy[ALL_STRATEGIES[0]!.id]!}
            experiment={resultsByStrategy[target.id]!}
            selectedId={selectedId ?? 'i-6'}
            onSelect={setSelectedId}
            limit={EXAMPLE_DATASET.items.length}
            revision={target.id}
          />
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mb-10 grid gap-7 lg:grid-cols-[0.65fr_1fr] lg:items-end">
            <div>
              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">
                Les effets méritent des preuves.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-neutral-600">
              Ces concepts servent à formuler des questions. Le laboratoire montre uniquement les conséquences
              calculées de ses propres règles ; il n’observe ni les choix ni les intentions d’une plateforme réelle.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 md:grid-cols-2">
            {observations.map(({ number, icon: Icon, title, subtitle, body, limit }) => (
              <article key={number} className="flex flex-col bg-white p-7 sm:p-9">
                <div className="mb-9 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                    <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.035em]">{title}</h3>
                <p className="mt-2 text-xs font-semibold text-neutral-500">{subtitle}</p>
                <p className="mt-5 flex-1 text-sm leading-7 text-neutral-600">{body}</p>
                <p className="mt-7 border-t border-neutral-100 pt-5 text-xs leading-6 text-neutral-500">
                  <span className="font-semibold text-neutral-700">Limite : </span>{limit}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="flex flex-col items-start justify-between gap-8 bg-neutral-900 p-8 text-white sm:p-12 lg:flex-row lg:items-end">
          <div>
            <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em]">Changez les règles et vérifiez vous-même.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-300">
              Chaque calcul est explicable ; chaque source de données est signalée.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView('lab')}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
          >
            Ouvrir le laboratoire <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
