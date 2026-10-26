import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Section } from '@/core/ui/Section';
import { Container } from '@/core/ui/Container';
import { Badge } from '@/core/ui/Badge';
import { ArrowRight, ShieldCheck, Users, ChartLine } from 'lucide-react';

export function Discover() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-50/50 rounded-full blur-[140px] -translate-y-1/3" />
        </div>
        <Container>
          <Section
            eyebrow="Comprendre"
            title="Qu'est-ce qu'un algorithme de recommandation ?"
            description="Lorsque vous ouvrez une plateforme de video, de musique ou d'actualite, des milliers de contenus vous sont proposes. Mais tous ne sont pas presents dans le meme ordre. C'est un algorithme de recommandation qui decide de ce que vous voyez en premier."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              icon: Users,
              title: 'Il filtre, ordonne, suggeste',
              text: "L'algorithme ne se contente pas d'afficher : il selectionne les contenus, en ordonne l'apparition et suggere ceux qui vous correspondent.",
            }, {
              icon: ChartLine,
              title: 'Il repond a des objectifs',
              text: 'Faire face a l abondance de contenus, fideliser votre attention, predire ce qui vous plaira. Chaque plateforme a ses propres priorites.',
            }, {
              icon: ShieldCheck,
              title: 'Son influence n est pas neutre',
              text: 'Cette influence façonne ce que vous decouvrez, ce que vous ignorez et, a terme, ce que vous pensez. Comprendre ses effets est le premier pas vers un esprit critique face aux plateformes.',
            }].map((item) => (
              <Card key={item.title} variant="soft" className="p-6 hover:border-indigo-100 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-colors">
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
            eyebrow="Pourquoi"
            title="Pourquoi ces algorithmes existent-ils ?"
            description="Trois motivations guident la conception d un algorithme de recommandation."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[{
              title: 'Faire face a l abondance',
              text: 'Il y a trop de contenus pour qu un humain les explore tous. L algorithme en selectionne une petite partie a afficher.',
            }, {
              title: 'Fideliser l attention',
              text: 'Plus vous restez sur la plateforme, plus elle peut vous proposer de contenus et de publicites.',
            }, {
              title: 'Predire ce qui vous plaira',
              text: "L algorithme se sert de vos clics, de vos likes et du temps passe pour deviner vos prochains centres d interet.",
            }].map((item) => (
              <Card key={item.title} variant="default" className="p-6">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 px-6">
        <Container>
          <Section
            eyebrow="Influence"
            title="Comment l algorithme influence l ordre des contenus"
            description="Deux personnes peuvent voir le meme catalogue dans un ordre totalement different. Selon que l algorithme privilegie la popularite, le score collectif ou la diversite, les contenus remontent ou coulent."
          />
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Cette influence faconne :</h3>
                <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">+</span>
                    <span>Ce que vous decouvrez — l algorithme oriente votre attention vers certains sujets et en ecarte d autres.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">+</span>
                    <span>Ce que les createurs produisent — pour etre visibles, ils adaptent leurs contenus aux critères de l algorithme.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">+</span>
                    <span>Le debat public — quand chacun voit des contenus differents, il devient plus difficile de partager une reference commune et de debattre.</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-64">
                <Card variant="soft" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="neutral">Experimenter</Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-3">Passez a l experimentation</h3>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Dans le laboratoire, vous pouvez comparer ces strategies concrètement sur un meme jeu de donnees et voir comment le classement change.
                  </p>
                  <Button variant="primary" trailingIcon onClick={() => {}}>
                    Ouvrir le laboratoire <ArrowRight className="w-4 h-4" />
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
