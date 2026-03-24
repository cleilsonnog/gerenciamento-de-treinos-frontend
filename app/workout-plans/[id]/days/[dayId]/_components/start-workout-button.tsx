import { Button } from "@/components/ui/button";
import { startWorkoutAction } from "../_actions/start-workout";

type Props = {
  workoutPlanId: string;
  workoutDayId: string;
};

export function StartWorkoutButton({ workoutPlanId, workoutDayId }: Props) {
  const action = startWorkoutAction.bind(null, workoutPlanId, workoutDayId);
  return (
    <form action={action}>
      <Button type="submit" size="sm">
        Iniciar treino
      </Button>
    </form>
  );
}
