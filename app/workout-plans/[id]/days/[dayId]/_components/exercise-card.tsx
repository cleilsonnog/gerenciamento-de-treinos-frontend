"use client";

import { useState, useTransition } from "react";
import { CircleHelp, Weight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useChatState } from "@/app/_components/chat/use-chat-state";
import { updateSessionExerciseAction } from "../_actions/update-session-exercise";
import { updateExerciseWeightAction } from "../_actions/update-exercise-weight";

type SessionExerciseData = {
  id: string;
  isCompleted: boolean;
};

type ExerciseCardProps = {
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  restTimeInSeconds: number;
  weightInKg: number | null;
  workoutPlanId: string;
  workoutDayId: string;
  sessionId?: string;
  sessionExercise?: SessionExerciseData;
  isSessionActive: boolean;
};

export function ExerciseCard({
  exerciseId,
  name,
  sets,
  reps,
  restTimeInSeconds,
  weightInKg,
  workoutPlanId,
  workoutDayId,
  sessionId,
  sessionExercise,
  isSessionActive,
}: ExerciseCardProps) {
  const { openChat } = useChatState();
  const [isPending, startTransition] = useTransition();
  const [isCompleted, setIsCompleted] = useState(
    sessionExercise?.isCompleted ?? false,
  );
  const [weightValue, setWeightValue] = useState(
    weightInKg?.toString() ?? "",
  );

  const canCheck = !!sessionId && !!sessionExercise && isSessionActive;

  const handleCheckChange = (checked: boolean | "indeterminate") => {
    if (!canCheck || !sessionId || !sessionExercise || checked === "indeterminate") return;
    setIsCompleted(checked);
    startTransition(() => {
      updateSessionExerciseAction(
        workoutPlanId,
        workoutDayId,
        sessionId,
        sessionExercise.id,
        checked,
      );
    });
  };

  const handleWeightBlur = () => {
    const parsed = weightValue ? parseFloat(weightValue) : null;
    if (parsed === weightInKg) return;
    startTransition(() => {
      updateExerciseWeightAction(
        workoutPlanId,
        workoutDayId,
        exerciseId,
        parsed,
      );
    });
  };

  return (
    <div
      className={`flex flex-col gap-2 py-4 transition-opacity ${isCompleted ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {canCheck && (
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleCheckChange}
              disabled={isPending}
            />
          )}
          <span
            className={`text-base font-semibold ${isCompleted ? "line-through text-muted-foreground" : ""}`}
          >
            {name}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            openChat(`Como executar o exercício ${name} corretamente?`)
          }
        >
          <CircleHelp size={20} className="text-muted-foreground" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {sets} séries
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {reps} reps
        </span>
        <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          <Zap size={10} />
          {restTimeInSeconds}s
        </span>
        <div className="flex items-center gap-1 ml-auto">
          <Weight size={14} className="text-muted-foreground" />
          <Input
            type="number"
            inputMode="decimal"
            placeholder="kg"
            value={weightValue}
            onChange={(e) => setWeightValue(e.target.value)}
            onBlur={handleWeightBlur}
            disabled={isPending}
            className="h-7 w-20 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
