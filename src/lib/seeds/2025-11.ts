import type { DayNote } from "@/types/calendar";

// Helper to create a simple text note
const note = (title: string): DayNote => ({ id: `n-${Math.random().toString(36).slice(2,10)}`, title, type: "task", status: "pending" });

// Map of ISO dates to notes list
export const NOVEMBER_2025_NOTES: Record<string, DayNote[]> = {
  "2025-11-01": [note("Chelsie Birthday Video")],
  "2025-11-02": [note("Certificate of Validation")],
  "2025-11-03": [note("Dreite")],
  "2025-11-04": [note("Micropara Lec Winogradsky")],
  "2025-11-05": [note("Abnormal Psy Readings"), note("SHRD Review")],
  "2025-11-06": [note("Abnormal Psy Readings"), note("SHRD Review")],
  "2025-11-07": [note("Abnormal Psy Readings"), note("SHRD Review")],
  "2025-11-08": [note("Abnormal Psy OLC"), note("SHRD OLC"), note("SHRD Review")],
  "2025-11-09": [note("SHRD Review")],
  "2025-11-10": [note("UREC Deficit Files"), note("SHRD Review"), note("Abnormal Psy Readings")],
  "2025-11-11": [note("Abnormal Psy Readings"), note("SHRD Review")],
  "2025-11-12": [note("❤️"), note("SHRD Review")],
  "2025-11-13": [note("SHRD Midterm Exam"), note("Dreite")],
  "2025-11-14": [note("Abnormal Psy Readings"), note("Order Costume of Sabina")],
  "2025-11-15": [note("Abnormal Psy OLC"), note("Social Psy Review")],
  "2025-11-16": [note("Social Psy Review")],
  "2025-11-17": [note("Field Methods Group Meeting"), note("Micropara Lec Activity 2"), note("Social Psy Review")],
  "2025-11-18": [note("Social Psy Review")],
  "2025-11-19": [note("Social Psy Midterm Exam"), note("Abnormal Psy Readings")],
  "2025-11-20": [note("Abnormal Psy Readings")],
  "2025-11-21": [note("Abnormal Psy Readings")],
  "2025-11-22": [note("Abnormal Psy OLC"), note("SHRD OLC"), note("Micropara Lec Review")],
  "2025-11-23": [note("Micropara Lec Review")],
  "2025-11-24": [note("Micropara Lab Activity"), note("Micropara Lec Review")],
  "2025-11-25": [note("Abnormal Psy Readings"), note("Micropara Lec Review")],
  "2025-11-26": [note("Abnormal Psy Readings"), note("Micropara Lec Review"), note("Field Methods Group")],
  // 27 blank/no tasks
  "2025-11-28": [note("Micropara Lec Review"), note("Abnormal Psy Readings")],
  "2025-11-29": [note("Abnormal Psy OLC"), note("SHRD OLC"), note("Lab Report 1 Internal Deadline"), note("Proofread")],
};
