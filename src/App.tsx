import { useState, createContext, useContext } from 'react';
import { Home } from '@/features/home/Home';
import { Lab } from '@/features/lab/Lab';
import { Discover } from '@/features/discover/Discover';
import { Effects } from '@/features/effects/Effects';
import { Explore } from '@/features/explore/Explore';
import { Methodology } from '@/features/methodology/Methodology';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
type View = 'home' | 'discover' | 'lab' | 'effects' | 'explore' | 'methodology';

interface AppContextType {
  view: View;
  setView: (view: View) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <AppUI />
      </div>
    </AppProvider>
  );
}

export default App;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>('home');
  return (
    <AppContext.Provider value={{ view, setView }}>
      {children}
    </AppContext.Provider>
  );
}

function AppUI() {
  const { view, setView } = useApp();

  return (
    <>
      <header className="relative z-20">
        <div className="mx-auto px-6 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 data-testid="app-title" className="font-bold text-slate-900 tracking-tight text-lg">
                Algo Observatory
              </h1>
              <span className="text-xs text-slate-400 font-medium">laboratoire de transparence algorithmique</span>
            </div>
            <nav className="flex gap-2">
              <NavItem label="Accueil" active={view === 'home'} onClick={() => setView('home')} testId="nav-accueil" />
              <NavItem label="Découvrir" active={view === 'discover'} onClick={() => setView('discover')} testId="nav-decouvrir" />
              <NavItem label="Laboratoire" active={view === 'lab'} onClick={() => setView('lab')} testId="nav-laboratoire" />
              <NavItem label="Effets" active={view === 'effects'} onClick={() => setView('effects')} testId="nav-effets" />
              <NavItem label="Données" active={view === 'explore'} onClick={() => setView('explore')} testId="nav-donnees" />
              <NavItem label="Méthodologie" active={view === 'methodology'} onClick={() => setView('methodology')} testId="nav-methodologie" />
            </nav>
          </div>
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
    </>
  );
}

function NavItem({
  label,
  active,
  onClick,
  testId,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  testId?: string;
}) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-slate-900 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-2 focus:ring-slate-200'
      }`}
    >
      {label}
    </button>
  );
}
