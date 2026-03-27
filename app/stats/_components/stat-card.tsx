import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 px-4 py-5">
      <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-primary/8">
        <Icon size={16} className="text-primary" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
