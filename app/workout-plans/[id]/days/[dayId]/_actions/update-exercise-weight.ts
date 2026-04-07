"use server";

import { revalidatePath } from "next/cache";

import { updateExerciseWeight } from "@/app/_lib/api/fetch-generated";

export async function updateExerciseWeightAction(
  workoutPlanId: string,
  workoutDayId: string,
  exerciseId: string,
  weightInKg: number | null,
) {
  const response = await updateExerciseWeight(
    workoutPlanId,
    workoutDayId,
    exerciseId,
    { weightInKg },
  );

  if (response.status === 200) {
    revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
  }

  return response;
}
