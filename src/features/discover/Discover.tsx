import { ArrowRight, ArrowUpRight, EyeOff, Layers3, ListOrdered, SlidersHorizontal } from 'lucide-react';
import { PageHead } from '@/core/ui/PageHead';

interface DiscoverProps {
  onNavigate: (view: 'home' | 'discover' | 'lab') => void;
}

const steps = [
  {
    icon: Layers3,
    title: 'Il y a trop de contenus',
    text: 'Une plateforme ne peut pas tout montrer.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Chaque contenu reçoit une note',
    text: 'Vues, avis, variété : leur mélange, c’est la règle.',
  },
  {
    icon: ListOrdered,
    title: 'Les mieux notés passent devant',
    text: 'Le haut de la liste est vu, le reste beaucoup moins.',
  },
];

export function Discover({ onNavigate }: DiscoverProps) {
  return (
    <main className="page ao-interior ao-discover">
      <PageHead
        title="Derrière chaque fil, un choix."
        lead="Ce que vous voyez en premier n’est pas le hasard : un algorithme a rangé les contenus selon une règle."
        actions={<button type="button" onClick={() => onNavigate('lab')} className="btn btn-primary">Essayer dans le laboratoire <ArrowRight size={16} aria-hidden="true" /></button>}
      />

      <section className="page-section page-band" aria-labelledby="discover-steps">
        <div className="page-container">
          <div className="section-head">
            <h2 id="discover-steps" className="section-title">Comment un classement se construit.</h2>
          </div>
          <ol className="steps">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title}>
                <span className="step-number" aria-hidden="true">{index + 1}</span>
                <h3 className="item-title discover-step-title"><Icon size={18} strokeWidth={1.75} aria-hidden="true" /> {title}</h3>
                <p className="page-small">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-section" aria-labelledby="discover-consequence">
        <div className="page-container discover-split">
          <div>
            <h2 id="discover-consequence" className="section-title">Changer la règle, c’est changer ce qui devient visible.</h2>
            <p className="section-lead">
              Premier si l’on compte les vues, huitième si l’on écoute la communauté : le film est le même, la règle non.
            </p>
          </div>
          <aside className="page-note" aria-label="Ce qu’on ne peut pas déduire">
            <p className="page-note-title"><EyeOff size={17} aria-hidden="true" /> Ce qu’on ne peut pas déduire</p>
            <p className="page-small">
              Le laboratoire <strong>ne révèle pas</strong> les règles secrètes des vraies plateformes.
            </p>
          </aside>
        </div>
      </section>

      <section className="page-section page-band" aria-labelledby="discover-cta">
        <div className="page-container page-cta">
          <div>
            <h2 id="discover-cta" className="section-title">Ne nous croyez pas sur parole. Comparez.</h2>
            <p className="section-lead">Bougez un curseur, regardez ce qui bouge.</p>
            <a href="https://github.com/guillaume-flambard/algo-observatory" target="_blank" rel="noopener noreferrer" className="btn btn-link discover-code">
              Lire le code du projet <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
          <button type="button" onClick={() => onNavigate('lab')} className="btn btn-primary">
            Ouvrir le laboratoire <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
