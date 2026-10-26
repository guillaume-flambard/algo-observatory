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
    body: 'Si la règle ne compte que les vues, le déjà-vu reste en haut.',
    limit: 'Cela ne prouve pas que les plateformes réelles amplifient.',
  },
  {
    icon: Fingerprint,
    title: 'Bulle de filtre',
    body: 'Une plateforme qui personnalise peut vous resservir toujours le même genre.',
    limit: 'Ce laboratoire ne mesure donc pas l’existence d’une bulle de filtre.',
  },
  {
    icon: Layers3,
    title: 'Homogénéité',
    body: 'Le haut du classement peut ne parler que d’un sujet.',
    limit: 'Le résultat dépend du catalogue et de la règle.',
  },
  {
    icon: Scale,
    title: 'Équilibre hybride',
    body: 'Changer le dosage déplace les contenus, sans qu’ils changent.',
    limit: 'Le bon dosage est un choix, pas une vérité.',
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
        lead="Même liste, deux règles, deux ordres différents. Voici ce que cela montre, et ce que cela ne prouve pas."
        actions={<button type="button" onClick={() => setView('lab')} className="btn btn-primary">Modifier les règles <ArrowRight size={16} aria-hidden="true" /></button>}
      />

      <section className="page-section page-band" aria-labelledby="effects-demo">
        <div className="page-container">
          <div className="section-head">
            <h2 id="effects-demo" className="section-title">Un catalogue. Plusieurs ordres.</h2>
            <p className="section-lead">
              Chaque trait relie un même film. Catalogue <strong>entièrement simulé</strong>.
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
          </div>
          <div className="effects-grid">
            {observations.map(({ icon: Icon, title, body, limit }) => (
              <article key={title} className="effects-card">
                <h3 className="item-title effects-card-title"><Icon size={18} strokeWidth={1.75} aria-hidden="true" /> {title}</h3>
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
            <p className="section-lead">Chaque calcul s’explique, chaque source est citée.</p>
          </div>
          <button type="button" onClick={() => setView('lab')} className="btn btn-primary">
            Ouvrir le laboratoire <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
