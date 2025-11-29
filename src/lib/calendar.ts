import type { CalendarDay } from "@/types/calendar";

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const generateCalendarDays = (reference: Date): CalendarDay[] => {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const offset = firstDayOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - offset);

  const days: CalendarDay[] = [];

  for (let i = 0; i < 42; i++) {
    const current = new Date(gridStart);
    current.setDate(gridStart.getDate() + i);
    const iso = current.toISOString().split("T")[0];

    const isCurrentMonth = current.getMonth() === month;
    const isToday =
      iso === new Date().toISOString().split("T")[0] && isCurrentMonth;

    days.push({
      iso,
      date: current,
      day: current.getDate(),
      isCurrentMonth,
      isToday,
      // No mock/example notes. Seeds or persisted data will populate.
      notes: [],
      // Keep moods empty by default; user selection will set.
      moods: [],
    });
  }

  return days;
};

