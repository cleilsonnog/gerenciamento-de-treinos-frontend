import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import type { GetStats200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

type ConsistencyHeatmapProps = {
  consistencyByDay: GetStats200ConsistencyByDay;
};

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

type WeekColumn = {
  dates: (string | null)[];
};

type MonthGroup = {
  label: string;
  weeks: WeekColumn[];
};

function buildHeatmapData(today: dayjs.Dayjs): MonthGroup[] {
  const currentMonth = today.startOf("month");
  const startMonth = currentMonth.subtract(2, "month");
  const endOfCurrentMonth = currentMonth.endOf("month");

  const startDate = startMonth.startOf("month");
  const startMonday = startDate.day() === 1
    ? startDate
    : startDate.day() === 0
      ? startDate.subtract(6, "day")
      : startDate.subtract(startDate.day() - 1, "day");

  const endDate = endOfCurrentMonth;
  const endSunday = endDate.day() === 0
    ? endDate
    : endDate.add(7 - endDate.day(), "day");

  const weeks: { monday: dayjs.Dayjs; dates: string[] }[] = [];
  let current = startMonday;

  while (current.isBefore(endSunday) || current.isSame(endSunday, "day")) {
    const weekDates: string[] = [];
    for (let d = 0; d < 7; d++) {
      weekDates.push(current.add(d, "day").format("YYYY-MM-DD"));
    }
    weeks.push({ monday: current, dates: weekDates });
    current = current.add(7, "day");
  }

  const months: MonthGroup[] = [];

  for (let m = 0; m < 3; m++) {
    const month = startMonth.add(m, "month");
    const monthIndex = month.month();
    const monthYear = month.year();

    const monthWeeks = weeks
      .filter((week) => {
        return week.dates.some((date) => {
          const d = dayjs(date);
          return d.month() === monthIndex && d.year() === monthYear;
        });
      })
      .map((week) => ({
        dates: week.dates.map((date) => {
          const d = dayjs(date);
          if (d.month() === monthIndex && d.year() === monthYear) {
            return date;
          }
          return null;
        }),
      }));

    months.push({
      label: MONTH_LABELS[monthIndex],
      weeks: monthWeeks,
    });
  }

  return months;
}

export function ConsistencyHeatmap({
  consistencyByDay,
}: ConsistencyHeatmapProps) {
  const today = dayjs();
  const months = buildHeatmapData(today);

  return (
    <div className="flex gap-4 overflow-x-auto rounded-xl border border-border px-5 py-5">
      {months.map((month) => (
        <div key={month.label} className="flex shrink-0 flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">{month.label}</span>
          <div className="flex gap-1">
            {month.weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.dates.map((date, dayIdx) => {
                  if (date === null) {
                    return (
                      <div key={dayIdx} className="h-5 w-5" />
                    );
                  }

                  const consistency = consistencyByDay[date];
                  const isCompleted = consistency?.workoutDayCompleted;
                  const isStarted = consistency?.workoutDayStarted;

                  return (
                    <div
                      key={dayIdx}
                      className={cn(
                        "h-5 w-5 rounded-[4px]",
                        isCompleted
                          ? "bg-primary"
                          : isStarted
                            ? "bg-primary/30"
                            : "border border-border"
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
