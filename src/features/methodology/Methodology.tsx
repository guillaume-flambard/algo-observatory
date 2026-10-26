import { ArrowRight, ArrowUpRight, Database, Fingerprint, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useApp } from '@/App';

const principles = [
  { number: '01', icon: Database, title: 'Provenance', description: 'Distinguer les données observées, les métriques dérivées et les simulations.' },
  { number: '02', icon: ShieldCheck, title: 'Licence', description: 'Identifier les conditions de réutilisation et les restrictions de chaque source.' },
  { number: '03', icon: RefreshCcw, title: 'Fraîcheur', description: 'Dater les captures. Une copie historique n’est jamais présentée comme un flux en direct.' },
  { number: '04', icon: Fingerprint, title: 'Reproductibilité', description: 'Mêmes contenus, même stratégie, mêmes paramètres : même classement calculé.' },
];

const sources = [
  { id: 'S-001', name: 'Données d’exemple', status: 'Simulation', statusClass: 'studio-state-demo',
    description: 'Huit œuvres et des métriques fictives pour comprendre les choix de classement.', note: 'Données construites pour la démonstration', url: null as string | null },
  { id: 'S-002', name: 'Tournesol', status: 'Capture publique', statusClass: 'studio-state-public',
    description: '24 recommandations publiques collectées le 25 octobre 2026, licence ODC-BY 1.0. Les quatre métriques utilisées dans le laboratoire sont dérivées des champs publics.', note: 'Instantané daté, transformations documentées', url: 'https://tournesol.app/' },
  { id: 'S-003', name: 'Bluesky', status: 'Non connecté', statusClass: 'studio-state-unavailable',
    description: 'Une piste de recherche. Le projet n’observe actuellement ni flux Bluesky ni recommandations issues de ce réseau.', note: 'Aucun connecteur ni classement actif', url: 'https://bsky.social/' },
];

const strategies = [
  { id: '01', name: 'Popularité', definition: 'Trier par le signal de popularité.' },
  { id: '02', name: 'Score collectif', definition: 'Trier par un score de préférence collective.' },
  { id: '03', name: 'Diversité', definition: 'Sélection itérative avec prise en compte des catégories représentées.' },
  { id: '04', name: 'Hybride', definition: 'Combiner plusieurs signaux à l’aide de poids explicites.' },
];

export function Methodology() {
  const { setView } = useApp();
  return (
    <main className="ao-interior studio-method">
      <header className="studio-method-head">
        <h1>Les résultats comptent.<br /><span>La méthode aussi.</span></h1>
        <p>Une expérience n’est vérifiable que si les sources, les transformations et les limites sont accessibles. Voici ce qui est observé, calculé et seulement simulé.</p>
      </header>
      <section className="studio-method-section" aria-labelledby="method-principles">
        <div className="studio-method-section-title"><h2 id="method-principles">Quatre conditions de confiance.</h2></div>
        <div className="studio-method-principles">
          {principles.map(({ number, title, description, icon: Icon }) => (
            <article key={number}>
              <Icon size={20} aria-hidden="true" /><h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-method-section" aria-labelledby="method-sources">
        <div className="studio-method-section-title"><h2 id="method-sources">Le registre des données.</h2></div>
        <div className="studio-method-source-head" aria-hidden="true"><span>Réf.</span><span>Origine et état</span><span>Ce qu’on peut affirmer</span></div>
        <div className="studio-method-sources">
          {sources.map((source) => (
            <article key={source.id}>
              <span className="studio-section-code">{source.id}</span>
              <div className="studio-source-identity"><h3>{source.name}</h3><span className={'studio-source-state ' + source.statusClass}>{source.status}</span></div>
              <div className="studio-source-note">
                <p>{source.description}</p>
                <span>{source.note}</span>
                {source.url && <a href={source.url} rel="noopener noreferrer" target="_blank">Consulter la source <ArrowUpRight size={14} aria-hidden="true" /></a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-method-section" aria-labelledby="method-strategies">
        <div className="studio-method-section-title"><h2 id="method-strategies">Quatre stratégies inspectables.</h2></div>
        <div className="studio-method-strategies">
          {strategies.map((strategy) => (
            <div key={strategy.id}><span className="studio-section-code">{strategy.id}</span><h3>{strategy.name}</h3><p>{strategy.definition}</p></div>
          ))}
        </div>
      </section>
      <section className="studio-method-cta">
        <div><h2>Ne croyez pas un classement. Testez-le.</h2><p>Changez la règle dans le laboratoire, puis inspectez les données et la provenance.</p></div>
        <button type="button" onClick={() => setView('lab')}>Vérifier un classement <ArrowRight size={16} aria-hidden="true" /></button>
      </section>
    </main>
  );
}
