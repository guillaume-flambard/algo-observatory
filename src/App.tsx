import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, BarChart3, Menu, X } from 'lucide-react';
import { Home } from '@/features/home/Home';
import { Lab } from '@/features/lab/Lab';
import { Discover } from '@/features/discover/Discover';
import { Effects } from '@/features/effects/Effects';
import { Explore } from '@/features/explore/Explore';
import { Methodology } from '@/features/methodology/Methodology';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import type { Dataset } from '@/core/data/types';

type View = 'home' | 'discover' | 'lab' | 'effects' | 'explore' | 'methodology';

interface AppContextType {
  view: View;
  setView: (view: View) => void;
  dataset: Dataset;
  setDataset: (next: Dataset) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const navigation: { id: View; label: string; number: string }[] = [
  { id: 'home', label: 'Accueil', number: '01' },
  { id: 'discover', label: 'Découvrir', number: '02' },
  { id: 'lab', label: 'Laboratoire', number: '03' },
  { id: 'effects', label: 'Effets', number: '04' },
  { id: 'explore', label: 'Données', number: '05' },
  { id: 'methodology', label: 'Méthodologie', number: '06' },
];

function currentHashView(): View {
  if (typeof window === 'undefined') return 'home';
  const value = window.location.hash.replace(/^#\/?/, '');
  return navigation.find((item) => item.id === value)?.id ?? 'home';
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, updateView] = useState<View>(currentHashView);
  const [dataset, setDataset] = useState<Dataset>(EXAMPLE_DATASET);

  useEffect(() => {
    const sync = () => updateView(currentHashView());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const setView = (next: View) => {
    updateView(next);
    if (typeof window !== 'undefined' && window.location.hash !== '#/' + next) {
      window.location.hash = '/' + next;
    }
  };

  return <AppContext.Provider value={{ view, setView, dataset, setDataset }}>{children}</AppContext.Provider>;
}

function AppUI() {
  const { view, setView, dataset, setDataset } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (next: View) => {
    setView(next);
    setMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f5] text-neutral-900">
      <a
        href="#main-content"
        onClick={(event) => {
          // Hash-based routing also uses location.hash. Keep the current view on skip-link activation.
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3"
      >
        Aller au contenu
      </a>
      <header className="sticky top-0 z-30 border-b border-neutral-200/90 bg-[#f7f7f5]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="group flex min-w-0 items-center gap-3 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white">
              <BarChart3 size={18} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span data-testid="app-title" className="block whitespace-nowrap text-[14px] font-semibold tracking-[-0.025em]">
                Algo Observatory
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                Open algorithm lab
              </span>
            </span>
          </button>

          <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 lg:flex">
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                data-testid={'nav-' + (item.id === 'home' ? 'accueil' : item.id === 'discover' ? 'decouvrir' : item.id === 'lab' ? 'laboratoire' : item.id === 'effects' ? 'effets' : item.id === 'explore' ? 'donnees' : 'methodologie')}
                aria-current={view === item.id ? 'page' : undefined}
                className={[
                  'rounded-lg px-3 py-2.5 text-[12px] font-medium transition-colors',
                  view === item.id
                    ? 'bg-white text-neutral-950 shadow-sm ring-1 ring-neutral-200'
                    : 'text-neutral-500 hover:bg-white/70 hover:text-neutral-900',
                ].join(' ')}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <a
              href="https://github.com/guillaume-flambard/algo-observatory"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium transition hover:border-neutral-400"
            >
              Code source <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>

          <button
            type="button"
            className="rounded-lg border border-neutral-200 bg-white p-2 lg:hidden"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" aria-label="Navigation mobile" className="grid gap-1 border-t border-neutral-200 p-4 sm:grid-cols-2 lg:hidden">
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                aria-current={view === item.id ? 'page' : undefined}
                className={[
                  'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm',
                  view === item.id ? 'bg-white font-semibold' : 'text-neutral-600',
                ].join(' ')}
              >
                <span className="font-mono text-xs text-neutral-400">{item.number}</span>
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <div id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {view === 'home' ? (
          <Home onNavigate={navigate} />
        ) : view === 'discover' ? (
          <Discover onNavigate={navigate} />
        ) : view === 'lab' ? (
          <Lab dataset={dataset} onDatasetChange={setDataset} />
        ) : view === 'effects' ? (
          <Effects />
        ) : view === 'explore' ? (
          <Explore dataset={dataset} />
        ) : (
          <Methodology />
        )}
      </div>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 px-5 py-7 text-xs text-neutral-500 sm:flex-row sm:px-8 lg:px-12">
          <span>Algo Observatory · Comprendre les classements, sans boîte noire.</span>
          <span>Données observées et simulations toujours distinguées.</span>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppUI />
    </AppProvider>
  );
}

export default App;
