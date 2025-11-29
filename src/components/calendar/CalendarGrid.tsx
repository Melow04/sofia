"use client";

import { WEEKDAY_LABELS } from "@/lib/calendar";
import type { CalendarDay } from "@/types/calendar";
import { DayCard } from "./DayCard";

type CalendarGridProps = {
  days: CalendarDay[];
  onDaySelect: (dayIso: string) => void;
  onNoteSelect: (dayIso: string, noteId: string) => void;
  onDeleteNote: (dayIso: string, noteId: string) => void;
  onAddNote: (dayIso: string) => void;
  selectedDayIso?: string;
};

export function CalendarGrid({
  days,
  onDaySelect,
  onNoteSelect,
  onDeleteNote,
  onAddNote,
  selectedDayIso,
}: CalendarGridProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2 text-xs font-semibold uppercase tracking-widest text-base-content/60">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="text-center">
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 lg:auto-rows-[280px]">
        {days.map((day) => (
          <DayCard
            key={day.iso}
            day={day}
            isSelected={selectedDayIso === day.iso}
            onSelect={() => onDaySelect(day.iso)}
            onNoteSelect={(noteId) => onNoteSelect(day.iso, noteId)}
            onDeleteNote={(noteId) => onDeleteNote(day.iso, noteId)}
            onAddNote={() => onAddNote(day.iso)}
          />
        ))}
      </div>
    </div>
  );
}

