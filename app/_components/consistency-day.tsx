import { cn } from "@/lib/utils";

type ConsistencyDayStatus = "completed" | "started" | "empty";

type ConsistencyDayProps = {
  label: string;
  dayNumber: number;
  status: ConsistencyDayStatus;
};

export function ConsistencyDay({ label, dayNumber, status }: ConsistencyDayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-[6px]",
          status === "completed" && "bg-primary",
          status === "started" && "bg-primary/30",
          status === "empty" && "border border-border"
        )}
      >
        {status === "empty" && (
          <span className="text-[8px] leading-none text-muted-foreground">
            {dayNumber}
          </span>
        )}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
