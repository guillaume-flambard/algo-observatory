import { ArrowRight, ArrowUpRight, Database, Fingerprint, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useApp } from '@/App';
import { PageHead } from '@/core/ui/PageHead';

const principles = [
  { number: '01', icon: Database, title: 'Provenance', description: 'Dire d’où vient chaque chiffre : mesuré, recalculé ou inventé pour l’exemple.' },
  { number: '02', icon: ShieldCheck, title: 'Licence', description: 'Dire ce qu’on a le droit de faire avec chaque source, et à qui on doit la citer.' },
  { number: '03', icon: RefreshCcw, title: 'Fraîcheur', description: 'Dater chaque copie. Une photo des données d’un jour n’est jamais présentée comme du direct.' },
  { number: '04', icon: Fingerprint, title: 'Reproductibilité', description: 'Mêmes contenus, même règle, mêmes réglages : même classement, pour tout le monde.' },
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
  { id: '01', name: 'Popularité', definition: 'Met en haut les contenus les plus vus.' },
  { id: '02', name: 'Score collectif', definition: 'Met en haut les contenus que la communauté juge les plus utiles.' },
  { id: '03', name: 'Diversité', definition: 'Alterne les catégories pour que le haut du classement ne parle pas d’un seul sujet.' },
  { id: '04', name: 'Hybride', definition: 'Mélange les trois critères, selon un dosage que vous réglez.' },
];

export function Methodology() {
  const { setView } = useApp();
  return (
    <main className="page ao-interior studio-method">
      <PageHead
        title={<>Les résultats comptent.<br />La méthode aussi.</>}
        lead="Un classement ne vaut que si l’on peut vérifier d’où viennent ses chiffres et comment ils ont été calculés. Voici ce qui est mesuré, ce qui est calculé et ce qui est simplement inventé pour l’exemple."
      />

      <section className="page-section page-band" aria-labelledby="method-principles">
        <div className="page-container">
          <div className="section-head"><h2 id="method-principles" className="section-title">Quatre conditions de confiance.</h2></div>
          <div className="studio-method-principles">
            {principles.map(({ number, title, description, icon: Icon }) => (
              <article key={number}>
                <h3 className="item-title method-principle-title"><Icon size={18} strokeWidth={1.75} aria-hidden="true" /> {title}</h3>
                <p className="page-small">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section" aria-labelledby="method-sources">
        <div className="page-container">
          <div className="section-head"><h2 id="method-sources" className="section-title">Le registre des données.</h2></div>
          <div className="studio-method-source-head" aria-hidden="true"><span>Réf.</span><span>Origine et état</span><span>Ce qu’on peut affirmer</span></div>
          <div className="studio-method-sources">
            {sources.map((source) => (
              <article key={source.id}>
                <span className="t-data method-ref">{source.id}</span>
                <div className="studio-source-identity"><h3 className="item-title">{source.name}</h3><span className={'studio-source-state ' + source.statusClass}>{source.status}</span></div>
                <div className="studio-source-note">
                  <p>{source.description}</p>
                  <span>{source.note}</span>
                  {source.url && <a href={source.url} rel="noopener noreferrer" target="_blank" className="btn btn-link">Consulter la source <ArrowUpRight size={14} aria-hidden="true" /></a>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section page-band" aria-labelledby="method-strategies">
        <div className="page-container">
          <div className="section-head"><h2 id="method-strategies" className="section-title">Quatre règles, écrites en clair.</h2></div>
          <div className="studio-method-strategies">
            {strategies.map((strategy) => (
              <div key={strategy.id}><span className="t-data method-ref">{strategy.id}</span><h3 className="item-title">{strategy.name}</h3><p>{strategy.definition}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section" aria-labelledby="method-cta">
        <div className="page-container page-cta">
          <div>
            <h2 id="method-cta" className="section-title">Ne croyez pas un classement. Testez-le.</h2>
            <p className="section-lead">Changez la règle dans le laboratoire, puis vérifiez les données et leur origine.</p>
          </div>
          <button type="button" onClick={() => setView('lab')} className="btn btn-primary">Vérifier un classement <ArrowRight size={16} aria-hidden="true" /></button>
        </div>
      </section>
    </main>
  );
}
