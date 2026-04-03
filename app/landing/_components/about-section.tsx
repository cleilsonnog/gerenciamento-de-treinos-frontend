import { Brain, Dumbbell, TrendingUp, CalendarCheck } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Personal Trainer",
    description:
      "Um assistente inteligente que monta seu plano de treino personalizado com base nos seus objetivos.",
  },
  {
    icon: Dumbbell,
    title: "Treinos sob medida",
    description:
      "Exercícios adaptados ao seu nível, tempo disponível e equipamentos que você tem acesso.",
  },
  {
    icon: TrendingUp,
    title: "Acompanhe seu progresso",
    description:
      "Visualize sua evolução ao longo do tempo com estatísticas detalhadas e relatórios visuais.",
  },
  {
    icon: CalendarCheck,
    title: "Consistência garantida",
    description:
      "Acompanhe sua sequência de treinos e mantenha a motivação sempre alta.",
  },
];

export function AboutSection() {
  return (
    <section id="sobre" className="px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Tudo que você precisa para treinar melhor
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            O Treino.IA combina tecnologia de ponta com ciência do exercício para
            oferecer a melhor experiência de treino.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-4 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon size={24} className="text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
