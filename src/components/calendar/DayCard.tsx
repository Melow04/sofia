"use client";

import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import type { CalendarDay } from "@/types/calendar";
import { NoteChip } from "./NoteChip";

type DayCardProps = {
  day: CalendarDay;
  isSelected: boolean;
  onSelect: () => void;
  onNoteSelect: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onAddNote: () => void;
};

export function DayCard({ day, isSelected, onSelect, onNoteSelect, onDeleteNote, onAddNote }: DayCardProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: day.iso,
    data: { dayIso: day.iso },
  });

  // Generate gradient from multiple moods
  const getMoodGradient = () => {
    if (!day.moods || day.moods.length === 0) return "bg-base-100";
    if (day.moods.length === 1) {
      return `bg-[${day.moods[0].color}]/20`;
    }
    const colors = day.moods.map((m) => m.color).join(", ");
    return `bg-gradient-to-br from-[${day.moods[0].color}]/20 to-[${day.moods[day.moods.length - 1].color}]/20`;
  };

  const background = day.moods && day.moods.length > 0
    ? getMoodGradient()
    : "bg-base-100";

  return (
    <article
      ref={setNodeRef}
      className={clsx(
        "group relative flex flex-col rounded-xl border p-4",
        "cursor-pointer transition-all",
        background,
        {
          "opacity-30": !day.isCurrentMonth,
          "ring-2 ring-primary/40": isOver,
          "ring-2 ring-primary border-primary shadow-lg": isSelected,
          "border-base-200": !isSelected,
        },
      )}
      onClick={onSelect}
      style={
        day.moods && day.moods.length > 1
          ? {
              background: `linear-gradient(135deg, ${day.moods.map((m, i) => `${m.color}33 ${(i * 100) / (day.moods.length - 1)}%`).join(", ")})`,
            }
          : day.moods && day.moods.length === 1
            ? { backgroundColor: `${day.moods[0].color}33` }
            : undefined
      }
    >
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm font-semibold tracking-wide">
          {day.date.toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
        <div className="flex items-center gap-2">
          {day.isToday && (
            <span className="badge badge-sm badge-primary text-xs">Today</span>
          )}
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddNote();
              }}
              className="btn btn-xs btn-primary btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
              title="Add note"
            >
              +
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {day.notes.length === 0 && (
          <div className="rounded-lg border border-dashed border-base-300 p-3 text-xs text-base-content/50">
            No notes
          </div>
        )}
        <div className="max-h-56 sm:max-h-64 overflow-y-auto pr-1">
          {day.notes.map((note) => (
            <NoteChip
              key={note.id}
              note={note}
              dayIso={day.iso}
              onClick={(event) => {
                event.stopPropagation();
                onNoteSelect(note.id);
              }}
              onDelete={(event) => {
                event.stopPropagation();
                onDeleteNote(note.id);
              }}
            />
          ))}
        </div>
      </div>

      {day.moods && day.moods.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {day.moods.map((mood) => (
            <span
              key={mood.id}
              className="badge badge-sm text-xs font-medium"
              style={{
                backgroundColor: `${mood.color}44`,
                borderColor: mood.color,
                color: mood.color,
              }}
            >
              {mood.label}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

