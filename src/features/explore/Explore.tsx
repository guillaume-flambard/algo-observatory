import type { Dataset } from '@/core/data/types';
import { Card } from '@/core/ui/Card';
import { Section } from '@/core/ui/Section';
import { Container } from '@/core/ui/Container';

interface ExploreProps {
  dataset: Dataset;
}

export function Explore({ dataset }: ExploreProps) {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-50/50 rounded-full blur-[140px] -translate-y-1/3" />
        </div>
        <Container>
          <Section
            eyebrow="Données"
            title="Aperçu du jeu de données"
            description={`Explorez les ${dataset.itemCount} contenus du jeu actuellement chargé, avec leurs métriques de recommandation.`}
          />
          <div className="grid gap-5 md:grid-cols-4">
            {[{
              label: 'Contenus',
              value: String(dataset.itemCount),
            }, {
              label: 'Source',
              value: dataset.source,
            }, {
              label: 'Licence',
              value: dataset.license,
            }, {
              label: 'Fraîcheur',
              value: dataset.freshness,
            }].map((item) => (
              <Card key={item.label} variant="default" className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-slate-900">{item.value}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 px-6 border-t border-slate-200 bg-white">
        <Container>
          <Section
            eyebrow="Contenus et métriques"
            title="Chaque ligne est un contenu avec ses quatre métriques"
            description="Chaque métrique (0 à 1) alimente les stratégies de recommandation du laboratoire."
          />
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Titre</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Auteur</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Popularité</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Score collectif</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Diversité</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Fraîcheur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataset.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                      <td className="px-6 py-4 text-slate-600">{item.author}</td>
                      <td className="px-6 py-4 text-right text-slate-600 font-medium">
                        {Math.round(item.metrics.popularity * 100)}%
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600 font-medium">
                        {Math.round(item.metrics.collectiveScore * 100)}%
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600 font-medium">
                        {Math.round(item.metrics.diversityScore * 100)}%
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600 font-medium">
                        {Math.round(item.metrics.freshness * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Card variant="soft" className="mt-8 p-6">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-[10px] font-bold text-amber-700">!</span>
              <div>
                <h3 className="font-bold text-amber-900 text-sm mb-1">Lecture des données</h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {dataset.kind === 'example'
                    ? 'Ce jeu de données est un exemple pédagogique (simulation). Il ne reflète aucun comportement réellement observé sur une plateforme.'
                    : 'Ces données proviennent d\'une source réelle ; leur provenance, licence et fraîcheur sont affichées ci-dessus.'}
                </p>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </main>
  );
}
