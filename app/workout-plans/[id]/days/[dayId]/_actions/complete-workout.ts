"use server";

import { revalidatePath } from "next/cache";
import dayjs from "dayjs";
import { updateWorkoutSession } from "@/app/_lib/api/fetch-generated";

export async function completeWorkoutAction(
  workoutPlanId: string,
  workoutDayId: string,
  sessionId: string
) {
  const response = await updateWorkoutSession(
    workoutPlanId,
    workoutDayId,
    sessionId,
    { completedAt: dayjs().toISOString() }
  );
  if (response.status === 200) {
    revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
  }
}
