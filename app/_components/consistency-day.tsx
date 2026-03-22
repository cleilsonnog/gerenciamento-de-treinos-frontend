import { cn } from "@/lib/utils";

type ConsistencyDayStatus = "completed" | "started" | "empty";

type ConsistencyDayProps = {
  label: string;
  status: ConsistencyDayStatus;
};

export function ConsistencyDay({ label, status }: ConsistencyDayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "h-5 w-5 rounded-[6px]",
          status === "completed" && "bg-primary",
          status === "started" && "bg-primary/30",
          status === "empty" && "border border-border"
        )}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
