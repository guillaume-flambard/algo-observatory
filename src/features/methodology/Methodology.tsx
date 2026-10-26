import { Card } from '@/core/ui/Card';
import { Section } from '@/core/ui/Section';
import { Container } from '@/core/ui/Container';
import { Badge } from '@/core/ui/Badge';
import { ShieldCheck, Link, Database, Globe } from 'lucide-react';

export function Methodology() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-50/50 rounded-full blur-[140px] -translate-y-1/3" />
        </div>
        <Container>
          <Section
            eyebrow="Méthodologie"
            title="Notre approche des données"
            description="Toute donnée affichée dans Algo Observatory porte sa provenance, sa licence et sa fraîcheur. Jamais de simulation présentée comme réelle."
          />
          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-6">
            {[{
              icon: ShieldCheck,
              title: 'Provenance',
              text: 'Chaque donnée indique d\'où elle provient et peut être retracée à sa source.',
            }, {
              icon: Link,
              title: 'Licence',
              text: 'La licence de réutilisation est affichée pour chaque jeu de données.',
            }, {
              icon: Globe,
              title: 'Fraîcheur',
              text: 'La date de fraîcheur indique quand la donnée a été produite ou mise à jour.',
            }, {
              icon: ShieldCheck,
              title: 'Reproductibilité',
              text: 'Les mêmes paramètres sur le même jeu de données produisent toujours le même classement.',
            }, {
              icon: Database,
              title: 'Vérité des données',
              text: 'Aucune donnée n\'est inventée. Aucune conclusion n\'est non démontrée.',
            }, {
              icon: ShieldCheck,
              title: 'Indépendance',
              text: 'Aucun partenariat non confirmé n\'est revendiqué. Le projet reste indépendant.',
            }].map((item) => (
              <Card key={item.title} variant="soft" className="p-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 px-6 border-t border-slate-200 bg-white">
        <Container>
          <Section
            eyebrow="Sources"
            title="Sources de données"
            description="Origine des jeux de données utilisés dans l'observatoire."
          />
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="real">Donnée réelle</Badge>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Tournesol</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Données ouvertes de recommandation de Tournesol. Provenance, licence et fraîcheur vérifiables.
              </p>
              <p className="text-xs text-slate-500">
                Statut : intégration en cours (l'API publique retourne actuellement 404 ; la plupart des endpoints nécessitent OAuth2).
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="neutral">Étude à venir</Badge>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Bluesky</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Étude du protocole Bluesky (Jetstream) prévue dans une évolution ultérieure.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="example">Simulation</Badge>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Données d'exemple</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Jeu de données fabriqué à titre pédagogique uniquement. Ne reflète aucun comportement réellement observé.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 px-6">
        <Container>
          <Section
            eyebrow="Stratégies"
            title="Stratégies de recommandation implémentées"
            description="Quatre stratégies sont disponibles dans le laboratoire pour comparer leurs effets sur un même catalogue."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[{
              name: 'Popularité',
              desc: 'Fait remonter les contenus les plus populaires.',
            }, {
              name: 'Score collectif',
              desc: 'Fait remonter les contenus les mieux notés par la communauté.',
            }, {
              name: 'Diversité',
              desc: 'Fait remonter les contenus peu représentés par catégorie.',
            }, {
              name: 'Hybride',
              desc: 'Combinaison pondérée des trois stratégies.',
            }].map((item) => (
              <Card key={item.name} variant="default" className="p-6">
                <h3 className="font-bold text-slate-900 mb-2">{item.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
