"use client";

import { useEffect, useState } from "react";
import type { CalendarDay, DayNote, NoteType, TaskStatus } from "@/types/calendar";
import clsx from "clsx";

type DayComposerModalProps = {
  open: boolean;
  day?: CalendarDay;
  onClose: () => void;
  onSave: (note: DayNote) => void;
};

const NOTE_TYPE_OPTIONS: NoteType[] = ["text", "task", "event"];

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

export function DayComposerModal({
  open,
  day,
  onClose,
  onSave,
}: DayComposerModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<NoteType>("text");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");

  useEffect(() => {
    if (open && day) {
      setTitle("");
      setBody("");
      setType("text");
      setStatus("pending");
    }
  }, [open, day]);

  if (!day) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    const note: DayNote = {
      id: createId(),
      title,
      type,
      body,
      tags: body ? body.split(" ").slice(0, 2) : [],
      ...(type === "task" && { status }),
    };
    onSave(note);
    onClose();
  };

  return (
    <dialog className={clsx("modal", { "modal-open": open })}>
      <div className="modal-box max-w-2xl rounded-3xl bg-base-100/95 p-8 text-base-content shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-pink-600 dark:text-pink-400 flex items-center gap-2">
              <span>💌</span> New note
            </p>
            <h3 className="text-2xl font-semibold">
              {day.date.toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
                weekday: "long",
              })}
            </h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="form-control w-full">
            <span className="label-text text-xs uppercase tracking-widest text-base-content/60">
              Title
            </span>
            <input
              type="text"
              className="input input-bordered rounded-2xl border-base-300 bg-base-100"
              placeholder="Today was amazing! ✨"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="form-control">
              <span className="label-text text-xs uppercase tracking-widest text-base-content/60">
                Type
              </span>
              <div className="join">
                {NOTE_TYPE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={clsx(
                      "join-item btn btn-sm capitalize",
                      option === type ? "btn-primary" : "btn-ghost",
                    )}
                    onClick={() => setType(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </label>
          </div>

          {type === "task" && (
            <label className="form-control">
              <span className="label-text text-xs uppercase tracking-widest text-base-content/60">
                Status
              </span>
              <div className="join">
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

          <label className="form-control">
            <span className="label-text text-xs uppercase tracking-widest text-base-content/60">
              Notes & reminders
            </span>
            <textarea
              className="textarea textarea-bordered min-h-[120px] rounded-2xl border-base-300 bg-base-100"
              placeholder="Write about your day, your feelings, or anything that made you smile! 💕"
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </label>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary rounded-full px-6 bg-gradient-to-r from-pink-500 to-purple-500 border-0 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-pink-500/30">
              Save note 💖
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

