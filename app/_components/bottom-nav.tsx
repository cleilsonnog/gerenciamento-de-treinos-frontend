"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";
import {
  Calendar,
  ChartNoAxesColumn,
  House,
  Sparkles,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetHome } from "@/lib/api/rc-generated";
import { useChatState } from "./chat/use-chat-state";

export function BottomNav() {
  const pathname = usePathname();
  const isCalendarActive = pathname.startsWith("/workout-plans");
  const { openChat } = useChatState();
  const today = dayjs().format("YYYY-MM-DD");
  const { data } = useGetHome(today, undefined, {
    query: { staleTime: 1000 * 60 * 5 },
  });
  const activeWorkoutPlanId =
    data?.status === 200 ? data.data.activeWorkoutPlanId : undefined;
  const calendarHref = activeWorkoutPlanId
    ? `/workout-plans/${activeWorkoutPlanId}`
    : undefined;

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
      {calendarHref ? (
        <Link
          href={calendarHref}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-foreground",
            isCalendarActive && "text-primary"
          )}
        >
          <Calendar size={24} />
        </Link>
      ) : (
        <button
          type="button"
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-foreground",
            isCalendarActive && "text-primary"
          )}
        >
          <Calendar size={24} />
        </button>
      )}
      <button
        type="button"
        onClick={() => openChat()}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Sparkles size={24} />
      </button>
      <Link
        href="/stats"
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full text-foreground",
          pathname === "/stats" && "text-primary"
        )}
      >
        <ChartNoAxesColumn size={24} />
      </Link>
      <Link
        href="/profile"
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full text-foreground",
          pathname === "/profile" && "text-primary"
        )}
      >
        <UserRound size={24} />
      </Link>
    </nav>
  );
}
