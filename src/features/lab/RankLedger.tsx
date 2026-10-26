import { useEffect, useMemo, useRef, useState } from 'react';
import type { Ranking } from './analysis';
import { rankMap } from './analysis';
import { useTweenedPositions } from './useTweenedPositions';
import { MoveBadge } from './MoveBadge';
import './ledger.css';

interface RankLedgerProps {
  referenceName: string;
  experimentName: string;
  reference: Ranking;
  experiment: Ranking;
  selectedId: string | null;
  onSelect: (id: string) => void;
  limit: number;
  /** Changes whenever a rule changes, so the tracked item's previous slot can be shown. */
  revision?: string;
  label?: string;
}

const PITCH = 48; // row height + gap, desktop
const PITCH_TOUCH = 60; // phones

/**
 * The signature instrument: the same items ranked by two rules, joined by
 * their paths. The experiment column re-orders with motion when a rule
 * changes; only real ranks from computeResults are drawn.
 */
export function RankLedger({
  referenceName,
  experimentName,
  reference,
  experiment,
  selectedId,
  onSelect,
  limit,
  revision,
  label,
}: RankLedgerProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const before = useMemo(() => rankMap(reference), [reference]);
  const after = useMemo(() => rankMap(experiment), [experiment]);
  const total = experiment.length;
  const shown = Math.min(limit, total);

  // Experiment ranks animate; values beyond the visible block park in an "outside" lane.
  const targets = useMemo(() => Object.fromEntries(experiment.map(({ item }, index) => [item.id, index + 1])), [experiment]);
  const tweened = useTweenedPositions(targets);
  const rankOf = (id: string) => tweened[id] ?? targets[id] ?? 1;

  // Previous slot of the tracked item, kept briefly after each rule change.
  const [ghost, setGhost] = useState<{ rank: number; key: number } | null>(null);
  const lastRanks = useRef(after);
  const lastRevision = useRef(revision);
  useEffect(() => {
    if (revision === lastRevision.current) {
      lastRanks.current = after;
      return;
    }
    lastRevision.current = revision;
    const previous = selectedId ? lastRanks.current.get(selectedId) : undefined;
    const now = selectedId ? after.get(selectedId) : undefined;
    lastRanks.current = after;
    if (previous === undefined || now === undefined || previous === now) return;
    setGhost({ rank: previous, key: Date.now() });
    const timer = setTimeout(() => setGhost(null), 1200);
    return () => clearTimeout(timer);
  }, [after, revision, selectedId]);

  const visible = (rank: number) => rank <= shown + 0.5;
  const y = (rank: number, pitch: number) => (Math.min(rank, shown + 0.75) - 1) * pitch;
  const height = shown * PITCH;
  const paths = useMemo(
    () => reference
      .map(({ item }, index) => ({ id: item.id, from: index + 1, to: after.get(item.id) ?? index + 1 }))
      .filter((entry) => entry.from <= shown || entry.to <= shown),
    [reference, after, shown],
  );
  const leftRows = reference.slice(0, shown);
  // Rows leaving the visible block travel to the outside lane before disappearing.
  const rightRows = experiment.filter(({ item }, index) => index < shown || rankOf(item.id) <= shown + 0.5);

  return (
    <div className="ledger" data-count={shown}>
      <div className="ledger-heads" aria-hidden="true">
        <span><span className="t-code">A</span> {referenceName}</span>
        <span><span className="t-code">B</span> {experimentName}</span>
      </div>

      {/* Desktop and tablet: two columns joined by paths. */}
      <div className="ledger-canvas" style={{ height: height + 28 }}>
        <div className="ledger-col ledger-col-a" aria-hidden="true">
          {leftRows.map(({ item }, index) => (
            <div
              key={item.id}
              className={'ledger-row' + (item.id === selectedId ? ' is-selected' : '') + (item.id === hoverId ? ' is-hover' : '')}
              style={{ transform: `translateY(${index * PITCH}px)` }}
              onClick={() => onSelect(item.id)}
              onMouseEnter={() => setHoverId(item.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <span className="ledger-rank t-data">{String(index + 1).padStart(2, '0')}</span>
              <span className="ledger-title">{item.title}</span>
            </div>
          ))}
        </div>

        <svg className="ledger-paths" viewBox={`0 0 100 ${height + 28}`} preserveAspectRatio="none" aria-hidden="true">
          {paths.map((path) => {
            const y1 = y(path.from, PITCH) + 22;
            const y2 = y(rankOf(path.id), PITCH) + 22;
            // The sunflower highlighter belongs to the tracked item only; hover stays cobalt.
            const active = path.id === selectedId;
            return (
              <path
                key={path.id}
                d={`M 0 ${y1} C 50 ${y1}, 50 ${y2}, 100 ${y2}`}
                className={'ledger-path' + (active ? ' is-active' : '') + (path.id === hoverId && path.id !== selectedId ? ' is-hover' : '')}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {paths.filter((path) => path.id === selectedId).map((path) => (
            <path
              key={path.id + '-ink'}
              d={`M 0 ${y(path.from, PITCH) + 22} C 50 ${y(path.from, PITCH) + 22}, 50 ${y(rankOf(path.id), PITCH) + 22}, 100 ${y(rankOf(path.id), PITCH) + 22}`}
              className="ledger-path-ink"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <ol className="ledger-col ledger-col-b" aria-label={label ?? 'Classement ' + experimentName + ', comparé à ' + referenceName}>
          {ghost && visible(ghost.rank) && (
            <li key={ghost.key} className="ledger-ghost" style={{ transform: `translateY(${(ghost.rank - 1) * PITCH}px)` }} aria-hidden="true" />
          )}
          {rightRows.map(({ item }) => {
            const to = after.get(item.id) ?? 1;
            const from = before.get(item.id) ?? to;
            return (
              <li key={item.id} className="ledger-slot" style={{ transform: `translateY(${y(rankOf(item.id), PITCH)}px)` }}>
                <button
                  type="button"
                  aria-pressed={item.id === selectedId}
                  onClick={() => onSelect(item.id)}
                  onMouseEnter={() => setHoverId(item.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(item.id)}
                  onBlur={() => setHoverId(null)}
                  className={'ledger-row' + (item.id === selectedId ? ' is-selected' : '') + (item.id === hoverId ? ' is-hover' : '')}
                >
                  <span className="ledger-rank t-data"><span className="sr-only">Rang </span>{String(to).padStart(2, '0')}</span>
                  <span className="ledger-title">{item.title}</span>
                  <MoveBadge delta={from - to} from={from > shown ? from : undefined} />
                  {from > shown && <span className="ledger-origin t-data" aria-hidden="true">de {from}</span>}
                </button>
              </li>
            );
          })}
        </ol>
        {shown < total && (
          <div className="ledger-outside t-code" style={{ top: height + 6 }} aria-hidden="true">
            <span>rangs {shown + 1}–{total}</span><span>rangs {shown + 1}–{total}</span>
          </div>
        )}
      </div>

      {/* Phones: one list in the experiment's order, with where each item came from. */}
      <ol className="ledger-touch" style={{ height: shown * PITCH_TOUCH }} aria-label={(label ?? 'Classement ' + experimentName + ', comparé à ' + referenceName) + ' (liste)'}>
        {rightRows.map(({ item }) => {
          const to = after.get(item.id) ?? 1;
          const from = before.get(item.id) ?? to;
          return (
            <li key={item.id} className="ledger-touch-slot" style={{ transform: `translateY(${(Math.min(rankOf(item.id), shown + 0.75) - 1) * PITCH_TOUCH}px)` }}>
              <button
                type="button"
                aria-pressed={item.id === selectedId}
                onClick={() => onSelect(item.id)}
                className={'ledger-touch-row' + (item.id === selectedId ? ' is-selected' : '')}
              >
                <span className="ledger-rank t-data"><span className="sr-only">Rang </span>{String(to).padStart(2, '0')}</span>
                <span className="ledger-touch-text">
                  <span className="ledger-touch-title">{item.title}</span>
                  <span className="ledger-touch-meta t-data">A {from} → B {to}</span>
                </span>
                <MoveBadge delta={from - to} />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
