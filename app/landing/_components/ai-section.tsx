import Link from "next/link";
import { Bot, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiSection() {
  return (
    <section className="relative px-5 py-24 overflow-hidden">
      
      {/* 🔥 Glow de fundo */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-10 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-40" />

      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-xl">
          
          {/* Glow interno */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-destructive/10 opacity-60" />

          <div className="relative flex flex-col gap-10 p-8 md:flex-row md:items-center md:p-12">
            
            {/* Texto */}
            <div className="flex flex-col gap-6 md:flex-1">
              
              {/* Badge */}
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 px-3 py-1 backdrop-blur">
                <Bot size={16} className="text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Assistente Inteligente
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Não sabe por onde começar?{" "}
                <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                  A IA te guia.
                </span>
              </h2>

              {/* Texto */}
              <p className="text-muted-foreground leading-relaxed">
                Para você que não sabe por onde começar e não tem acesso a um
                personal trainer, essa é uma excelente solução. Tenha à sua
                disposição uma IA integrada, pronta para montar um plano de
                treino personalizado.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Acompanhe seu progresso, mantenha consistência e evolua com dados
                reais sobre sua performance.
              </p>

              {/* Benefícios */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Sparkles size={16} className="text-primary" />
                  <span>Planos personalizados</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Shield size={16} className="text-primary" />
                  <span>Instruções seguras</span>
                </div>
              </div>

              {/* CTA */}
              <div>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-primary to-destructive text-white shadow-lg hover:opacity-90"
                >
                  <Link href="/auth">Experimentar agora</Link>
                </Button>
              </div>
            </div>

            {/* Chat mockup */}
            <div className="flex items-center justify-center md:flex-1">
              <div className="relative w-full max-w-sm">
                
                {/* Glow atrás do chat */}
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl opacity-40" />

                <div className="relative flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl p-5 shadow-2xl">
                  
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <Bot size={16} className="text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      Treino.IA
                    </span>
                  </div>

                  {/* Mensagens */}
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-sm text-foreground">
                      Olá! Vou montar um treino ideal pra você. Qual seu objetivo?
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <div className="rounded-lg bg-primary px-3 py-2">
                      <p className="text-sm text-primary-foreground">
                        Ganhar massa muscular
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-sm text-foreground">
                      Perfeito! Quantos dias por semana você treina?
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}