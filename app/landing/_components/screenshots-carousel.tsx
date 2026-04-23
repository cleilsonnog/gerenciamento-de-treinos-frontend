"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FadeUp } from "./animations/FadeUp";

const screenshots = [
  { src: "/screenshots/home.jpeg", alt: "Tela inicial do Treino.IA" },
  { src: "/screenshots/plans.jpeg", alt: "Plano de treino semanal" },
  { src: "/screenshots/workout.jpeg", alt: "Detalhes do treino" },
  { src: "/screenshots/coach-ai.jpeg", alt: "Coach IA" },
  { src: "/screenshots/stats.jpeg", alt: "Estatísticas de progresso" },
  { src: "/screenshots/profile.jpeg", alt: "Perfil do usuário" },
  { src: "/screenshots/settings.jpeg", alt: "Configurações" },
];

export function ScreenshotsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative px-5 py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <FadeUp>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Veja o app{" "}
              <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                em ação
              </span>
            </h2>
          </FadeUp>
          <FadeUp>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Confira algumas telas do Treino.IA e descubra como o app pode
              transformar seus treinos.
            </p>
          </FadeUp>
        </div>

        <FadeUp>
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: true,
              }),
            ]}
            className="mx-auto max-w-[900px]"
          >
            <CarouselContent className="-ml-4">
              {screenshots.map((screenshot, index) => (
                <CarouselItem
                  key={screenshot.src}
                  className="pl-4 basis-[55%] sm:basis-[40%] md:basis-[30%]"
                >
                  <motion.div
                    animate={{
                      scale: current === index ? 1 : 0.9,
                      opacity: current === index ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden rounded-[2rem] border-2 border-border/50 bg-background shadow-xl"
                  >
                    <Image
                      src={screenshot.src}
                      alt={screenshot.alt}
                      width={738}
                      height={1600}
                      className="h-auto w-full"
                      quality={80}
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-8 flex justify-center gap-2">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  current === index
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
