import type { DayNote } from "@/types/calendar";

const note = (title: string): DayNote => ({ id: `n-${Math.random().toString(36).slice(2,10)}`, title, type: "task", status: "pending" });

export const DECEMBER_2025_NOTES: Record<string, DayNote[]> = {
  "2025-12-01": [note("Micropara Lec Midterm Exam"), note("Filipino Psy Review")],
  "2025-12-02": [note("Order Gifts")],
  "2025-12-03": [note("Filipino Psy Review"), note("Filipino Psy Midterm Exam")],
  "2025-12-04": [note("Micropara Lab Supple Act Internal Deadline"), note("Field Methods Data Gathering")],
  "2025-12-05": [note("Abnormal Psy Proofread"), note("Psy Powerpoint Content")],
  "2025-12-06": [note("Abnormal Psy Class"), note("Abnormal Psy Powerpoint"), note("Micropara Lab Supple Act Format")],
  "2025-12-09": [note("Abnormal Psy Quiz")],
  "2025-12-10": [note("Hazie Play")],
  "2025-12-12": [note("❤️ Anniversary"), note("Abnormal Psy Dry Run")],
  "2025-12-13": [note("Abnormal Psy Reporting"), note("High School Friends Christmas Party")],
  "2025-12-23": [note("Micropara Lec Introduction")],
  "2025-12-27": [note("Birthday")],
  "2025-12-28": [note("Micropara Lec Powerpoint Content"), note("Micropara Lec Script"), note("College Friends Christmas Party")],
};
