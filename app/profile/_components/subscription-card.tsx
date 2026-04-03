"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, RefreshCw } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SubscriptionCardProps {
  plan: string;
  subscriptionStatus: string | null;
  trialEndsAt: string;
  isTrialActive: boolean;
  hasAccess: boolean;
}

const PLAN_LABELS: Record<string, string> = {
  FREE: "Gratuito",
  MONTHLY: "Mensal",
  QUARTERLY: "Trimestral",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Ativo",
  CANCELED: "Cancelado",
  INCOMPLETE: "Incompleto",
  PAST_DUE: "Pagamento pendente",
};

export function SubscriptionCard({
  plan,
  subscriptionStatus,
  trialEndsAt,
  isTrialActive,
  hasAccess,
}: SubscriptionCardProps) {
  const router = useRouter();
  const [canceling, setCanceling] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);

  const isActive = plan !== "FREE" && subscriptionStatus === "ACTIVE";
  const planLabel = PLAN_LABELS[plan] ?? plan;
  const statusLabel = subscriptionStatus
    ? (STATUS_LABELS[subscriptionStatus] ?? subscriptionStatus)
    : null;

  const daysLeft = isTrialActive
    ? dayjs(trialEndsAt).diff(dayjs(), "day")
    : 0;

  const otherPlan = plan === "MONTHLY" ? "QUARTERLY" : "MONTHLY";
  const otherPlanLabel = PLAN_LABELS[otherPlan];
  const otherPlanPrice = otherPlan === "MONTHLY" ? "R$ 14,90/mês" : "R$ 39,90/trimestre";

  const handleCancel = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) return;

    setCanceling(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cancel-subscription`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setCanceling(false);
    }
  };

  const handleChangePlan = async () => {
    if (
      !confirm(
        `Deseja trocar para o plano ${otherPlanLabel} (${otherPlanPrice})?`,
      )
    )
      return;

    setChangingPlan(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/change-plan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ plan: otherPlan }),
        },
      );

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Change plan error:", error);
    } finally {
      setChangingPlan(false);
    }
  };

  const handleUpgrade = () => {
    router.push("/landing#planos");
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl bg-primary/8 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Assinatura
          </span>
        </div>
        {isActive && (
          <Badge variant="default" className="text-xs">
            {statusLabel}
          </Badge>
        )}
        {isTrialActive && (
          <Badge variant="secondary" className="text-xs">
            Trial - {daysLeft} {daysLeft === 1 ? "dia restante" : "dias restantes"}
          </Badge>
        )}
        {!hasAccess && !isActive && (
          <Badge variant="destructive" className="text-xs">
            Expirado
          </Badge>
        )}
      </div>

      {!hasAccess && !isActive && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
          <p className="text-sm text-destructive">
            Seu período de teste expirou. Assine um plano para continuar
            utilizando todas as funcionalidades.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-foreground">
          Plano {planLabel}
        </span>
        {!isActive && (
          <Button
            variant={hasAccess ? "outline" : "default"}
            size="sm"
            className="h-8 text-xs"
            onClick={handleUpgrade}
          >
            Assinar plano
          </Button>
        )}
      </div>

      {isActive && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex-1 text-xs"
            disabled={changingPlan}
            onClick={handleChangePlan}
          >
            {changingPlan ? (
              <Loader2 className="mr-1 size-3 animate-spin" />
            ) : (
              <RefreshCw className="mr-1 size-3" />
            )}
            Trocar para {otherPlanLabel}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={canceling}
            onClick={handleCancel}
          >
            {canceling ? (
              <Loader2 className="mr-1 size-3 animate-spin" />
            ) : null}
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}
