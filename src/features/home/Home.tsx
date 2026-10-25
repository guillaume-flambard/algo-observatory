import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { HYBRID_STRATEGY, POPULARITY_STRATEGY, computeResults } from '@/core/data/strategies';

interface HomeProps {
  onNavigate: (view: 'home' | 'discover' | 'lab') => void;
}

const catalog = EXAMPLE_DATASET.items;
const initial = computeResults(catalog, POPULARITY_STRATEGY, {});
const initialRanks = new Map(initial.map(({ item }, index) => [item.id, index + 1]));
const rowHeight = 48;

export function Home({ onNavigate }: HomeProps) {
  const [collectiveWeight, setCollectiveWeight] = useState(65);
  const [selectedId, setSelectedId] = useState('i-6');

  // Only the strategy weights change; source items and the scoring function
  // are the same deterministic public code as in the laboratory.
  const result = useMemo(
    () => computeResults(catalog, HYBRID_STRATEGY, {
      w_popularity: (100 - collectiveWeight) / 100,
      w_collective: collectiveWeight / 100,
      w_diversity: 0,
    }),
    [collectiveWeight],
  );
  const currentRanks = useMemo(
    () => new Map(result.map(({ item }, index) => [item.id, index + 1])),
    [result],
  );
  const selected = catalog.find((item) => item.id === selectedId) ?? catalog[0]!;
  const before = initialRanks.get(selected.id) ?? 1;
  const after = currentRanks.get(selected.id) ?? before;
  const delta = before - after;
  const changes = result.filter(({ item }) => initialRanks.get(item.id) !== currentRanks.get(item.id)).length;

  return (
    <main className="ao-home">
      <section className="studio-home-hero" aria-labelledby="hero-heading">
        <div className="studio-home-kicker"><span className="studio-live-dot" aria-hidden="true" /> EXPÉRIENCE INTERACTIVE <span>·</span> ALGORITHMES DE RECOMMANDATION</div>
        <div className="studio-home-head">
          <div>
            <h1 id="hero-heading">Qui décide<br />ce que vous voyez ?</h1>
            <p>Un même catalogue. Deux règles de classement. Changez les paramètres et suivez précisément ce qui remonte — ou disparaît.</p>
          </div>
          <div className="studio-home-actions">
            <button type="button" onClick={() => onNavigate('lab')} className="studio-primary-action">Lancer une expérience <ArrowUpRight size={17} aria-hidden="true" /></button>
            <button type="button" onClick={() => onNavigate('discover')} className="studio-secondary-action">Comprendre le sujet <ArrowRight size={17} aria-hidden="true" /></button>
          </div>
        </div>
      </section>

      <section className="ao-machine" role="region" aria-label="Machine interactive de classement">
        <header className="studio-machine-header">
          <div><span className="studio-section-code">01 / MODIFIER LA RÈGLE</span><h2>La machine à classer</h2></div>
          <div className="studio-simulation-chip"><span aria-hidden="true" /> SIMULATION PÉDAGOGIQUE</div>
        </header>

        <div className="studio-machine-grid">
          <div className="studio-machine-controls">
            <div className="studio-control-heading"><span className="studio-section-code">PARAMÈTRE ACTIF</span><strong>Influence du score collectif</strong></div>
            <div className="ao-machine-controls">
              <div className="ao-control-header">
                <label htmlFor="hero-algorithm-weight">INFLUENCE DU SCORE COLLECTIF</label>
                <output htmlFor="hero-algorithm-weight">{collectiveWeight}%</output>
              </div>
              <input
                id="hero-algorithm-weight"
                data-testid="hero-algorithm-weight"
                type="range"
                min="0"
                max="100"
                step="5"
                value={collectiveWeight}
                onChange={(event) => setCollectiveWeight(Number(event.target.value))}
                style={{ '--ao-progress': collectiveWeight + '%' } as CSSProperties}
              />
              <div className="ao-control-ends" aria-hidden="true"><span>POPULARITÉ</span><span>SCORE COLLECTIF</span></div>
            </div>
            <p className="studio-control-explain">La règle compare deux signaux normalisés. Elle ne reproduit aucun algorithme propriétaire.</p>
            <div className="studio-control-stat"><strong>{String(changes).padStart(2, '0')}<small> / {catalog.length}</small></strong><span>POSITIONS MODIFIÉES</span></div>
            <button type="button" className="studio-detail-link" onClick={() => onNavigate('lab')}>Passer aux quatre stratégies <ArrowRight size={16} aria-hidden="true" /></button>
          </div>

          <div className="ao-rank-stage">
            <div className="ao-rank-headings"><span>01 / POPULARITÉ</span><span>02 / APRÈS RÉGLAGE</span></div>
            <div className="ao-rank-canvas">
              <svg className="ao-rank-paths" viewBox="0 0 1000 384" preserveAspectRatio="none" aria-hidden="true">
                {initial.map(({ item }, index) => {
                  const y1 = index * rowHeight + rowHeight / 2;
                  const y2 = ((currentRanks.get(item.id) ?? index + 1) - 1) * rowHeight + rowHeight / 2;
                  const active = item.id === selectedId;
                  return (
                    <path
                      key={item.id}
                      d={'M 431 ' + y1 + ' C 492 ' + y1 + ', 508 ' + y2 + ', 569 ' + y2}
                      fill="none"
                      stroke={active ? '#2446d5' : '#9baebb'}
                      strokeWidth={active ? 3 : 1.2}
                      strokeOpacity={active ? 1 : .54}
                      strokeLinecap="round"
                      className="ao-flow-path"
                    />
                  );
                })}
              </svg>
              <div className="ao-rank-column ao-rank-origin">
                {initial.map(({ item }, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-pressed={selectedId === item.id}
                    className={'ao-rank-row' + (selectedId === item.id ? ' is-selected' : '')}
                    style={{ top: index * rowHeight }}
                  >
                    <span className="ao-rank-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="ao-rank-label">{item.title}</span>
                  </button>
                ))}
              </div>
              <div className="ao-rank-column ao-rank-result" aria-live="off">
                {result.map(({ item }) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-pressed={selectedId === item.id}
                    className={'ao-rank-row' + (selectedId === item.id ? ' is-selected' : '')}
                    style={{ top: ((currentRanks.get(item.id) ?? 1) - 1) * rowHeight }}
                  >
                    <span className="ao-rank-number">{String(currentRanks.get(item.id) ?? 0).padStart(2, '0')}</span>
                    <span className="ao-rank-label">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="ao-mobile-rank-list" aria-label="Évolution des rangs sur mobile">
              {result.map(({ item }) => {
                const from = initialRanks.get(item.id) ?? 1;
                const to = currentRanks.get(item.id) ?? from;
                const movement = from - to;
                return (
                  <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} aria-pressed={selectedId === item.id} className={'ao-mobile-rank-item' + (selectedId === item.id ? ' is-selected' : '')}>
                    <span className="ao-mobile-rank-place">{String(to).padStart(2, '0')}</span>
                    <span className="ao-mobile-rank-title">{item.title}</span>
                    <span className="ao-mobile-rank-movement"><span>{from} → {to}</span><strong>{movement > 0 ? '↑ ' + movement : movement < 0 ? '↓ ' + Math.abs(movement) : '—'}</strong></span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="ao-machine-readout" aria-live="polite" aria-atomic="true">
          <div className="ao-readout-label"><span>CONTENU SUIVI / {selected.id.toUpperCase()}</span><strong>{selected.title}</strong></div>
          <div className="ao-readout-delta">
            <span>{delta === 0 ? 'Rang inchangé' : (delta > 0 ? '+' : '−') + Math.abs(delta) + ' place' + (Math.abs(delta) > 1 ? 's' : '')}</span>
            <small>{before} → {after}</small>
          </div>
          <div className="studio-changes-output">{changes} / {catalog.length} POSITIONS MODIFIÉES</div>
        </div>
      </section>

      <section className="studio-explainer">
        <div><span className="studio-section-code">02 / CE QUE VOUS VENEZ DE VOIR</span><h2>Une règle suffit à changer l’ordre.</h2></div>
        <div>
          <p>Les résultats ci-dessus sont calculés sur huit titres <strong>entièrement simulés</strong>. Les rangs changent quand le poids d’un signal change, pas parce qu’une plateforme a réellement recommandé ces œuvres.</p>
          <button type="button" className="studio-secondary-action" onClick={() => onNavigate('discover')}>Comprendre les mécanismes <ArrowRight size={16} aria-hidden="true" /></button>
        </div>
      </section>
    </main>
  );
}
