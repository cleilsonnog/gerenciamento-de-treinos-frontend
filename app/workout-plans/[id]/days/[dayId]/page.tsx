import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Calendar, CircleHelp, Dumbbell, Timer, Zap } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getWorkoutDay } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { Button } from "@/components/ui/button";
import { BackButton } from "./_components/back-button";

import { StartWorkoutButton } from "./_components/start-workout-button";
import { MarkAsCompletedButton } from "./_components/mark-as-completed-button";

const WEEK_DAY_LABELS: Record<string, string> = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

type PageProps = {
  params: Promise<{ id: string; dayId: string }>;
};

export default async function WorkoutDayPage({ params }: PageProps) {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const { id, dayId } = await params;
  const response = await getWorkoutDay(id, dayId);

  if (response.status !== 200) {
    throw new Error("Failed to fetch workout day");
  }

  const workoutDay = response.data;
  const durationInMinutes = Math.round(
    workoutDay.estimatedDurationInSeconds / 60
  );

  const inProgressSession = workoutDay.sessions.find(
    (s) => s.startedAt && !s.completedAt
  );
  const hasCompletedSession = workoutDay.sessions.some((s) => s.completedAt);

  const dayLabel =
    WEEK_DAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay;

  return (
    <div className="min-h-screen bg-background pb-[88px]">
      <div className="flex items-center justify-between px-5 py-4">
        <BackButton />
        <h1 className="text-lg font-semibold">{dayLabel}</h1>
        <div className="w-10" />
      </div>

      <div className="relative mx-5 h-[200px] overflow-hidden rounded-xl bg-foreground">
        {workoutDay.coverImageUrl && (
          <Image
            src={workoutDay.coverImageUrl}
            alt={workoutDay.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-foreground/10" />
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <div className="flex items-center gap-1.5 self-start rounded-full bg-background/20 px-3 py-1">
            <Calendar size={14} className="text-primary-foreground" />
            <span className="text-xs font-semibold text-primary-foreground">
              {dayLabel.toUpperCase()}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold text-primary-foreground">
                {workoutDay.name}
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Timer size={14} className="text-primary-foreground/70" />
                  <span className="text-xs text-primary-foreground/70">
                    {durationInMinutes}min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell size={14} className="text-primary-foreground/70" />
                  <span className="text-xs text-primary-foreground/70">
                    {workoutDay.exercises.length} exercícios
                  </span>
                </div>
              </div>
            </div>
            {!inProgressSession &&
              (hasCompletedSession ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground"
                >
                  Concluído!
                </Button>
              ) : (
                <StartWorkoutButton workoutPlanId={id} workoutDayId={dayId} />
              ))}
          </div>
        </div>
      </div>

      <div className="mx-5 mt-6 flex flex-col divide-y divide-border">
        {workoutDay.exercises.map((exercise) => (
          <div key={exercise.id} className="flex flex-col gap-2 py-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">{exercise.name}</span>
              <Button variant="ghost" size="icon">
                <CircleHelp size={20} className="text-muted-foreground" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {exercise.sets} séries
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {exercise.reps} reps
              </span>
              <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Zap size={10} />
                {exercise.restTimeInSeconds}s
              </span>
            </div>
          </div>
        ))}
      </div>

      {inProgressSession && (
        <div className="mx-5 mt-4">
          <MarkAsCompletedButton
            workoutPlanId={id}
            workoutDayId={dayId}
            sessionId={inProgressSession.id}
          />
        </div>
      )}

      <BottomNav calendarHref={`/workout-plans/${id}/days/${dayId}`} />
    </div>
  );
}
