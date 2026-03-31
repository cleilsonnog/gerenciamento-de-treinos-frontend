import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
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
  },
];

export function PricingSection() {
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
                  asChild
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href="/auth">Assinar agora</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
