import Image from "next/image";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Goal } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getWorkoutPlan } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { WorkoutPlanDayCard } from "./_components/workout-plan-day-card";
import { RestDayCard } from "./_components/rest-day-card";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkoutPlanPage({ params }: PageProps) {
  const { id } = await params;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const response = await getWorkoutPlan(id);

  if (response.status !== 200) {
    throw new Error("Failed to fetch workout plan");
  }

  const workoutPlan = response.data;
  const user = session.data.user;
  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[88px]">
      <section className="relative h-[296px] w-full overflow-hidden rounded-b-3xl bg-foreground">
        <Image
          src="/home-banner.jpg"
          alt="Plano de Treino"
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
            <div className="flex flex-col gap-1.5">
              <Badge className="gap-1.5 px-3 py-1">
                <Goal size={16} />
                <span className="text-xs font-semibold uppercase">
                  {workoutPlan.name}
                </span>
              </Badge>
              <span className="text-2xl font-semibold text-primary-foreground">
                Plano de Treino
              </span>
            </div>
            <Avatar className="size-12">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name ?? "Avatar"} />
              )}
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 px-5 py-5">
        {workoutPlan.workoutDays.map((workoutDay) =>
          workoutDay.isRest ? (
            <RestDayCard key={workoutDay.id} workoutDay={workoutDay} />
          ) : (
            <WorkoutPlanDayCard
              key={workoutDay.id}
              workoutPlanId={workoutPlan.id}
              workoutDay={workoutDay}
            />
          )
        )}
      </section>

      <BottomNav />
    </div>
  );
}
