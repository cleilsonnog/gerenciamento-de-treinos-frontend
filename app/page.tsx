import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Flame } from "lucide-react";
import dayjs from "dayjs";
import { authClient } from "./_lib/auth-client";
import { getHome, getUserTrainData } from "./_lib/api/fetch-generated";
import { BottomNav } from "./_components/bottom-nav";
import { ConsistencyDay } from "./_components/consistency-day";
import { WorkoutDayCard } from "./_components/workout-day-card";

const WEEK_DAY_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/landing");

  const today = dayjs();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [homeResponse, trainDataResponse] = await Promise.all([
    getHome(today.format("YYYY-MM-DD"), { timezone }, { cache: "no-store" }),
    getUserTrainData({ cache: "no-store" }),
  ]);

  const hasNoTrainData =
    trainDataResponse.status !== 200 || trainDataResponse.data === null;
  const hasNoActivePlan =
    homeResponse.status !== 200 || !homeResponse.data.activeWorkoutPlanId;

  if (hasNoTrainData || hasNoActivePlan) redirect("/onboarding");

  const homeData = homeResponse.data;

  const dayOfWeek = today.day();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = today.add(mondayOffset, "day");

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = monday.add(i, "day").format("YYYY-MM-DD");
    const consistency = homeData.consistencyByDay[date];
    const status = consistency?.workoutDayCompleted
      ? ("completed" as const)
      : consistency?.workoutDayStarted
        ? ("started" as const)
        : ("empty" as const);
    return { label: WEEK_DAY_LABELS[i], status };
  });

  const userName = session.data.user.name?.split(" ")[0] ?? "Você";
  //const coverImageUrl = homeData.todayWorkoutDay?.coverImageUrl;

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[88px]">
      <section className="relative h-[296px] w-full overflow-hidden rounded-b-3xl bg-foreground">
          <Image
            src="/home-banner.jpg"
            alt="Treino de hoje"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 to-foreground/80" />
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <span className="font-bold text-primary-foreground text-[22px] tracking-wide">
            Fit.ai
          </span>
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-2xl font-semibold text-primary-foreground">
                Olá, {userName}
              </span>
              <span className="text-sm text-primary-foreground/70">
                Bora treinar hoje?
              </span>
            </div>
            <div className="flex items-center justify-center rounded-full bg-primary px-4 py-1.5">
              <span className="text-sm font-semibold text-primary-foreground">
                Bora!
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            Consistência
          </span>
          <Link href="/stats" className="text-xs text-primary">
            Ver histórico
          </Link>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-1 items-center justify-between rounded-xl border border-border px-5 py-5">
            {weekDays.map((day, i) => (
              <ConsistencyDay key={i} label={day.label} status={day.status} />
            ))}
          </div>
          <div className="flex w-20 flex-col items-center justify-center gap-1 rounded-xl bg-streak px-4 py-5">
            <Flame size={16} className="text-streak-foreground" />
            <span className="text-base font-semibold text-foreground">
              {homeData.workoutStreak}
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 py-1">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            Treino de Hoje
          </span>
          <button
            type="button"
            className="text-xs text-primary"
          >
            Ver treinos
          </button>
        </div>
        {homeData.todayWorkoutDay ? (
          <WorkoutDayCard workoutDay={homeData.todayWorkoutDay} />
        ) : (
          <div className="flex h-[200px] items-center justify-center rounded-xl border border-border">
            <span className="text-sm text-muted-foreground">
              Sem treino para hoje
            </span>
          </div>
        )}
      </section>

      <BottomNav
        calendarHref={
          homeData.todayWorkoutDay
            ? `/workout-plans/${homeData.todayWorkoutDay.workoutPlanId}`
            : undefined
        }
      />
    </div>
  );
}
