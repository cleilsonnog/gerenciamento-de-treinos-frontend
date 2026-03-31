import { Smartphone, BarChart3, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Converse com a IA",
    description:
      "Responda algumas perguntas sobre seus objetivos, nível de experiência e disponibilidade. A IA cria seu plano personalizado em segundos.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: Smartphone,
    title: "Siga seu plano de treino",
    description:
      "Acesse seus treinos organizados por dia da semana. Cada exercício vem com séries, repetições e tempo de descanso.",
    accent: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: BarChart3,
    title: "Acompanhe sua evolução",
    description:
      "Veja suas estatísticas, sequência de treinos e consistência semanal. Mantenha-se motivado com dados reais do seu progresso.",
    accent: "bg-chart-3/10 text-chart-3",
  },
];

export function TourSection() {
  return (
    <section className="bg-secondary/50 px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Como funciona
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Em três passos simples, você já está treinando com inteligência.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="relative">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.accent}`}
                >
                  <step.icon size={28} />
                </div>
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
