import { Card } from '@/core/ui/Card';
import { Section } from '@/core/ui/Section';
import { Container } from '@/core/ui/Container';
import { Button } from '@/core/ui/Button';
import { ArrowRight, Play, BarChart3, Lightbulb } from 'lucide-react';
import { useApp } from '@/App';
import { EXAMPLE_DATASET } from '@/core/data/example-dataset';
import { ALL_STRATEGIES, computeResults } from '@/core/data/strategies';

const STRATEGY_STYLE: Record<string, { accent: string; bg: string; border: string }> = {
  popularity: { accent: 'amber', bg: 'bg-amber-50', border: 'border-amber-200' },
  collective: { accent: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  diversity: { accent: 'slate', bg: 'bg-slate-50', border: 'border-slate-200' },
  hybrid: { accent: 'indigo', bg: 'bg-indigo-50', border: 'border-indigo-200' },
};

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
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-50/50 rounded-full blur-[140px] -translate-y-1/3" />
        </div>
        <Container>
          <Section
            eyebrow="Effets"
            title="Les algorithmes ne sont pas neutres"
            description="Deux personnes qui ouvrent le meme catalogue ne voient pas forcment les memes contenus, ni dans le meme ordre. Un algorithme de recommandation ne se contente pas d'afficher : il selectionne, ordonne et occulte."
          />
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-12">
            <div className="flex items-start gap-6 md:gap-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Cette influence a des consequences concretes.</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Elle faconne ce que vous decouvrez, ce que vous ignorez et, a terme, ce que vous pensez. Comprendre ses effets est le premier pas vers un esprit critique face aux plateformes.
                </p>
                <Button variant="outline-accent" size="md" onClick={() => setView('lab')}>
                  <Play className="w-4 h-4 mr-2" /> Ouvrir le laboratoire <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 px-6 border-t border-slate-200 bg-white">
        <Container>
          <Section
            eyebrow="Quatre effets concrets"
            title="Chaque strategie produit un effet distinct sur le classement"
            description="Les memes contenus classes différemment selon la strategie. L'ordre change, pas le catalogue."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[{
              title: 'Biais de popularite',
              badge: 'Popularite',
              accent: 'amber',
              text: 'Les contenus deja populaires sont encore plus mises en avant. Les contenus de niche, meme de qualite, peinent a emergier.',
            }, {
              title: 'Bulle de filtre',
              badge: 'Score collectif',
              accent: 'emerald',
              text: 'Vous voyez surtout ce qui ressemble a ce que vous (ou des profils proches) avez deja aime. La diversite des points de vue diminue.',
            }, {
              title: 'Homogeneite',
              badge: 'Diversite',
              accent: 'slate',
              text: 'Sans contre-poids, l algorithme repete toujours les memes categories et auteurs. Certains contenus coulent definitivamente.',
            }, {
              title: 'Equilibre hybride',
              badge: 'Hybride',
              accent: 'indigo',
              text: 'En combinant popularite, score collectif et diversite, on peut reintroduire des contenus varies tout en restant pertinent.',
            }].map((effect) => {
              const style = {
                amber: 'bg-amber-50 text-amber-800 border-amber-200',
                emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                slate: 'bg-slate-50 text-slate-700 border-slate-200',
                indigo: 'bg-indigo-50 text-indigo-800 border-indigo-200',
              }[effect.accent];
              return (
                <Card key={effect.title} variant="default" className="p-6 flex flex-col h-full group hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style}`}>
                      {effect.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-3">{effect.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{effect.text}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-20 px-6">
        <Container>
          <Section
            eyebrow="Comparaison visuelle"
            title="Meme catalogue, ordre different"
            description="Huit contenus de meme catalogue classes par quatre strategies sur les memes donnees d'exemple (simulation)."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {strategyOrders.map((col) => {
              const style = (STRATEGY_STYLE[col.id] ?? STRATEGY_STYLE.hybrid) as { bg: string; border: string };
              return (
                <Card key={col.id} variant="default" className={`p-4 ${style.bg} ${style.border} shadow-sm flex flex-col h-full`}>
                  <div className="p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-3 h-3" /> {col.name}
                    </h3>
                    <ol className="space-y-1.5 text-sm text-slate-600">
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
          <p className="text-xs text-slate-400 text-center mt-8">
            Ordres calculates par les vraies strategies sur le jeu de donnees d'exemple (simulation). Dans le laboratoire, vous pouvez observer ces effets avec vos propres parametres.
          </p>
        </Container>
      </section>

      <section className="py-20 px-6 border-t border-slate-200 bg-white">
        <Container>
          <Section
            eyebrow="Pourquoi cela importe"
            title="Les effets de recommandation ont des consequences reelles"
            description="Les effets de recommandation ne sont pas seulement techniques : ils ont des consequences concretes sur les createurs, le debat public et votre attention."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[{
              title: 'Ce que vous decouvrez',
              text: "L'algorithme oriente votre attention vers certains sujets et en ecarte d'autres, sans que vous en soyez toujours conscient.",
            }, {
              title: 'Ce que les createurs produisent',
              text: "Pour etre visibles, les createurs adaptent leurs contenus aux critères de l'algorithme, pas seulement a leur public.",
            }, {
              title: 'Le debat public',
              text: 'Quand tout le monde voit des contenus differents, il devient plus difficile de partager une reference commune et de debattre.',
            }].map((item) => (
              <Card key={item.title} variant="default" className="p-6 flex flex-col h-full">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 mb-4">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 px-6">
        <Container>
          <Card variant="outlined" className="p-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Pret a experimenter ?</h2>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              Entrez dans le laboratoire, modifiez les parametres et voyez immediatement comment le classement change.
            </p>
            <Button size="lg" variant="primary" trailingIcon onClick={() => setView('lab')}>
              Ouvrir le laboratoire <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </Container>
      </section>
    </main>
  );
}
