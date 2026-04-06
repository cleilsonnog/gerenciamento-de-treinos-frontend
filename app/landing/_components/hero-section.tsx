"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeUp } from "./animations/FadeUp";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-5 py-20 text-center overflow-hidden">
      
      {/* 🔥 Background glow forte */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-destructive/20 blur-3xl opacity-40" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        
        {/* Badge */}
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 backdrop-blur px-4 py-1.5 shadow-sm">
          <Sparkles size={14} className="text-primary" />
          <span className="text-sm font-medium text-primary">
            Potencializado por IA
          </span>
        </div>

        {/* Headline */}
        <FadeUp>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Seu treino personalizado,{" "}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              inteligente
            </span>{" "}
            e na palma da mão
          </h1>
        </FadeUp>

        {/* Texto */}
        <FadeUp>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Tenha um plano de treino feito sob medida por inteligência artificial.
            Acompanhe seu progresso, mantenha a consistência e evolua todos os dias.
          </p>
        </FadeUp>

        {/* CTA */}
        <FadeUp>
          <div className="flex flex-col gap-3 sm:flex-row">
            
            {/* 🔥 BOTÃO PRINCIPAL COM MICRO INTERAÇÃO */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="text-base bg-gradient-to-r from-primary to-destructive text-white shadow-lg hover:opacity-90"
              >
                <Link href="/auth">Começar agora</Link>
              </Button>
            </motion.div>

            {/* 🔥 BOTÃO SECUNDÁRIO */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base backdrop-blur"
              >
                <a href="#sobre">Saiba mais</a>
              </Button>
            </motion.div>

          </div>
        </FadeUp>
      </div>
    </section>
  );
}