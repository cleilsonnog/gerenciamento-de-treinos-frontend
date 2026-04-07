"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/app/_lib/auth-client";

type PlanType = "MONTHLY" | "YEARLY";

const plans: Array<{
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  pricePerMonth?: string;
  promoLabel?: string;
  features: string[];
  highlighted: boolean;
  planType: PlanType;
}> = [
  {
    name: "Mensal",
    price: "9,90",
    originalPrice: "14,90",
    period: "/mês",
    description: "Ideal para quem quer experimentar",
    promoLabel: "R$ 9,90 por 6 meses",
    features: [
      "Plano de treino personalizado por IA",
      "Acompanhamento de progresso",
      "Assistente inteligente",
      "Treinos ilimitados",
    ],
    highlighted: false,
    planType: "MONTHLY",
  },
  {
    name: "Anual",
    price: "99,00",
    period: "/ano",
    description: "Melhor custo-benefício",
    pricePerMonth: "8,25",
    features: [
      "Tudo do plano mensal",
      "Economia de 45%",
      "Suporte prioritário",
    ],
    highlighted: true,
    planType: "YEARLY",
  },
];

export function PricingSection() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);

  const handleSubscribe = async (planType: PlanType) => {
    setLoadingPlan(planType);

    try {
      const session = await authClient.getSession();

      if (!session.data?.user) {
        router.push("/auth");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ plan: planType }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      setLoadingPlan(null);
    }
  };

  return (
<section id="planos" className="relative px-5 py-24 overflow-hidden">
  
  {/* 🔥 Glow de fundo */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/40 via-transparent to-transparent" />
  <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-30" />

  <div className="mx-auto max-w-4xl">
    
    {/* Header */}
    <div className="mb-16 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Planos e{" "}
        <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
          preços
        </span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
        Escolha o plano que mais combina com você e comece a treinar com
        inteligência,{" "}
        <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-sm font-semibold text-destructive ring-1 ring-destructive/20">
          14 dias grátis para testar a IA
        </span>
      </p>
    </div>

    {/* Cards */}
    <div className="grid gap-8 sm:grid-cols-2">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`group relative flex flex-col rounded-3xl border p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            plan.highlighted
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-[1.02]"
              : "border-border/50 bg-background/60"
          }`}
        >
          
          {/* Glow no hover */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/10 to-destructive/10 opacity-0 blur-xl transition duration-300 group-hover:opacity-100" />

          {/* Badge */}
          {plan.highlighted && (
            <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-destructive text-white shadow">
              Mais popular
            </Badge>
          )}

          {/* Conteúdo */}
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-foreground">
              {plan.name}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {plan.description}
            </p>

            {/* Preço */}
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-sm text-muted-foreground">R$</span>
              <span className="text-4xl font-bold text-foreground">
                {plan.price}
              </span>
              <span className="text-sm text-muted-foreground">
                {plan.period}
              </span>
              {plan.originalPrice && (
                <span className="ml-1 text-sm text-muted-foreground line-through">
                  R$ {plan.originalPrice}
                </span>
              )}
            </div>

            {plan.promoLabel && (
              <p className="mt-1 text-xs font-medium text-destructive">
                {plan.promoLabel}
              </p>
            )}

            {plan.pricePerMonth && (
              <p className="mt-1 text-xs text-muted-foreground">
                equivalente a R$ {plan.pricePerMonth}/mês
              </p>
            )}

            {/* Features */}
            <ul className="mt-6 flex flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check size={16} className="shrink-0 text-primary" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8">
              <Button
                className={`w-full ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-primary to-destructive text-white shadow-lg hover:opacity-90"
                    : ""
                }`}
                variant={plan.highlighted ? "default" : "outline"}
                disabled={loadingPlan !== null}
                onClick={() => handleSubscribe(plan.planType)}
              >
                {loadingPlan === plan.planType ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Redirecionando...
                  </>
                ) : plan.highlighted ? (
                  "Começar agora"
                ) : (
                  "Assinar agora"
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
  );
}
