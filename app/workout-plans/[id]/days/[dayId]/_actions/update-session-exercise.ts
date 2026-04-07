"use server";

import { revalidatePath } from "next/cache";

import { updateSessionExercise } from "@/app/_lib/api/fetch-generated";

export async function updateSessionExerciseAction(
  workoutPlanId: string,
  workoutDayId: string,
  sessionId: string,
  sessionExerciseId: string,
  isCompleted: boolean,
) {
  const response = await updateSessionExercise(
    workoutPlanId,
    sessionId,
    sessionExerciseId,
    { isCompleted },
  );

  if (response.status === 200) {
    revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
  }

  return response;
}
