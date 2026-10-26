import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Fingerprint, Layers3, Scale } from 'lucide-react';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { ALL_STRATEGIES, computeResults } from '@/core/data/strategies';
import { useApp } from '@/App';
import { PageHead } from '@/core/ui/PageHead';
import { RankLedger } from '@/features/lab/RankLedger';

const observations = [
  {
    icon: ArrowUpRight,
    title: 'Biais de popularité',
    subtitle: 'Ce qui est déjà vu devient encore plus visible',
    body: 'Une règle qui ne regarde que la popularité met en haut ce que beaucoup de gens ont déjà vu. Elle ne tient compte ni de la qualité ni de la variété.',
    limit: 'Ce mécanisme seul ne démontre pas une amplification réelle sur une plateforme.',
  },
  {
    icon: Fingerprint,
    title: 'Bulle de filtre',
    subtitle: 'Une hypothèse à tester, pas un résultat établi ici',
    body: 'Quand une plateforme personnalise ses suggestions, elle peut vous montrer de moins en moins de choses différentes de vos habitudes. Notre jeu d’exemple ne contient ni profil ni historique.',
    limit: 'Ce laboratoire ne mesure donc pas l’existence d’une bulle de filtre.',
  },
  {
    icon: Layers3,
    title: 'Homogénéité',
    subtitle: 'Le haut du classement parle parfois d’un seul sujet',
    body: 'En comparant deux classements, on voit si les premières places sont occupées par la même catégorie. La règle Diversité alterne volontairement les catégories.',
    limit: 'Le résultat dépend entièrement du catalogue et des règles choisies.',
  },
  {
    icon: Scale,
    title: 'Équilibre hybride',
    subtitle: 'On peut doser plusieurs objectifs',
    body: 'La règle Hybride mélange popularité, avis de la communauté et diversité. Changer un dosage peut déplacer un contenu, même si le contenu lui-même ne change pas.',
    limit: 'Le meilleur équilibre est un choix, pas une vérité mathématique.',
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
    <main className="page ao-interior ao-effects">
      <PageHead
        title="Les algorithmes ne sont pas neutres."
        lead="La même liste de contenus, rangée par deux règles différentes, ne donne pas le même ordre. Voici ce que cela permet de voir, et ce que cela ne prouve pas."
        actions={<button type="button" onClick={() => setView('lab')} className="btn btn-primary">Modifier les règles <ArrowRight size={16} aria-hidden="true" /></button>}
      />

      <section className="page-section page-band" aria-labelledby="effects-demo">
        <div className="page-container">
          <div className="section-head">
            <h2 id="effects-demo" className="section-title">Un catalogue. Plusieurs ordres.</h2>
            <p className="section-lead">
              Chaque trait relie un même film dans deux classements calculés par l’application, sur un catalogue
              <strong> entièrement simulé</strong>. Touchez un film pour suivre son trajet.
            </p>
          </div>
          <div className="effects-ledger">
            <div className="effects-ledger-head">
              <label htmlFor="effects-target" className="t-meta">Comparer Popularité avec</label>
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
        </div>
      </section>

      <section className="page-section" aria-labelledby="effects-list">
        <div className="page-container">
          <div className="section-head">
            <h2 id="effects-list" className="section-title">Les effets méritent des preuves.</h2>
            <p className="section-lead">
              Ces mots servent à poser des questions. Le laboratoire montre ce que font ses propres règles ; il n’observe
              ni les choix ni les intentions d’une plateforme réelle.
            </p>
          </div>
          <div className="effects-grid">
            {observations.map(({ icon: Icon, title, subtitle, body, limit }) => (
              <article key={title} className="effects-card">
                <h3 className="item-title effects-card-title"><Icon size={18} strokeWidth={1.75} aria-hidden="true" /> {title}</h3>
                <p className="effects-card-subtitle">{subtitle}</p>
                <p className="page-small">{body}</p>
                <p className="effects-card-limit"><strong>Limite :</strong> {limit}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section page-band" aria-labelledby="effects-cta">
        <div className="page-container page-cta">
          <div>
            <h2 id="effects-cta" className="section-title">Changez les règles et vérifiez vous-même.</h2>
            <p className="section-lead">Chaque calcul s’explique et chaque source de données est indiquée.</p>
          </div>
          <button type="button" onClick={() => setView('lab')} className="btn btn-primary">
            Ouvrir le laboratoire <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
