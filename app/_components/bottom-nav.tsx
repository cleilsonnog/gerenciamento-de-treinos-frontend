"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ChartNoAxesColumn,
  House,
  Sparkles,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around bg-background px-6 pb-safe pt-5 h-[88px]">
      <Link
        href="/"
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          pathname === "/" && "text-primary"
        )}
      >
        <House size={24} />
      </Link>
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center rounded-full text-foreground"
      >
        <Calendar size={24} />
      </button>
      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Sparkles size={24} />
      </button>
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center rounded-full text-foreground"
      >
        <ChartNoAxesColumn size={24} />
      </button>
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center rounded-full text-foreground"
      >
        <UserRound size={24} />
      </button>
    </nav>
  );
}
