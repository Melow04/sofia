import type { DayNote } from "@/types/calendar";

const note = (title: string): DayNote => ({ id: `n-${Math.random().toString(36).slice(2,10)}`, title, type: "task", status: "pending" });

export const JANUARY_2026_NOTES: Record<string, DayNote[]> = {
  "2026-01-04": [note("Micropara Lec Powerpoint")],
  "2026-01-05": [note("Micropara Lec Dry Run")],
  "2026-01-06": [note("Micropara Lec Recording")],
  "2026-01-17": [note("Abnormal Psy Details")],
};
