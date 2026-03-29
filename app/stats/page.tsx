import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { CircleCheck, CirclePercent, Hourglass } from "lucide-react";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getStats } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { StreakBanner } from "./_components/streak-banner";
import { ConsistencyHeatmap } from "./_components/consistency-heatmap";
import { StatCard } from "./_components/stat-card";

function formatTotalTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h${String(minutes).padStart(2, "0")}m`;
}

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.endOf("month").format("YYYY-MM-DD");

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const statsResponse = await getStats({ from, to, timezone });

  if (statsResponse.status !== 200) {
    throw new Error("Failed to fetch stats");
  }

  const stats = statsResponse.data;

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[88px]">
      <header className="flex h-14 items-center px-5">
        <span className="font-bold text-foreground text-[22px] tracking-wide">
          Fit.ai
        </span>
      </header>

      <section className="px-5">
        <StreakBanner streak={stats.workoutStreak} />
      </section>

      <section className="px-5 py-5">
        <span className="mb-5 block text-lg font-semibold text-foreground">
          Consistência
        </span>
        <ConsistencyHeatmap consistencyByDay={stats.consistencyByDay} />
      </section>

      <section className="px-5">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={CircleCheck}
            value={String(stats.completedWorkoutsCount)}
            label="Treinos Feitos"
          />
          <StatCard
            icon={CirclePercent}
            value={`${Math.round(stats.conclusionRate * 100)}%`}
            label="Taxa de conclusão"
          />
        </div>
        <div className="mt-3">
          <StatCard
            icon={Hourglass}
            value={formatTotalTime(stats.totalTimeInSeconds)}
            label="Tempo Total"
          />
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
