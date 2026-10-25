import { ArrowRight, ArrowUpRight, BookOpenCheck, Database, Fingerprint, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useApp } from '@/App';

const principles = [
  { number: '01', icon: Database, title: 'Provenance', description: 'Afficher d’où viennent les données. Une observation publique n’est pas une simulation.' },
  { number: '02', icon: ShieldCheck, title: 'Licence', description: 'Identifier les conditions de réutilisation et les limites imposées par la source.' },
  { number: '03', icon: RefreshCcw, title: 'Fraîcheur', description: 'Dater la collecte ou la génération. Une capture historique n’est pas une mesure en direct.' },
  { number: '04', icon: Fingerprint, title: 'Reproductibilité', description: 'Mêmes contenus, même stratégie, mêmes paramètres : le classement calculé doit être identique.' },
];

const sources = [
  {
    number: 'S-001', name: 'Données d’exemple', status: 'SIMULATION', className: 'ao-source-demo',
    note: 'Huit œuvres et des scores construits pour enseigner le classement. Il ne s’agit pas d’observations de plateforme.',
    evidence: 'Valeurs fabriquées · provenance signalée',
    href: null as string | null,
  },
  {
    number: 'S-002', name: 'Tournesol', status: 'INSTANTANÉ PUBLIC', className: 'ao-source-public',
    note: '24 recommandations de l’API publique, recueillies le 25 octobre 2026 sous licence ODC-BY 1.0. Vues YouTube, scores collectifs et diversité-inclusion servent à calculer des entrées normalisées.',
    evidence: 'Collecte datée · transformations documentées',
    href: 'https://tournesol.app/',
  },
  {
    number: 'S-003', name: 'Bluesky', status: 'NON CONNECTÉ', className: 'ao-source-future',
    note: 'Une piste de recherche, pas une source active. Le projet n’observe actuellement ni flux Bluesky ni recommandations issues de ce réseau.',
    evidence: 'Aucune mesure · aucun classement',
    href: 'https://bsky.social/',
  },
];

const strategies = [
  ['01', 'Popularité', 'Classement par le signal de popularité du jeu de données.'],
  ['02', 'Score collectif', 'Classement par le signal de préférence collective.'],
  ['03', 'Diversité', 'Sélection itérative tenant compte des catégories déjà retenues.'],
  ['04', 'Hybride', 'Combinaison pondérée des signaux avec paramètres modifiables.'],
];

export function Methodology() {
  const { setView } = useApp();

  return (
    <main className="ao-interior ao-methodology">
      <section className="ao-chapter-opening" aria-labelledby="methodology-title">
        <div className="ao-chapter-index">
          <span><BookOpenCheck size={15} aria-hidden="true" /> THE FIELD GUIDE / 06</span>
          <span>PROTOCOLE / VERSION 01</span>
        </div>
        <div className="ao-chapter-grid">
          <div>
            <p className="ao-chapter-kicker">LE DOSSIER DES PREUVES</p>
            <h1 id="methodology-title">Les résultats comptent. <em>La méthode aussi.</em></h1>
          </div>
          <div className="ao-chapter-aside">
            <span>NOTE 001 — À LIRE AVANT D’INTERPRÉTER</span>
            <p>Ce que nous montrons doit rester vérifiable. Une donnée publique, un calcul sur cette donnée et une simulation ne sont <strong>pas la même chose.</strong></p>
            <div className="ao-vertical-rule" aria-hidden="true" />
            <p className="ao-aside-caption">Le but est d’examiner une règle, pas de prétendre connaître l’algorithme secret d’une plateforme.</p>
          </div>
        </div>
        <div className="ao-chapter-foot">
          <span>01 — PROVENANCE</span><span>02 — RÈGLES DE CALCUL</span><span>03 — LIMITES</span>
        </div>
      </section>

      <section className="ao-method-section" aria-labelledby="trust-heading">
        <div className="ao-section-number"><span>01</span> / CONDITIONS DE CONFIANCE</div>
        <div className="ao-method-section-heading">
          <h2 id="trust-heading">Quatre critères.<br /><em>Zéro boîte noire.</em></h2>
          <p>Un résultat n’est intéressant que si l’on peut retrouver son origine, comprendre comment il a été produit et identifier ce qu’il ne démontre pas.</p>
        </div>
        <div className="ao-principle-list">
          {principles.map(({ number, icon: Icon, title, description }) => (
            <article key={number} className="ao-principle-row">
              <span className="ao-row-num">{number} / 04</span>
              <Icon aria-hidden="true" size={22} strokeWidth={1.4} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ao-source-section" aria-labelledby="sources-heading">
        <div className="ao-section-number"><span>02</span> / REGISTRE DES SOURCES</div>
        <div className="ao-method-section-heading">
          <h2 id="sources-heading">Ce qui existe.<br /><em>Ce qui est imaginé.</em></h2>
          <p>Trois états clairement séparés. Un connecteur absent ne devient jamais une donnée réelle par simple changement de libellé.</p>
        </div>
        <div className="ao-source-register">
          <div className="ao-source-register-head" aria-hidden="true">
            <span>RÉF.</span><span>SOURCE / ÉTAT</span><span>CE QUE L’ON SAIT</span>
          </div>
          {sources.map((source) => (
            <article key={source.number} className="ao-source-entry">
              <span className="ao-row-num">{source.number}</span>
              <div className="ao-source-name">
                <h3>{source.name}</h3>
                <span className={'ao-source-status ' + source.className}>{source.status}</span>
              </div>
              <div className="ao-source-detail">
                <p>{source.note}</p>
                <div className="ao-source-evidence">
                  <span>{source.evidence}</span>
                  {source.href && <a href={source.href} rel="noopener noreferrer" target="_blank">Source externe <ArrowUpRight size={14} aria-hidden="true" /></a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ao-method-section" aria-labelledby="rules-heading">
        <div className="ao-section-number"><span>03</span> / RÈGLES INSPECTABLES</div>
        <div className="ao-method-section-heading">
          <h2 id="rules-heading">Les paramètres.<br /><em>Pas la magie.</em></h2>
          <p>Quatre modèles simplifiés ; aucun ne reconstitue un système de recommandation propriétaire.</p>
        </div>
        <div className="ao-strategy-ledger">
          {strategies.map(([number, name, description]) => (
            <div className="ao-strategy-ledger-row" key={name}>
              <span>{number}</span><h3>{name}</h3><p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ao-method-ending">
        <div className="ao-section-number"><span>04</span> / REPRODUIRE L’EXPÉRIENCE</div>
        <h2>Ne nous croyez pas.<br /><em>Vérifiez.</em></h2>
        <p>Le laboratoire permet de modifier une règle, comparer les classements et consulter les explications de chaque contenu.</p>
        <button type="button" onClick={() => setView('lab')}>Vérifier un classement <ArrowRight size={17} aria-hidden="true" /></button>
      </section>
    </main>
  );
}
