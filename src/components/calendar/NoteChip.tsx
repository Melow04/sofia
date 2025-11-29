"use client";

import { useDraggable } from "@dnd-kit/core";
import type { DayNote } from "@/types/calendar";
import clsx from "clsx";
import { X } from "lucide-react";

type NoteChipProps = {
  note: DayNote;
  dayIso: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function NoteChip({ note, dayIso, onClick, onDelete }: NoteChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${dayIso}-${note.id}`,
      data: { dayIso, noteId: note.id },
    });

  const getStatusColor = () => {
    if (note.type !== "task") return "bg-base-100 border-base-300";
    switch (note.status) {
      case "completed":
        return "bg-success/10 border-success/40";
      case "pending":
        return "bg-error/10 border-error/40";
      case "reminder":
        return "bg-info/10 border-info/40";
      default:
        return "bg-base-100 border-base-300";
    }
  };

  const getStatusIndicator = () => {
    if (note.type !== "task" || !note.status) return null;
    const colors = {
      completed: "bg-success",
      pending: "bg-error",
      reminder: "bg-info",
    };
    return (
      <span
        className={clsx("w-2 h-2 rounded-full", colors[note.status])}
        title={note.status}
      />
    );
  };

  const typeBadge = (
    <span className={clsx(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
      note.type === "task" && "bg-success/10 text-success",
      note.type === "event" && "bg-info/10 text-info",
      note.type === "text" && "bg-base-200 text-base-content/70",
    )}>
      {note.type}
    </span>
  );

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "group relative w-full rounded-lg border px-4 py-3 text-left transition-all",
        "hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
        getStatusColor(),
        {
          "opacity-70": isDragging,
        },
      )}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {getStatusIndicator()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {typeBadge}
              {note.tags && note.tags.length > 0 && (
                <span className="text-[10px] uppercase tracking-widest opacity-60">{note.tags[0]}</span>
              )}
            </div>
            <p className="text-base font-semibold leading-snug break-normal whitespace-normal hyphens-none">
              {note.title}
            </p>
            {note.body && (
              <p className="mt-1 text-sm text-base-content/70 whitespace-normal break-normal hyphens-none">
                {note.body}
              </p>
            )}
          </div>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity btn btn-ghost btn-xs btn-circle text-error hover:bg-error/20"
            title="Delete"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      {note.tags && note.tags.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-1 text-[10px] font-medium uppercase">
          {note.tags.slice(1).map((tag) => (
            <span key={tag} className="rounded-full bg-base-200 px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

