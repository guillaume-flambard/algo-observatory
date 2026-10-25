export function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Algo Observatory
          </h1>
          <p className="mt-2 text-slate-600">
            Laboratoire public de transparence algorithmique — comprendre, explorer et
            expérimenter les algorithmes de recommandation sur des données réelles,
            ouvertes et vérifiables.
          </p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Pourquoi cet observatoire ?</h2>
          <p className="text-slate-600 leading-relaxed">
            Les algorithmes de recommandation décident en partie ce que nous voyons, lisons
            et regardons, mais leur fonctionnement reste souvent opaque. Algo Observatory
            rend ces mécanismes compréhensibles grâce à des expériences interactives fondées
            sur des données publiques réelles.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Données réelles et vérifiables',
              text: 'Chaque donnée porte sa provenance, sa licence et sa fraîcheur. Jamais de simulation présentée comme réelle.',
            },
            {
              title: 'Comparaison d\'algorithmes',
              text: 'Popularité, scores collectifs, diversité, hybrides : comparez plusieurs stratégies sur un même jeu de données.',
            },
            {
              title: 'Résultats expliqués',
              text: 'Pour chaque contenu favorisé, une explication indique pourquoi l\'algorithme le fait remonter.',
            },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-lg border border-slate-200 bg-white">
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-lg border border-amber-200 bg-amber-50">
          <h3 className="font-semibold text-amber-900">Principe non négociable : vérité des données</h3>
          <p className="mt-1 text-sm text-amber-800">
            Aucune donnée n'est inventée. Aucune conclusion n'est non démontrée. Aucune confusion
            n'est faite entre observation et simulation.
          </p>
        </div>
      </section>
    </main>
  );
}
