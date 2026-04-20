import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Weight, Ruler, BicepsFlexed, User, ShieldCheck, MessageCircle } from "lucide-react";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getUserTrainData, getHome } from "@/app/_lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/app/_components/bottom-nav";
import { StatCard } from "./_components/stat-card";
import { LogoutButton } from "./_components/logout-button";
import { SettingsButton } from "./_components/settings-button";
import { SubscriptionCard } from "./_components/subscription-card";
import { customFetch } from "@/app/_lib/fetch";

interface SubscriptionData {
  plan: string;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  subscriptionId: string | null;
  trialEndsAt: string;
  isTrialActive: boolean;
  hasAccess: boolean;
}

interface SubscriptionResponse {
  data: SubscriptionData;
  status: number;
}

const getSubscription = async (): Promise<SubscriptionResponse> => {
  return customFetch<SubscriptionResponse>("/subscription", {
    method: "GET",
    cache: "no-store",
  });
};

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const [trainDataResponse, homeResponse, subscriptionResponse] =
    await Promise.all([
      getUserTrainData({ cache: "no-store" }),
      getHome(dayjs().format("YYYY-MM-DD"), undefined, { cache: "no-store" }),
      getSubscription(),
    ]);

  const hasNoTrainData =
    trainDataResponse.status !== 200 || trainDataResponse.data === null;
  const hasNoActivePlan =
    homeResponse.status !== 200 || !homeResponse.data.activeWorkoutPlanId;

  if (hasNoTrainData || hasNoActivePlan) redirect("/onboarding");

  const user = session.data.user as { name: string; image?: string | null; role?: string };
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const trainData =
    trainDataResponse.status === 200 ? trainDataResponse.data : null;

  const subscription =
    subscriptionResponse.status === 200 ? subscriptionResponse.data : null;

  const planLabel =
    subscription?.plan === "MONTHLY"
      ? "Mensal"
      : subscription?.plan === "YEARLY"
        ? "Anual"
        : subscription?.plan === "QUARTERLY"
          ? "Trimestral"
          : "Gratuito";

  const weightInKg = trainData
    ? (trainData.weightInGrams / 1000).toFixed(1)
    : "--";
  const heightInCm = trainData
    ? String(trainData.heightInCentimeters)
    : "--";
  const bodyFat = trainData?.bodyFatPercentage != null ? `${trainData.bodyFatPercentage}%` : "--";
  const age = trainData ? String(trainData.age) : "--";

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[88px]">
      <header className="flex h-14 items-center px-5">
        <span className="text-[22px] font-bold text-foreground">Treino.IA</span>
      </header>

      <section className="flex flex-col items-center gap-6 px-5 pt-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-[52px]">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5">
              <span className="text-lg font-semibold text-foreground">
                {user.name}
              </span>
              <span className="text-sm text-foreground/70">
                Plano {planLabel}
              </span>
            </div>
          </div>
          <SettingsButton
            trainData={{
              weightInGrams: trainData!.weightInGrams,
              heightInCentimeters: trainData!.heightInCentimeters,
              age: trainData!.age,
              bodyFatPercentage: trainData!.bodyFatPercentage,
            }}
          />
        </div>

        <SubscriptionCard
          plan={subscription?.plan ?? "FREE"}
          subscriptionStatus={subscription?.subscriptionStatus ?? null}
          trialEndsAt={subscription?.trialEndsAt ?? new Date().toISOString()}
          isTrialActive={subscription?.isTrialActive ?? false}
          hasAccess={subscription?.hasAccess ?? false}
        />

        <div className="grid w-full grid-cols-2 gap-3">
          <StatCard icon={Weight} value={weightInKg} unit="Kg" />
          <StatCard icon={Ruler} value={heightInCm} unit="Cm" />
          <StatCard icon={BicepsFlexed} value={bodyFat} unit="Gc" />
          <StatCard icon={User} value={age} unit="Anos" />
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/contact">
            <MessageCircle size={18} />
            Fale Conosco
          </Link>
        </Button>

        {user.role === "admin" && (
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin">
              <ShieldCheck size={18} />
              Painel Admin
            </Link>
          </Button>
        )}

        <LogoutButton />
      </section>

      <BottomNav />
    </div>
  );
}
