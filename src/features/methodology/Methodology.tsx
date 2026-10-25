import { Card } from '@/core/ui/Card';
import { Section } from '@/core/ui/Section';

export function Methodology() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              ←
            </button>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Méthodologie et sources
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <Section
          title="Notre approche des données"
          description="Toute donnée affichée dans Algo Observatory porte sa provenance, sa licence et sa fraîcheur. Jamais de simulation présentée comme réelle."
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Provenance',
                text: 'Chaque donnée indique d\'où elle provient (Tournesol, Bluesky, exemple...) et peut être retracée à sa source.',
              },
              {
                title: 'Licence',
                text: 'La licence de réutilisation est affichée pour chaque jeu de données, afin de connaître les conditions d\'usage.',
              },
              {
                title: 'Fraîcheur',
                text: 'La date de fraîcheur indique quand la donnée a été produite ou mise à jour, pour en évaluer la fiabilité.',
              },
              {
                title: 'Reproductibilité',
                text: 'Les mêmes paramètres sur le même jeu de données produisent toujours le même classement.',
              },
              {
                title: 'Vérité des données',
                text: 'Aucune donnée n\'est inventée. Aucune conclusion n\'est non démontrée.',
              },
              {
                title: 'Indépendance',
                text: 'Aucun partenariat non confirmé n\'est revendiqué. Le projet reste indépendant des plateformes.',
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

        <Section title="Sources de données" description="Origine des jeux de données utilisés dans l'observatoire.">
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800"
                >
                  Donnée réelle
                </span>
              </div>
              <h3 className="font-semibold text-slate-900">Tournesol</h3>
              <p className="text-sm text-slate-600 mb-3">
                Données ouvertes de recommandation de Tournesol. Provenance, licence et fraîcheur vérifiables.
              </p>
              <p className="text-xs text-slate-500">
                Statut : intégration en cours (l\'API publique retourne actuellement 404 ; la plupart des endpoints nécessitent OAuth2).
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800"
                >
                  Étude à venir
                </span>
              </div>
              <h3 className="font-semibold text-slate-900">Bluesky</h3>
              <p className="text-sm text-slate-600 mb-3">
                Étude du protocole Bluesky (Jetstream) prévue dans une évolution ultérieure.
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800"
                >
                  Simulation
                </span>
              </div>
              <h3 className="font-semibold text-slate-900">Données d'exemple</h3>
              <p className="text-sm text-slate-600 mb-3">
                Jeu de données fabriqué à titre pédagogique uniquement. Ne reflète aucun comportement réellement observé.
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Stratégies de recommandation implémentées"
          description="Quatre stratégies sont disponibles dans le laboratoire pour comparer leurs effets sur un même catalogue."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Popularité',
                desc: 'Fait remonter les contenus les plus populaires.',
              },
              {
                name: 'Score collectif',
                desc: 'Fait remonter les contenus les mieux notés par la communauté.',
              },
              {
                name: 'Diversité',
                desc: 'Fait remonter les contenus peu représentés par catégorie.',
              },
              {
                name: 'Hybride',
                desc: 'Combinaison pondérée des trois stratégies.',
              },
            ].map((item) => (
              <Card key={item.name} className="p-4">
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{item.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
