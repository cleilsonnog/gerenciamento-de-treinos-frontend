import { Calendar, Zap } from "lucide-react";
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

type RestDayCardProps = {
  workoutDay: GetWorkoutPlan200WorkoutDaysItem;
};

export function RestDayCard({ workoutDay }: RestDayCardProps) {
  return (
    <div className="flex h-[110px] w-full flex-col justify-between overflow-hidden rounded-xl bg-secondary p-5">
      <div className="flex items-center gap-1.5 self-start rounded-full bg-foreground/8 px-3 py-1">
        <Calendar size={14} className="text-foreground" />
        <span className="text-xs font-semibold text-foreground">
          {WEEK_DAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Zap size={20} className="fill-primary text-primary" />
        <span className="text-2xl font-semibold text-foreground">
          Descanso
        </span>
      </div>
    </div>
  );
}
