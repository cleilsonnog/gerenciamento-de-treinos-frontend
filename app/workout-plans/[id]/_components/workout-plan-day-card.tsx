import Image from "next/image";
import Link from "next/link";
import { Calendar, Dumbbell, Timer } from "lucide-react";
import { GetWorkoutPlan200WorkoutDaysItem } from "@/app/_lib/api/fetch-generated";

const WEEK_DAY_LABELS: Record<string, string> = {
  MONDAY: "segunda",
  TUESDAY: "terça",
  WEDNESDAY: "quarta",
  THURSDAY: "quinta",
  FRIDAY: "sexta",
  SATURDAY: "sábado",
  SUNDAY: "domingo",
};

type WorkoutPlanDayCardProps = {
  workoutPlanId: string;
  workoutDay: GetWorkoutPlan200WorkoutDaysItem;
};

export function WorkoutPlanDayCard({
  workoutPlanId,
  workoutDay,
}: WorkoutPlanDayCardProps) {
  const durationInMinutes = Math.round(
    workoutDay.estimatedDurationInSeconds / 60
  );

  return (
    <Link
      href={`/workout-plans/${workoutPlanId}/days/${workoutDay.id}`}
    >
      <div className="relative h-[200px] w-full overflow-hidden rounded-xl bg-foreground">
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
          <div className="flex items-center gap-1.5 self-start rounded-full bg-primary-foreground/16 px-3 py-1">
            <Calendar size={14} className="text-primary-foreground" />
            <span className="text-xs font-semibold text-primary-foreground">
              {WEEK_DAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay}
            </span>
          </div>
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
                  {workoutDay.exercisesCount} exercícios
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
