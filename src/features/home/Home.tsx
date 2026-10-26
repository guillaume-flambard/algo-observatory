import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { HYBRID_STRATEGY, POPULARITY_STRATEGY, computeResults } from '@/core/data/strategies';
import { PageHead } from '@/core/ui/PageHead';
import { RankLedger } from '@/features/lab/RankLedger';

interface HomeProps {
  onNavigate: (view: 'home' | 'discover' | 'lab') => void;
}

const catalog = EXAMPLE_DATASET.items;
const initial = computeResults(catalog, POPULARITY_STRATEGY, {});
const initialRanks = new Map(initial.map(({ item }, index) => [item.id, index + 1]));

export function Home({ onNavigate }: HomeProps) {
  const [collectiveWeight, setCollectiveWeight] = useState(65);
  const [selectedId, setSelectedId] = useState('i-6');

  // Only the strategy weights change; the items and the scoring function are
  // the same deterministic code as in the laboratory.
  const result = useMemo(
    () => computeResults(catalog, HYBRID_STRATEGY, {
      w_popularity: (100 - collectiveWeight) / 100,
      w_collective: collectiveWeight / 100,
      w_diversity: 0,
    }),
    [collectiveWeight],
  );
  const currentRanks = useMemo(() => new Map(result.map(({ item }, index) => [item.id, index + 1])), [result]);
  const selected = catalog.find((item) => item.id === selectedId) ?? catalog[0]!;
  const before = initialRanks.get(selected.id) ?? 1;
  const after = currentRanks.get(selected.id) ?? before;
  const delta = before - after;
  const changes = result.filter(({ item }) => initialRanks.get(item.id) !== currentRanks.get(item.id)).length;

  return (
    <main className="page ao-home">
      <PageHead
        titleId="hero-heading"
        title="Qui décide ce que vous voyez ?"
        lead="Sur une plateforme de vidéos, d’actualités ou de musique, un algorithme range les contenus avant de vous les montrer. Bougez le curseur ci-dessous : vous changez la règle, et l’ordre change."
        actions={(
          <>
            <button type="button" onClick={() => onNavigate('lab')} className="btn btn-primary">Lancer une expérience <ArrowUpRight size={16} aria-hidden="true" /></button>
            <button type="button" onClick={() => onNavigate('discover')} className="btn btn-secondary">Comprendre le sujet <ArrowRight size={16} aria-hidden="true" /></button>
          </>
        )}
      />

      <section className="page-section page-band" role="region" aria-label="Machine interactive de classement">
        <div className="page-container">
          <div className="home-machine-head">
            <h2 className="instrument-title">La machine à classer</h2>
            <span className="provenance-stamp is-simulated">Simulation pédagogique</span>
          </div>

          <div className="home-machine">
            <div className="home-control">
              <div className="home-control-row">
                <label htmlFor="hero-algorithm-weight" className="t-meta">Ce que la règle regarde</label>
                <output htmlFor="hero-algorithm-weight" className="t-data home-control-value">{collectiveWeight} %</output>
              </div>
              <input
                id="hero-algorithm-weight"
                data-testid="hero-algorithm-weight"
                type="range"
                min="0"
                max="100"
                step="5"
                value={collectiveWeight}
                aria-valuetext={`${collectiveWeight} % avis de la communauté, ${100 - collectiveWeight} % nombre de vues`}
                onChange={(event) => setCollectiveWeight(Number(event.target.value))}
                style={{ '--fill': collectiveWeight + '%' } as CSSProperties}
              />
              <div className="home-control-ends" aria-hidden="true"><span>Nombre de vues</span><span>Avis de la communauté</span></div>
            </div>

            <div className="home-notes">
              <p className="page-small">
                La règle écoute à <strong>{collectiveWeight} %</strong> l’avis de la communauté et à <strong>{100 - collectiveWeight} %</strong> le
                nombre de vues. Glissez vers la gauche : seuls les films les plus vus restent en haut.
              </p>
              <p className="home-stat" data-testid="home-changes"><span className="t-figure">{String(changes).padStart(2, '0')}</span><span className="page-small"> sur {catalog.length} films ont changé de place</span></p>
              <button type="button" className="btn btn-link" onClick={() => onNavigate('lab')}>Essayer les quatre règles <ArrowRight size={16} aria-hidden="true" /></button>
            </div>

            <div className="home-stage">
              <RankLedger
                referenceName="Les plus vus"
                experimentName="Après votre réglage"
                reference={initial}
                experiment={result}
                selectedId={selectedId}
                onSelect={setSelectedId}
                limit={catalog.length}
                revision={String(collectiveWeight)}
                label="Classement après votre réglage, comparé aux plus vus"
              />
            </div>
          </div>

          <div className="ao-machine-readout home-readout" aria-live="polite" aria-atomic="true">
            <div className="ao-readout-label"><span>Film suivi</span><strong>{selected.title}</strong></div>
            <div className="ao-readout-delta">
              <span>{delta === 0 ? 'Même place' : (delta > 0 ? 'Monte de ' : 'Descend de ') + Math.abs(delta) + ' place' + (Math.abs(delta) > 1 ? 's' : '')}</span>
              <small>{before} → {after}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" aria-labelledby="home-explainer">
        <div className="page-container page-cta">
          <div>
            <h2 id="home-explainer" className="section-title">Une règle suffit à changer l’ordre.</h2>
            <p className="section-lead">
              Ces huit films sont <strong>entièrement simulés</strong>. Les places changent parce que le poids d’un critère change,
              pas parce qu’une plateforme a réellement recommandé ces œuvres.
            </p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate('discover')}>Comprendre les mécanismes <ArrowRight size={16} aria-hidden="true" /></button>
        </div>
      </section>
    </main>
  );
}
