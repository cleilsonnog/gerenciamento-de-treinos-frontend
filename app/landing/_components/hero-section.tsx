import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-5 py-20 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
          <Sparkles size={14} className="text-primary" />
          <span className="text-sm font-medium text-primary">
            Potencializado por IA
          </span>
        </div>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Seu treino personalizado,{" "}
          <span className="text-primary">inteligente</span> e na palma da mão
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Tenha um plano de treino feito sob medida por inteligência artificial.
          Acompanhe seu progresso, mantenha a consistência e evolua todos os
          dias.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="text-base">
            <Link href="/auth">Começar agora</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base">
            <a href="#sobre">Saiba mais</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
