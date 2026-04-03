"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/app/_lib/auth-client";

type PlanType = "MONTHLY" | "QUARTERLY";

const plans: Array<{
  name: string;
  price: string;
  period: string;
  description: string;
  pricePerMonth?: string;
  features: string[];
  highlighted: boolean;
  planType: PlanType;
}> = [
  {
    name: "Mensal",
    price: "14,90",
    period: "/mês",
    description: "Ideal para quem quer experimentar",
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
    name: "Trimestral",
    price: "39,90",
    period: "/trimestre",
    description: "Melhor custo-benefício",
    pricePerMonth: "13,30",
    features: [
      "Tudo do plano mensal",
      "Economia de 10%",
      "Suporte prioritário",
      "Relatórios avançados",
    ],
    highlighted: true,
    planType: "QUARTERLY",
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
    <section id="planos" className="bg-secondary/50 px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Planos e preços
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Escolha o plano que mais combina com você e comece a treinar com
            inteligência.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-card p-8 ${
                plan.highlighted
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Mais popular
                </Badge>
              )}
              <h3 className="text-xl font-semibold text-foreground">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-sm text-muted-foreground">R$</span>
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
              {plan.pricePerMonth && (
                <p className="mt-1 text-xs text-muted-foreground">
                  equivalente a R$ {plan.pricePerMonth}/mês
                </p>
              )}
              <ul className="mt-6 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check
                      size={16}
                      className="shrink-0 text-primary"
                    />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  disabled={loadingPlan !== null}
                  onClick={() => handleSubscribe(plan.planType)}
                >
                  {loadingPlan === plan.planType ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Redirecionando...
                    </>
                  ) : (
                    "Assinar agora"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
