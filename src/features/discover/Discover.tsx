import { ArrowRight, ArrowUpRight, EyeOff, Layers3, ListOrdered, SlidersHorizontal } from 'lucide-react';
import { PageHead } from '@/core/ui/PageHead';

interface DiscoverProps {
  onNavigate: (view: 'home' | 'discover' | 'lab') => void;
}

const steps = [
  {
    icon: Layers3,
    title: 'Il y a trop de contenus',
    text: 'Une plateforme a beaucoup plus de vidéos, d’articles ou de morceaux qu’elle ne peut en montrer à la fois. Il faut choisir.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Chaque contenu reçoit une note',
    text: 'La note mélange plusieurs critères : combien de personnes l’ont vu, ce qu’elles en pensent, la variété des sujets. Le mélange s’appelle une règle.',
  },
  {
    icon: ListOrdered,
    title: 'Les mieux notés passent devant',
    text: 'Les contenus sont rangés du mieux noté au moins bien noté. Ce qui est en haut est vu ; le reste l’est beaucoup moins.',
  },
];

export function Discover({ onNavigate }: DiscoverProps) {
  return (
    <main className="page ao-interior ao-discover">
      <PageHead
        title="Derrière chaque fil, un choix."
        lead="Ce que vous voyez en premier sur une plateforme n’est pas le hasard. Un algorithme a rangé les contenus selon une règle. Voici comment, en trois étapes."
        actions={<button type="button" onClick={() => onNavigate('lab')} className="btn btn-primary">Essayer dans le laboratoire <ArrowRight size={16} aria-hidden="true" /></button>}
      />

      <section className="page-section page-band" aria-labelledby="discover-steps">
        <div className="page-container">
          <div className="section-head">
            <h2 id="discover-steps" className="section-title">Comment un classement se construit.</h2>
            <p className="section-lead">Une version simplifiée. Les vraies plateformes utilisent des règles bien plus complexes, mais le principe est le même.</p>
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
              Une vidéo très regardée peut être première avec une règle qui compte les vues, et huitième avec une règle
              qui écoute l’avis de la communauté. Le contenu n’a pas changé : seule la règle a changé.
            </p>
          </div>
          <aside className="page-note" aria-label="Ce qu’on ne peut pas déduire">
            <p className="page-note-title"><EyeOff size={17} aria-hidden="true" /> Ce qu’on ne peut pas déduire</p>
            <p className="page-small">
              Le laboratoire compare des règles écrites en clair, sur des données dont l’origine est affichée.
              Il <strong>ne révèle pas</strong> les règles secrètes d’une plateforme réelle, qu’il n’a pas observées.
            </p>
          </aside>
        </div>
      </section>

      <section className="page-section page-band" aria-labelledby="discover-cta">
        <div className="page-container page-cta">
          <div>
            <h2 id="discover-cta" className="section-title">Ne nous croyez pas sur parole. Comparez.</h2>
            <p className="section-lead">Choisissez une règle, bougez ses curseurs et regardez quels contenus montent ou descendent.</p>
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
