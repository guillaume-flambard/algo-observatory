import { createContext, lazy, Suspense, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Home } from '@/features/home/Home';

// Loading only the visited module keeps the first page fast on mobile.
const Lab = lazy(() => import('@/features/lab/Lab').then((mod) => ({ default: mod.Lab })));
const Discover = lazy(() => import('@/features/discover/Discover').then((mod) => ({ default: mod.Discover })));
const Effects = lazy(() => import('@/features/effects/Effects').then((mod) => ({ default: mod.Effects })));
const Explore = lazy(() => import('@/features/explore/Explore').then((mod) => ({ default: mod.Explore })));
const Methodology = lazy(() => import('@/features/methodology/Methodology').then((mod) => ({ default: mod.Methodology })));
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

type Intent = 'Comprendre' | 'Expérimenter' | 'Vérifier';

const navigation: { id: View; label: string; number: string; intent: Intent }[] = [
  { id: 'home', label: 'Accueil', number: '01', intent: 'Comprendre' },
  { id: 'discover', label: 'Découvrir', number: '02', intent: 'Comprendre' },
  { id: 'lab', label: 'Laboratoire', number: '03', intent: 'Expérimenter' },
  { id: 'effects', label: 'Effets', number: '04', intent: 'Expérimenter' },
  { id: 'explore', label: 'Données', number: '05', intent: 'Vérifier' },
  { id: 'methodology', label: 'Méthodologie', number: '06', intent: 'Vérifier' },
];
const intents: Intent[] = ['Comprendre', 'Expérimenter', 'Vérifier'];
const testIds: Record<View, string> = {
  home: 'nav-accueil',
  discover: 'nav-decouvrir',
  lab: 'nav-laboratoire',
  effects: 'nav-effets',
  explore: 'nav-donnees',
  methodology: 'nav-methodologie',
};

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
  const firstView = useRef(true);

  useEffect(() => {
    document.title = (navigation.find((item) => item.id === view)?.label ?? 'Accueil') + ', Algo Observatory';
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    // Focus the new content instead of leaving screen-reader users in the navigation.
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [view]);

  const navigate = (next: View) => {
    setView(next);
    setMenuOpen(false);
    // A long explanation must never land users halfway down the next route.
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return (
    <div className="app-shell">
      <a
        href="#main-content"
        onClick={(event) => {
          // Hash-based routing also uses location.hash. Keep the current view on skip-link activation.
          event.preventDefault();
          document.getElementById('main-content')?.focus({ preventScroll: true });
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--paper)] focus:p-3"
      >
        Aller au contenu
      </a>
      <header className="app-header">
        <div className="app-header-row">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="app-brand"
          >
            <span className="app-mark">
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M5 5v18h18" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M8 12h13M8 17h13" stroke="#7f909b" strokeWidth="1" strokeDasharray="2 2"/>
                <path d="M8 19c6 0 5-9 13-9" stroke="#7f909b" strokeWidth="1.2"/>
                <path d="M8 9c6 0 5 9 13 9" stroke="#ffc800" strokeWidth="2.2"/>
              </svg>
            </span>
            <span className="min-w-0">
              <span data-testid="app-title" className="app-name">
                Algo Observatory
              </span>
              <span className="app-tagline">
                Laboratoire des classements
              </span>
            </span>
          </button>

          <nav aria-label="Navigation principale" className="app-nav">
            {intents.map((intent) => (
              <div key={intent} className="app-nav-group">
                <span className="app-nav-intent" aria-hidden="true">{intent}</span>
                <div className="app-nav-links">
                  {navigation.filter((item) => item.intent === intent).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(item.id)}
                      data-testid={testIds[item.id]}
                      aria-current={view === item.id ? 'page' : undefined}
                      className="app-nav-link"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="app-source">
            <a
              href="https://github.com/guillaume-flambard/algo-observatory"
              target="_blank"
              rel="noopener noreferrer"
            >
              Code source <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>

          <button
            type="button"
            className="app-menu-button"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" aria-label="Navigation mobile" className="app-mobile-nav">
            {intents.map((intent) => (
              <div key={intent} className="app-mobile-group">
                <span className="app-nav-intent">{intent}</span>
                {navigation.filter((item) => item.intent === intent).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    aria-current={view === item.id ? 'page' : undefined}
                    className="app-mobile-link"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        )}
      </header>

      <div id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={
          <div role="status" aria-live="polite" className="app-loading">
            <span className="app-loading-bar" aria-hidden="true" />
            <p>Ouverture de l’espace…</p>
          </div>
        }>
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
        </Suspense>
      </div>

      <footer className="app-footer">
        <div className="app-footer-row">
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
