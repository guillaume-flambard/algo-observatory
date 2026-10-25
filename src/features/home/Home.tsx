import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, ArrowUpFromLine, Equal, MoveRight } from 'lucide-react';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { HYBRID_STRATEGY, POPULARITY_STRATEGY, computeResults } from '@/core/data/strategies';

interface HomeProps {
  onNavigate: (view: 'home' | 'discover' | 'lab') => void;
}

const catalog = EXAMPLE_DATASET.items;
const initial = computeResults(catalog, POPULARITY_STRATEGY, {});
const initialRanks = new Map(initial.map(({ item }, index) => [item.id, index + 1]));
const selectedDefault = 'i-6';

const lineColor = '#b9b6a9';
const signal = '#ee6746';
const rowHeight = 48;

export function Home({ onNavigate }: HomeProps) {
  const [collectiveWeight, setCollectiveWeight] = useState(65);
  const [selectedId, setSelectedId] = useState(selectedDefault);

  // One controlled parameter and one deterministic scoring function: the animation
  // never substitutes arbitrary ranks or claims to represent a platform's feed.
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
    <main className="ao-home">
      <section className="ao-editorial-hero" aria-labelledby="hero-heading">
        <div className="ao-hero-index">
          <span>ALGO OBSERVATORY</span>
          <span>FIELD NOTES / N° 001</span>
          <span>INDEPENDENT RESEARCH INSTRUMENT</span>
        </div>

        <div className="ao-hero-layout">
          <div className="ao-editorial-intro">
            <p className="ao-eyebrow"><span aria-hidden="true">✳</span> EXPÉRIENCE N° 01 — LES CLASSEMENTS</p>
            <h1 id="hero-heading" className="ao-manifesto">
              Qui décide <em>ce que vous voyez&nbsp;?</em>
            </h1>
            <p className="ao-deck">
              Huit œuvres. Deux règles. Des résultats qui ne racontent pas la même histoire.
              <strong> Vous pouvez modifier l’algorithme.</strong>
            </p>
            <div className="ao-hero-actions">
              <button type="button" onClick={() => onNavigate('lab')} className="ao-action-primary">
                Lancer une expérience <ArrowUpRight size={17} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => onNavigate('discover')} className="ao-action-text">
                Comprendre le sujet <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
            <div className="ao-hero-credit">
              <span className="ao-credit-marker" aria-hidden="true" />
              <p>
                <strong>Note de méthode.</strong> Les huit titres de cette démonstration
                proviennent d’un jeu <em>entièrement simulé</em>. Aucune recommandation
                d’une plateforme réelle n’est observée ici.
              </p>
            </div>
          </div>

          <div className="ao-machine" role="region" aria-label="Machine interactive de classement">
            <div className="ao-machine-top">
              <div className="ao-machine-identity">
                <span className="ao-machine-led" aria-hidden="true" />
                <span>RANKING MACHINE</span>
              </div>
              <span>MODEL / 01</span>
            </div>
            <div className="ao-machine-title">
              <span className="ao-machine-caption">MÊME CATALOGUE / RÈGLES DIFFÉRENTES</span>
              <h2>L’ordre des choses<br /><i>n’est pas neutre.</i></h2>
              <p>Faites glisser le curseur. Observez les positions. Sélectionnez un contenu.</p>
            </div>
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
              <div className="ao-control-ends" aria-hidden="true">
                <span>← POPULARITÉ</span>
                <span>SCORE COLLECTIF →</span>
              </div>
            </div>

            <div className="ao-rank-stage" aria-label="Comparaison des positions">
              <div className="ao-rank-headings">
                <span>01 / ORDRE INITIAL</span>
                <span>02 / APRÈS RÉGLAGE</span>
              </div>
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
                        stroke={active ? signal : lineColor}
                        strokeWidth={active ? 3.5 : 1.25}
                        strokeOpacity={active ? 1 : 0.45}
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
                      aria-label={'Suivre ' + item.title + ' dans les deux classements'}
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
                      aria-label={'Suivre ' + item.title + ' dans les deux classements'}
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
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      aria-pressed={selectedId === item.id}
                      className={'ao-mobile-rank-item' + (selectedId === item.id ? ' is-selected' : '')}
                    >
                      <span className="ao-mobile-rank-place">{String(to).padStart(2, '0')}</span>
                      <span className="ao-mobile-rank-title">{item.title}</span>
                      <span className="ao-mobile-rank-movement">
                        <span>{from} → {to}</span>
                        <strong>{movement > 0 ? '↑ ' + movement : movement < 0 ? '↓ ' + Math.abs(movement) : '—'}</strong>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="ao-machine-readout" aria-live="polite" aria-atomic="true">
              <div className="ao-readout-label">
                <span>FOCUS / {selected.id.toUpperCase()}</span>
                <strong>{selected.title}</strong>
              </div>
              <div className="ao-readout-delta">
                {delta > 0 ? <ArrowUpFromLine size={18} aria-hidden="true" /> : delta < 0 ? <ArrowDownRight size={20} aria-hidden="true" /> : <Equal size={20} aria-hidden="true" />}
                <span>{delta === 0 ? 'Rang inchangé' : (delta > 0 ? '+' : '−') + Math.abs(delta) + ' place' + (Math.abs(delta) > 1 ? 's' : '')}</span>
                <small>{before} → {after}</small>
              </div>
            </div>
            <div className="ao-machine-bottom">
              <span>{changes} / {catalog.length} POSITIONS MODIFIÉES</span>
              <span>SIMULATION / CALCUL DÉTERMINISTE</span>
            </div>
          </div>
        </div>
        <div className="ao-hero-bottom-rule">
          <span>SCROLL TO INVESTIGATE</span>
          <span aria-hidden="true">↓</span>
          <span>01 — 03</span>
        </div>
      </section>

      <section className="ao-field-guide" aria-labelledby="field-guide-heading">
        <div className="ao-section-kicker"><span>02</span> OBSERVER N’EST PAS EXPLIQUER</div>
        <div className="ao-field-grid">
          <h2 id="field-guide-heading">
            L’algorithme<br />
            <em>fait un choix.</em><br />
            Montrons lequel.
          </h2>
          <div className="ao-guide-copy">
            <p>Deux classements peuvent utiliser les mêmes contenus et produire des résultats opposés. Ce n’est pas une magie invisible : ce sont des <strong>critères, des poids et des arbitrages.</strong></p>
            <p>Algo Observatory rend ces décisions manipulables. Chaque résultat peut être expliqué et chaque donnée a un statut : observée, dérivée ou simulée.</p>
            <button type="button" onClick={() => onNavigate('discover')} className="ao-action-text">Lire le protocole <MoveRight size={17} aria-hidden="true" /></button>
          </div>
        </div>
      </section>

      <section className="ao-three-acts" aria-label="Trois étapes pour comprendre les algorithmes">
        {[
          { n: '01', t: 'LA SOURCE', h: 'D’où viennent les données ?', d: 'Regarder la provenance, la date, la licence et ce qui a réellement été mesuré.' },
          { n: '02', t: 'LA RÈGLE', h: 'Qu’a-t-on demandé au modèle ?', d: 'Modifier les critères et observer les arbitrages. Les résultats restent calculables et reproductibles.' },
          { n: '03', t: 'LA PREUVE', h: 'Qu’est-ce qu’on peut affirmer ?', d: 'Suivre un contenu jusqu’à son rang, sans confondre simulation et comportement réel.' },
        ].map((act) => (
          <article key={act.n}>
            <span className="ao-act-index">{act.n} /</span>
            <span className="ao-act-name">{act.t}</span>
            <h3>{act.h}</h3>
            <p>{act.d}</p>
          </article>
        ))}
      </section>

      <section className="ao-last-word">
        <span>03 / OPEN EXPERIMENT</span>
        <h2>Ne croyez pas<br />le classement. <em>Testez-le.</em></h2>
        <button type="button" onClick={() => onNavigate('lab')}>
          Explorer le laboratoire <ArrowUpRight size={19} aria-hidden="true" />
        </button>
      </section>
    </main>
  );
}
