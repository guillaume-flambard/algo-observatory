import { Card } from '@/core/ui/Card';
import { Section } from '@/core/ui/Section';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { ALL_STRATEGIES, computeResults } from '@/core/data/strategies';
import { useApp } from '@/App';

export function Effects() {
  const { setView } = useApp();
  const strategyOrders = ALL_STRATEGIES.map((strategy) => {
    const results = computeResults(EXAMPLE_DATASET.items, strategy, {});
    return {
      id: strategy.id,
      name: strategy.name,
      items: results.map((r) => r.item.title),
    };
  });
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              ←
            </button>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Comprendre les effets
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('lab')}
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              Ouvrir le laboratoire
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Les algorithmes ne sont pas neutres
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Deux personnes qui ouvrent le même catalogue ne voient pas forcément les mêmes
            contenus, ni dans le même ordre. Un algorithme de recommandation ne se contente pas
            d'afficher : il <strong>sélectionne</strong>, <strong>ordonne</strong> et
            <strong>occulte</strong>.
          </p>
          <p className="text-slate-600 leading-relaxed text-lg">
            Cette influence façonne ce que vous découvrez, ce que vous ignorez et, à terme, ce que
            vous pensez. Comprendre ses effets est le premier pas vers un esprit critique face aux
            plateformes.
          </p>
        </section>

        <Section
          title="Quatre effets concrets sur le classement"
          description="Chaque stratégie de recommandation produit un effet distinct sur les contenus mis en avant."
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Biais de popularité',
                badge: 'Popularité',
                text: 'Les contenus déjà populaires sont encore plus mis en avant. Les contenus de niche, même de qualité, peinent à émerger.',
              },
              {
                title: 'Bulle de filtre',
                badge: 'Score collectif',
                text: 'Vous voyez surtout ce qui ressemble à ce que vous (ou des profils proches) avez déjà aimé. La diversité des points de vue diminue.',
              },
              {
                title: 'Homogénéité',
                badge: 'Diversité',
                text: 'Sans contre-poids, l\'algorithme répète toujours les mêmes catégories et auteur·ice·s. Certains contenus coulent définitivement.',
              },
              {
                title: 'Équilibre hybride',
                badge: 'Hybride',
                text: 'En combinant popularité, score collectif et diversité, on peut réintroduire des contenus variés tout en restant pertinent.',
              },
            ].map((effect) => (
              <Card
                key={effect.title}
                className="flex flex-col h-full"
                padded={false}
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800"
                    >
                      {effect.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{effect.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{effect.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          title="Même catalogue, ordre différent"
          description="Huit contenus de même catalogue classés par quatre stratégies sur les mêmes données d'exemple (simulation). L'ordre change, pas le catalogue."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {strategyOrders.map((col) => {
              const variant =
                col.id === 'popularity'
                  ? 'bg-amber-50 border-amber-200'
                  : col.id === 'collective'
                  ? 'bg-emerald-50 border-emerald-200'
                  : col.id === 'diversity'
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-indigo-50 border-indigo-200';
              return (
                <Card key={col.id} className={variant} padded={false}>
                  <div className="p-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      {col.name}
                    </h3>
                    <ol className="space-y-2 text-sm text-slate-600">
                      {col.items.map((title, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-900">
                            {i + 1}
                          </span>
                          <span className="line-clamp-1">{title}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Card>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            Ordres calculés par les vraies stratégies sur le jeu de données d'exemple (simulation).
            Dans le laboratoire, vous pouvez observer ces effets avec vos propres paramètres.
          </p>
        </Section>

        <Section
          title="Pourquoi cela importe"
          description="Les effets de recommandation ne sont pas seulement techniques : ils ont des conséquences concrètes."
        >
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: 'Ce que vous découvrez',
                text: 'L\'algorithme oriente votre attention vers certains sujets et en écarte d\'autres, sans que vous en soyez toujours conscient.',
              },
              {
                title: 'Ce que les créateur·ice·s produisent',
                text: 'Pour être visibles, les créateur·ice·s adaptent leurs contenus aux critères de l\'algorithme, pas seulement à leur public.',
              },
              {
                title: 'Le débat public',
                text: 'Quand tout le monde voit des contenus différents, il devient plus difficile de partager une références commune et de débattre.',
              },
            ].map((item) => (
              <Card key={item.title} className="flex flex-col h-full" padded={false}>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Passez à l'expérimentation</h3>
          <p className="text-sm text-slate-600 mb-4">
            Dans le laboratoire, comparez ces stratégies concrètement sur un même jeu de données,
            modifiez les paramètres et voyez comment le classement change.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setView('lab')}
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              Ouvrir le laboratoire
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
