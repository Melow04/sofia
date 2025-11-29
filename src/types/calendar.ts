export type NoteType = "text" | "task" | "event";

export type TaskStatus = "completed" | "pending" | "reminder";

export type MoodType =
  | "happy"
  | "sad"
  | "productive"
  | "confused"
  | "mad";

export interface MoodOption {
  id: MoodType;
  label: string;
  color: string;
}

export interface DayNote {
  id: string;
  title: string;
  type: NoteType;
  body?: string;
  status?: TaskStatus;
  tags?: string[];
}

export interface CalendarDay {
  iso: string;
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  notes: DayNote[];
  moods: MoodOption[];
}

