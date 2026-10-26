/** Ranks gained or lost between two rankings: a sunflower fill rises, an outline falls. */
export function MoveBadge({ delta, from }: { delta: number; from?: number }) {
  if (delta === 0) {
    return <span className="ledger-move is-still"><span aria-hidden="true">=</span><span className="sr-only">position inchangée</span></span>;
  }
  const up = delta > 0;
  return (
    <span className={'ledger-move ' + (up ? 'is-up' : 'is-down')}>
      <span aria-hidden="true">{up ? '↑' : '↓'}{Math.abs(delta)}</span>
      <span className="sr-only">{up ? 'monte' : 'descend'} de {Math.abs(delta)}{from ? ', depuis le rang ' + from : ''}</span>
    </span>
  );
}
