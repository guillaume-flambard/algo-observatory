import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, GitCompareArrows, MousePointer2 } from 'lucide-react';
import type { Strategy } from '@/core/data/types';
import type { computeResults } from '@/core/data/strategies';

type Results = ReturnType<typeof computeResults>;

interface RankFlowProps {
  strategies: Strategy[];
  resultsByStrategy: Record<string, Results>;
}

export function RankFlow({ strategies, resultsByStrategy }: RankFlowProps) {
  const [targetId, setTargetId] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reference = strategies[0];
  const target = strategies.find((strategy) => strategy.id === targetId && strategy.id !== reference?.id) ?? strategies[1];
  const left = reference ? resultsByStrategy[reference.id] ?? [] : [];
  const right = target ? resultsByStrategy[target.id] ?? [] : [];

  const movements = useMemo(() => {
    const rightPositions = new Map(right.map(({ item }, index) => [item.id, index + 1]));
    return left.map(({ item }, index) => ({
      id: item.id,
      title: item.title,
      before: index + 1,
      after: rightPositions.get(item.id) ?? index + 1,
    }));
  }, [left, right]);

  const highlight = selectedId && movements.some((item) => item.id === selectedId) ? selectedId : movements[0]?.id;
  const biggestMove = movements.reduce((max, item) => Math.max(max, Math.abs(item.before - item.after)), 0);
  const movedCount = movements.filter((item) => item.before !== item.after).length;

  if (!reference || !target || movements.length === 0) return null;

  const rowHeight = 38;
  const chartHeight = movements.length * rowHeight + 34;
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white" aria-labelledby="rank-flow-heading">
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-neutral-500">
            <GitCompareArrows size={14} aria-hidden="true" /> Visualisation interactive
          </div>
          <h3 id="rank-flow-heading" className="mt-2 text-xl font-semibold tracking-[-0.04em]">
            Comment les positions changent.
          </h3>
          <p className="mt-2 text-xs leading-6 text-neutral-500">
            Sélectionnez un contenu pour suivre son parcours d’un classement à l’autre.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="flow-target" className="whitespace-nowrap text-xs text-neutral-500">Comparer avec</label>
          <select
            id="flow-target"
            value={target.id}
            onChange={(event) => {
              setTargetId(event.target.value);
              setSelectedId(null);
            }}
            className="max-w-[180px] rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold"
          >
            {strategies.slice(1).map((strategy) => (
              <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start lg:p-6">
        <div className="min-w-0 overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="flex justify-between px-3 pb-3 text-[11px] font-semibold text-neutral-500">
              <span>{reference.name}</span>
              <span>{target.name}</span>
            </div>
            <svg
              viewBox={'0 0 700 ' + chartHeight}
              className="h-auto w-full"
              role="img"
              aria-label={'Évolution des rangs de ' + reference.name + ' vers ' + target.name}
            >
              {movements.map((movement) => {
                const y1 = 17 + (movement.before - 1) * rowHeight;
                const y2 = 17 + (movement.after - 1) * rowHeight;
                const active = movement.id === highlight;
                return (
                  <g key={movement.id}>
                    <path
                      d={'M 140 ' + y1 + ' C 335 ' + y1 + ', 365 ' + y2 + ', 560 ' + y2}
                      stroke={active ? '#171717' : '#d4d4d4'}
                      strokeWidth={active ? 3 : 1.5}
                      strokeOpacity={active ? 1 : 0.7}
                      fill="none"
                      strokeLinecap="round"
                    />
                    <circle cx="140" cy={y1} r={active ? 5 : 3} fill={active ? '#171717' : '#d4d4d4'} />
                    <circle cx="560" cy={y2} r={active ? 5 : 3} fill={active ? '#171717' : '#d4d4d4'} />
                    <text x="128" y={y1 + 4} fontSize="12" textAnchor="end" fontWeight={active ? 700 : 400} fill={active ? '#171717' : '#737373'}>
                      {movement.before}
                    </text>
                    <text x="572" y={y2 + 4} fontSize="12" textAnchor="start" fontWeight={active ? 700 : 400} fill={active ? '#171717' : '#737373'}>
                      {movement.after}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="mt-3 flex items-center gap-2 text-[11px] text-neutral-500">
            <MousePointer2 size={13} aria-hidden="true" /> Choisissez un titre à droite pour isoler sa trajectoire.
          </p>
        </div>
        <div className="min-w-0">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-neutral-500">Suivre un contenu</p>
          <div className="max-h-[292px] space-y-1 overflow-y-auto pr-1">
            {movements.map((movement) => {
              const difference = movement.before - movement.after;
              return (
                <button
                  key={movement.id}
                  type="button"
                  aria-pressed={movement.id === highlight}
                  onClick={() => setSelectedId(movement.id)}
                  className={[
                    'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left transition',
                    movement.id === highlight ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100',
                  ].join(' ')}
                >
                  <span className="min-w-0 truncate text-xs font-medium">{movement.title}</span>
                  <span className="flex shrink-0 items-center gap-0.5 font-mono text-[11px]">
                    {difference > 0 ? <ArrowUp size={12} aria-hidden="true" /> : difference < 0 ? <ArrowDown size={12} aria-hidden="true" /> : null}
                    {difference === 0 ? '=' : Math.abs(difference)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 border-t border-neutral-100 bg-neutral-50 px-6 py-4 text-xs">
        <span className="font-medium text-neutral-700">{movedCount} contenus changent de position</span>
        <span className="text-neutral-500">Variation maximale : {biggestMove} rang{biggestMove > 1 ? 's' : ''}</span>
        <span className="ml-auto text-neutral-400">Comparaison sur le même jeu de données</span>
      </div>
    </section>
  );
}
