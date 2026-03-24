import { Button } from "@/components/ui/button";
import { completeWorkoutAction } from "../_actions/complete-workout";

type Props = {
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
};

export function MarkAsCompletedButton({
  workoutPlanId,
  workoutDayId,
  sessionId,
}: Props) {
  const action = completeWorkoutAction.bind(
    null,
    workoutPlanId,
    workoutDayId,
    sessionId
  );
  return (
    <form action={action}>
      <Button type="submit" variant="secondary" className="w-full">
        Marcar como concluído
      </Button>
    </form>
  );
}
