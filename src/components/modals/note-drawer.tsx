"use client";

import { useEffect, useState } from "react";
import type { CalendarDay, DayNote, TaskStatus } from "@/types/calendar";
import clsx from "clsx";

type NoteDrawerProps = {
  open: boolean;
  day?: CalendarDay;
  note?: DayNote;
  onClose: () => void;
  onSave: (note: DayNote) => void;
};

export function NoteDrawer({
  open,
  day,
  note,
  onClose,
  onSave,
}: NoteDrawerProps) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [status, setStatus] = useState<TaskStatus | undefined>(note?.status);

  useEffect(() => {
    setTitle(note?.title ?? "");
    setBody(note?.body ?? "");
    setStatus(note?.status);
  }, [note, open]);

  if (!note || !day) return null;

  const handleSave = () => {
    const updatedNote: DayNote = {
      ...note,
      title,
      body,
      ...(note.type === "task" && status && { status }),
    };
    onSave(updatedNote);
    onClose();
  };

  return (
    <div
      className={clsx(
        "fixed inset-y-0 right-0 z-50 w-full max-w-md transform border-l border-base-300/60 bg-base-100/95 shadow-2xl backdrop-blur transition duration-300",
        open ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-pink-600 dark:text-pink-400 flex items-center gap-2">
              <span>💌</span> Note detail
            </p>
            <h3 className="text-lg font-semibold">
              {day.date.toLocaleDateString(undefined, {
                weekday: "short",
                month: "long",
                day: "numeric",
              })}
            </h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="divider my-4" />

        <label className="form-control">
          <span className="label-text text-xs uppercase tracking-widest text-base-content/60">
            Title
          </span>
          <input
            className="input input-bordered rounded-2xl border-base-200 bg-base-100"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        {note.type === "task" && (
          <label className="form-control mt-4">
            <span className="label-text text-xs uppercase tracking-widest text-base-content/60">
              Status
            </span>
            <div className="join mt-2">
              <button
                type="button"
                className={clsx(
                  "join-item btn btn-sm capitalize",
                  status === "completed" ? "btn-success" : "btn-ghost",
                )}
                onClick={() => setStatus("completed")}
              >
                ✓ Completed
              </button>
              <button
                type="button"
                className={clsx(
                  "join-item btn btn-sm capitalize",
                  status === "pending" ? "btn-error" : "btn-ghost",
                )}
                onClick={() => setStatus("pending")}
              >
                ○ Pending
              </button>
              <button
                type="button"
                className={clsx(
                  "join-item btn btn-sm capitalize",
                  status === "reminder" ? "btn-info" : "btn-ghost",
                )}
                onClick={() => setStatus("reminder")}
              >
                ⏰ Reminder
              </button>
            </div>
          </label>
        )}

        <label className="form-control mt-4 flex-1">
          <span className="label-text text-xs uppercase tracking-widest text-base-content/60">
            Description
          </span>
          <textarea
            className="textarea textarea-bordered min-h-[180px] flex-1 rounded-2xl border-base-200 bg-base-100"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </label>

        <div className="mt-4 rounded-2xl border border-dashed border-base-300/60 p-4 text-xs text-base-content/70">
          <p className="font-semibold uppercase tracking-widest">
            Quick tags
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Energy", "Deep work", "Recharge"].map((tag) => (
              <span
                key={tag}
                className="badge badge-outline badge-sm rounded-full px-3"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="btn btn-ghost rounded-full px-5" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary rounded-full px-6 bg-gradient-to-r from-pink-500 to-purple-500 border-0 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-pink-500/30"
            onClick={handleSave}
          >
            Save changes 💖
          </button>
        </div>
      </div>
    </div>
  );
}

