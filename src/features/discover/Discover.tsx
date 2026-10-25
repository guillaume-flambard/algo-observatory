export function Discover() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              ←
            </button>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Découvrir</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Qu'est-ce qu'un algorithme de recommandation ?
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Lorsque vous ouvrez une plateforme de vidéo, de musique ou d'actualité, des milliers
            de contenus vous sont proposés. Mais tous ne sont pas présentés dans le même ordre.
            C'est un <strong>algorithme de recommandation</strong> qui décide de ce que vous voyez
            en premier, et de ce que vous ne verrez peut-être jamais.
          </p>
          <p className="text-slate-600 leading-relaxed">
            L'algorithme ne se contente pas de classer : il <strong>filtre</strong>,
            <strong>ordonne</strong> et <strong>suggère</strong> en fonction de ce qu'il anticipe
            de vos goûts, de vos habitudes et de ce qui performe auprès d'autres utilisateurs.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Pourquoi ces algorithmes existent-ils ?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Faire face à l'abondance",
                text:
                  "Il y a trop de contenus pour qu'un humain les explore tous. L'algorithme en sélectionne une petite partie à afficher.",
              },
              {
                title: "Fidéliser l'attention",
                text:
                  "Plus vous restez sur la plateforme, plus elle peut vous proposer de contenus — et de publicités.",
              },
              {
                title: "Prédire ce qui vous plaira",
                text:
                  "L'algorithme se sert de vos clics, de vos likes et du temps passé pour deviner vos prochains centres d'intérêt.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Comment l'algorithme influence l'ordre des contenus
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Deux personnes peuvent voir le même catalogue dans un ordre totalement différent.
            Selon que l'algorithme privilégie la <strong>popularité</strong>, le
            <strong>score collectif</strong> ou le <strong>diversité</strong>, les contenus
            remontent ou coulent.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Cette influence n'est ni neutre ni transparente par défaut. Elle façonne ce que vous
            découvrez, ce que vous ignorez et, à terme, ce que vous pensez.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Passez à l'expérimentation
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Dans le laboratoire, vous pouvez comparer ces stratégies concrètement sur un même jeu
            de données et voir comment le classement change.
          </p>
          <div className="flex gap-3">
            <button
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              Ouvrir le laboratoire
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
