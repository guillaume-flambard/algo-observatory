import type { Dataset } from '@/core/data/types';
import { Card } from '@/core/ui/Card';
import { Section } from '@/core/ui/Section';

interface ExploreProps {
  dataset: Dataset;
}

export function Explore({ dataset }: ExploreProps) {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              ←
            </button>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Explorer les données
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <Section
          title="Aperçu du jeu de données"
          description={`Explorez les ${dataset.itemCount} contenus du jeu actuellement chargé, avec leurs métriques de recommandation.`}
        >
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: 'Contenus', value: String(dataset.itemCount) },
              { label: 'Source', value: dataset.source },
              { label: 'Licence', value: dataset.license },
              { label: 'Fraîcheur', value: dataset.freshness },
            ].map((item) => (
              <Card key={item.label} className="p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-slate-900">{item.value}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          title="Contenus et métriques"
          description="Chaque ligne est un contenu avec ses quatre métriques (0 à 1) qui alimentent les stratégies de recommandation."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Titre</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Auteur</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Popularité</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Score collectif</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Diversité</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Fraîcheur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataset.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-medium text-slate-900">{item.title}</td>
                    <td className="py-3 text-slate-600">{item.author}</td>
                    <td className="py-3 text-right text-slate-600">
                      {Math.round(item.metrics.popularity * 100)}%
                    </td>
                    <td className="py-3 text-right text-slate-600">
                      {Math.round(item.metrics.collectiveScore * 100)}%
                    </td>
                    <td className="py-3 text-right text-slate-600">
                      {Math.round(item.metrics.diversityScore * 100)}%
                    </td>
                    <td className="py-3 text-right text-slate-600">
                      {Math.round(item.metrics.freshness * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Card className="border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900 text-sm mb-2">Lecture des données</h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            {dataset.kind === 'example'
              ? 'Ce jeu de données est un exemple pédagogique (simulation). Il ne reflète aucun comportement réellement observé sur une plateforme.'
              : 'Ces données proviennent d\'une source réelle ; leur provenance, licence et fraîcheur sont affichées ci-dessus.'}
          </p>
        </Card>
      </div>
    </main>
  );
}
