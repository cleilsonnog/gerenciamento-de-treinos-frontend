import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  value: string;
  unit: string;
};

export function StatCard({ icon: Icon, value, unit }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center gap-5 rounded-xl bg-primary/8 px-4 py-5">
      <div className="flex size-[34px] items-center justify-center rounded-full bg-primary/8">
        <Icon size={16} className="text-primary" />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
