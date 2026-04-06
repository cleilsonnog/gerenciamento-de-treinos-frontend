"use client";

import { Smartphone, BarChart3, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

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
    <section className="relative px-5 py-24 overflow-hidden">
      
      {/* 🔥 Fundo com glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/40 via-transparent to-transparent" />
      <div className="absolute top-10 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-30" />

      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Como{" "}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              funciona
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            Em três passos simples, você já está treinando com inteligência.
          </p>
        </div>

        {/* Linha conectora */}
        <div className="relative hidden sm:block mb-12">
          <div className="absolute top-8 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/20 via-border to-destructive/20" />
        </div>

        {/* 🔥 GRID ANIMADO */}
        <motion.div
          className="grid gap-10 sm:grid-cols-3"
          initial="hidden"
          animate="visible"
          viewport={{ once: true, margin: "100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="group relative flex flex-col items-center text-center"
            >
              
              {/* Glow no hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-destructive/10 opacity-0 blur-xl transition duration-300 group-hover:opacity-100" />

              {/* Ícone */}
              <div className="relative z-10 mb-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl backdrop-blur-md border border-border/50 ${step.accent} transition-transform duration-300 group-hover:scale-110`}
                >
                  <step.icon size={28} />
                </div>

                {/* Número */}
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-primary to-destructive text-xs font-bold text-white shadow">
                  {index + 1}
                </span>
              </div>

              {/* Texto */}
              <h3 className="text-lg font-semibold text-foreground">
                {step.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}