import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type StreakBannerProps = {
  streak: number;
};

export function StreakBanner({ streak }: StreakBannerProps) {
  return (
    <div
      className={cn(
        "flex h-[210px] flex-col items-center justify-center gap-3 rounded-3xl",
        streak > 0
          ? "bg-gradient-to-br from-streak-banner-active-from to-streak-banner-active-to"
          : "bg-gradient-to-br from-streak-banner-inactive-from to-streak-banner-inactive-to"
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background/12">
        <Flame
          size={32}
          className={cn(
            streak > 0 ? "text-streak-foreground" : "text-background"
          )}
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-5xl font-semibold text-background">
          {streak} {streak === 1 ? "dia" : "dias"}
        </span>
        <span className="text-base text-background">
          Sequência Atual
        </span>
      </div>
    </div>
  );
}
