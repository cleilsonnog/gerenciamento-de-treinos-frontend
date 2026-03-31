"use client";

import { useState, useEffect, useRef } from "react";
import { Timer } from "lucide-react";

type Props = {
  startedAt: string;
};

function formatElapsedTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function WorkoutTimer({ startedAt }: Props) {
  const [elapsed, setElapsed] = useState(() =>
    Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const startTime = new Date(startedAt).getTime();

    setElapsed(Math.floor((Date.now() - startTime) / 1000));

    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startedAt]);

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5">
      <Timer size={14} className="text-primary-foreground" />
      <span className="text-sm font-semibold text-primary-foreground tabular-nums">
        {formatElapsedTime(elapsed)}
      </span>
    </div>
  );
}
