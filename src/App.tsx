import { useState } from 'react';
import { Home } from '@/features/home/Home';
import { Lab } from '@/features/lab/Lab';
import { Discover } from '@/features/discover/Discover';
import { Effects } from '@/features/effects/Effects';
import { Explore } from '@/features/explore/Explore';
import { Methodology } from '@/features/methodology/Methodology';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
type View = 'home' | 'discover' | 'lab' | 'effects' | 'explore' | 'methodology';

export function App() {
  const [view, setView] = useState<View>('home');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span data-testid="app-title" className="font-bold text-slate-900 tracking-tight">
              Algo Observatory
            </span>
            <span className="text-xs text-slate-400">· laboratoire de transparence algorithmique</span>
          </div>
          <nav className="flex gap-1">
            <NavItem
              label="Accueil"
              active={view === 'home'}
              onClick={() => setView('home')}
            />
            <NavItem
              label="Découvrir"
              active={view === 'discover'}
              onClick={() => setView('discover')}
            />
            <NavItem
              label="Laboratoire"
              active={view === 'lab'}
              onClick={() => setView('lab')}
            />
            <NavItem
              label="Effets"
              active={view === 'effects'}
              onClick={() => setView('effects')}
            />
            <NavItem
              label="Données"
              active={view === 'explore'}
              onClick={() => setView('explore')}
            />
            <NavItem
              label="Méthodologie"
              active={view === 'methodology'}
              onClick={() => setView('methodology')}
            />
          </nav>
        </div>
      </header>

      <div className="flex-1">
        {view === 'home' ? (
          <Home />
        ) : view === 'discover' ? (
          <Discover />
        ) : view === 'lab' ? (
          <Lab />
        ) : view === 'effects' ? (
          <Effects />
        ) : view === 'explore' ? (
          <Explore dataset={EXAMPLE_DATASET} />
        ) : (
          <Methodology />
        )}
      </div>
    </div>
  );
}

function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
        active
          ? 'bg-slate-900 text-white'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  );
}
