import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Section } from '@/core/ui/Section';
import { Container } from '@/core/ui/Container';
import { ArrowRight, Play, BarChart3, ShieldCheck } from 'lucide-react';

export function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 pt-12 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-[120px] -translate-y-1/3" />
          <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-[100px] translate-y-1/4" />
        </div>
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-semibold text-indigo-700 uppercase tracking-wider">
                Open source · Transparence algorithmique
              </span>
              <h1 className="text-5xl font-bold text-slate-900 leading-tight text-balance mb-6">
                Comprendre les algorithmes<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
                  qui façonnent vos choix
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Algo Observatory est un laboratoire interactif qui rend compréhensibles les
                mécanismes de recommandation grâce à des données publiques vérifiables. Comparez
                des stratégies réelles, visualisez leurs effets et développez votre esprit critique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="primary" trailingIcon onClick={() => {}}>
                  Explorer le laboratoire <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline-accent">
                  <Play className="w-4 h-4 mr-2" /> Découvrir le concept
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <Card variant="outlined" className="p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-transparent" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <span>4 stratégies de recommandation</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-2xl font-bold text-slate-900 mb-1">8</div>
                      <div className="text-xs text-slate-500">contenus de démo</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-2xl font-bold text-slate-900 mb-1">0%</div>
                      <div className="text-xs text-slate-500">données inventées</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Valeurs */}
      <section className="py-24 px-6 bg-white border-t border-slate-200">
        <Container>
          <Section
            eyebrow="Notre approche"
            title="Des principes qui guident chaque écran"
            description="Chaque décision de conception répond à un engagement envers la vérité, la clarté et l'accessibilité."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Vérité des données',
                text: 'Aucune donnée n\'est inventée. Aucune simulation n\'est présentée comme réelle. Chaque chiffre est traçable.',
              },
              {
                icon: BarChart3,
                title: 'Comparaison vérifiable',
                text: 'Plusieurs algorithmes sur un même catalogue, avec des explications pour chaque résultat affiché.',
              },
              {
                icon: Play,
                title: 'Laboratoire interactif',
                text: 'Modifiez les paramètres en temps réel et observez immédiatement comment le classement change.',
              },
            ].map((item) => (
              <Card key={item.title} variant="soft" className="p-6 hover:border-indigo-100 transition-colors">
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

      {/* CTA */}
      <section className="py-24 px-6">
        <Container>
          <Card variant="outlined" className="p-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Prêt à explorer ?</h2>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              Entrez dans le laboratoire et découvrez comment différents algorithmes classent les mêmes contenus.
            </p>
            <Button size="lg" variant="primary" trailingIcon onClick={() => {}}>
              Ouvrir le laboratoire <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </Container>
      </section>
    </main>
  );
}
