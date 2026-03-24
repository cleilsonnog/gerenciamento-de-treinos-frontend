"use server";

import { revalidatePath } from "next/cache";
import { startWorkoutSession } from "@/app/_lib/api/fetch-generated";

export async function startWorkoutAction(
  workoutPlanId: string,
  workoutDayId: string
) {
  const response = await startWorkoutSession(workoutPlanId, workoutDayId);
  if (response.status === 201) {
    revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
  }
}
