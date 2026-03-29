"use client";

import { CircleHelp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatState } from "@/app/_components/chat/use-chat-state";

type ExerciseCardProps = {
  name: string;
  sets: number;
  reps: number;
  restTimeInSeconds: number;
};

export function ExerciseCard({
  name,
  sets,
  reps,
  restTimeInSeconds,
}: ExerciseCardProps) {
  const { openChat } = useChatState();

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">{name}</span>
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
      </div>
    </div>
  );
}
