import { useState } from 'react';
import { ArrowUpRight, BarChart3, Menu, X } from 'lucide-react';
import { Home } from '@/features/home/Home';
import { Lab } from '@/features/lab/Lab';
import { Discover } from '@/features/discover/Discover';

type View = 'home' | 'discover' | 'lab';

const navigation: { id: View; label: string; number: string }[] = [
  { id: 'home', label: 'Vue d’ensemble', number: '01' },
  { id: 'discover', label: 'Comprendre', number: '02' },
  { id: 'lab', label: 'Expérimenter', number: '03' },
];

export function App() {
  const [view, setView] = useState<View>('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (next: View) => {
    setView(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f5] text-neutral-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">
        Aller au contenu
      </a>
      <header className="sticky top-0 z-30 border-b border-neutral-200/90 bg-[#f7f7f5]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="group flex min-w-0 items-center gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
            aria-label="Algo Observatory, accueil"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white">
              <BarChart3 size={18} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span data-testid="app-title" className="block text-[14px] font-semibold tracking-[-0.025em]">
                Algo Observatory
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                Open algorithm lab
              </span>
            </span>
          </button>

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                aria-current={view === item.id ? 'page' : undefined}
                className={[
                  'rounded-lg px-4 py-2.5 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900',
                  view === item.id
                    ? 'bg-white text-neutral-950 shadow-sm ring-1 ring-neutral-200'
                    : 'text-neutral-500 hover:bg-white/70 hover:text-neutral-900',
                ].join(' ')}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <span className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
              Projet ouvert
            </span>
            <a
              href="https://github.com/guillaume-flambard/algo-observatory"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium transition hover:border-neutral-400"
            >
              Code source <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>

          <button
            type="button"
            className="rounded-lg border border-neutral-200 bg-white p-2 md:hidden"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" aria-label="Navigation mobile" className="space-y-1 border-t border-neutral-200 p-4 md:hidden">
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

      <div id="main-content" className="flex-1">
        {view === 'home' ? <Home onNavigate={navigate} /> : view === 'discover' ? <Discover onNavigate={navigate} /> : <Lab />}
      </div>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-4 px-5 py-7 text-xs text-neutral-500 sm:flex-row sm:px-8 lg:px-12">
          <span>Algo Observatory · Comprendre les classements, sans boîte noire.</span>
          <span>Données observées et simulations toujours distinguées.</span>
        </div>
      </footer>
    </div>
  );
}
