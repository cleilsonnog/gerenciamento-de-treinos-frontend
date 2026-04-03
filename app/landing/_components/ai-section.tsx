import Link from "next/link";
import { Bot, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiSection() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:p-12">
            <div className="flex flex-col gap-6 md:flex-1">
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Assistente Inteligente
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Não sabe por onde começar? A IA te guia.
              </h2>
              <p className="text-muted-foreground">
                Para você que não sabe por onde começar e não tem acesso a um
                personal trainer, essa é uma excelente solução. Tenha à sua
                disposição uma IA integrada, pronta para montar um plano de
                treino personalizado de acordo com suas necessidades e ainda
                auxiliar com instruções para executar os exercícios com mais
                confiança.
              </p>
              <p className="text-muted-foreground">
                Acompanhe seu progresso e consistência ao longo do tempo, e
                evolua com dados reais sobre sua performance.
              </p>
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
              <div>
                <Button asChild size="lg">
                  <Link href="/auth">Experimentar agora</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center md:flex-1">
              <div className="flex w-full max-w-sm flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Bot size={16} className="text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Treino.IA
                  </span>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-sm text-foreground">
                    Olá! Vou montar um treino ideal pra você. Qual seu objetivo
                    principal: ganhar massa muscular, perder peso ou
                    condicionamento?
                  </p>
                </div>
                <div className="flex justify-end">
                  <div className="rounded-lg bg-primary px-3 py-2">
                    <p className="text-sm text-primary-foreground">
                      Quero ganhar massa muscular!
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-sm text-foreground">
                    Ótima escolha! Quantos dias por semana você pode treinar?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
