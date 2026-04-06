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
    <section id="sobre" className="relative px-5 py-24 overflow-hidden">
      
      {/* 🔥 Glow de fundo */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-40" />

      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tudo que você precisa para{" "}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              treinar melhor
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            O Treino.IA combina tecnologia de ponta com ciência do exercício para
            oferecer a melhor experiência de treino.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative flex gap-4 rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              
              {/* Glow no hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-destructive/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

              {/* Ícone */}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon
                  size={24}
                  className="text-primary transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Texto */}
              <div className="relative z-10 flex flex-col gap-1">
                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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