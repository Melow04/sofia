"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import { CalendarGrid } from "./CalendarGrid";
import type { CalendarDay } from "@/types/calendar";
import { useCalendarStore } from "@/store/calendar-store";
import { getMonthKey, generateCalendarDays } from "@/lib/calendar";
import { DayComposerModal } from "../modals/day-composer-modal";
import { NoteDrawer } from "../modals/note-drawer";
import { NoteChip } from "./NoteChip";
import { MoodPalette } from "../mood/MoodPalette";
import { ThemeToggle } from "../layout/theme-toggle";
import clsx from "clsx";
// Seeds removed: calendar now shows only persisted/user-created data.

const MONTH_FORMAT: Intl.DateTimeFormatOptions = {
  month: "long",
  year: "numeric",
};

export function CalendarBoard() {
  const [dragMeta, setDragMeta] = useState<{
    noteId: string;
    dayIso: string;
  } | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
  );

  const activeMonth = useCalendarStore((state) => state.activeMonth);
  const daysMap = useCalendarStore((state) => state.daysMap);
  const setMonth = useCalendarStore((state) => state.setMonth);
  const dayModalOpen = useCalendarStore((state) => state.dayModalOpen);
  const noteDrawerOpen = useCalendarStore((state) => state.noteDrawerOpen);
  const selectDay = useCalendarStore((state) => state.selectDay);
  const selectedDayIso = useCalendarStore((state) => state.selectedDayIso);
  const openDayModal = useCalendarStore((state) => state.openDayModal);
  const closeDayModal = useCalendarStore((state) => state.closeDayModal);
  const openNoteDrawer = useCalendarStore((state) => state.openNoteDrawer);
  const closeNoteDrawer = useCalendarStore((state) => state.closeNoteDrawer);
  const moveNote = useCalendarStore((state) => state.moveNote);
  const upsertNote = useCalendarStore((state) => state.upsertNote);
  const deleteNote = useCalendarStore((state) => state.deleteNote);

  const days = useMemo(() => {
    const key = getMonthKey(activeMonth);
    return daysMap[key] ?? [];
  }, [activeMonth, daysMap]);

  const selectedDay = useCalendarStore((state) => {
    const dayIso = state.selectedDayIso;
    if (!dayIso) return undefined;
    const key = getMonthKey(state.activeMonth);
    const days = state.daysMap[key];
    if (!days) return undefined;
    return days.find((day) => day.iso === dayIso);
  });

  const selectedNote = useCalendarStore((state) => {
    const selection = state.selectedNote;
    if (!selection) return undefined;
    const key = getMonthKey(state.activeMonth);
    const days = state.daysMap[key];
    if (!days) return undefined;
    const day = days.find((d) => d.iso === selection.dayIso);
    if (!day) return undefined;
    return day.notes.find((note) => note.id === selection.noteId);
  });

  const summary = useMemo(() => {
    const notes = days.reduce((acc, day) => acc + day.notes.length, 0);
    const moods = days.filter((day) => day.moods && day.moods.length > 0).length;
    return { notes, moods };
  }, [days]);

  const handleDragStart = (event: DragStartEvent) => {
    const noteId = event.active.data.current?.noteId as string | undefined;
    const dayIso = event.active.data.current?.dayIso as string | undefined;
    if (noteId && dayIso) {
      setDragMeta({ noteId, dayIso });
    }
  };

  const draggingNote = useMemo(() => {
    if (!dragMeta) return undefined;
    const day = days.find((d) => d.iso === dragMeta.dayIso);
    return day?.notes.find((note) => note.id === dragMeta.noteId);
  }, [days, dragMeta]);

  const handleDragEnd = (event: DragEndEvent) => {
    const noteId = event.active.data.current?.noteId as string | undefined;
    const fromIso = event.active.data.current?.dayIso as string | undefined;
    const toIso = (event.over?.data.current as { dayIso?: string } | undefined)
      ?.dayIso;

    if (noteId && fromIso && toIso && toIso !== fromIso) {
      moveNote(noteId, fromIso, toIso);
    }
    setDragMeta(null);
  };

  const handlePrevMonth = () => {
    const next = new Date(activeMonth);
    next.setMonth(activeMonth.getMonth() - 1);
    setMonth(next);
  };

  const handleNextMonth = () => {
    const next = new Date(activeMonth);
    next.setMonth(activeMonth.getMonth() + 1);
    setMonth(next);
  };

  const defaultDayIso =
    selectedDay?.iso ??
    days.find((d) => d.isToday)?.iso ??
    days[0]?.iso ??
    dragMeta?.dayIso;

  // Load days from backend when component mounts and when month changes
  useEffect(() => {
    const key = getMonthKey(activeMonth);
    const loadData = async () => {
      try {
        const res = await fetch(`/api/days?month=${key}`);
        const json = await res.json();
        const rawDays = json.days ?? [];
        const days = rawDays.map((day: any) => ({
          ...day,
          date: new Date(day.date),
        }));
        const merged = days;
        useCalendarStore.setState((state) => ({
          daysMap: { ...state.daysMap, [key]: merged },
        }));
      } catch {
        // Fallback to generated days
        const days = generateCalendarDays(activeMonth);
        const merged = days;
        useCalendarStore.setState((state) => ({
          daysMap: { ...state.daysMap, [key]: merged },
        }));
      }
    };
    
    // Only load if not already loaded
    const current = useCalendarStore.getState().daysMap[key];
    if (!current) {
      void loadData();
    }
  }, [activeMonth]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-base-200 bg-base-100 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-secondary">Sofia Studio</p>
            <h1 className="text-2xl font-display font-semibold">
              {activeMonth.toLocaleDateString(undefined, MONTH_FORMAT)}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <button className="btn btn-outline btn-sm rounded-full" onClick={handlePrevMonth}>
              ←
            </button>
            <button className="btn btn-outline btn-sm rounded-full" onClick={handleNextMonth}>
              →
            </button>
            <button
              className="btn btn-primary btn-sm rounded-full px-5"
              onClick={() => selectedDayIso ? openDayModal(selectedDayIso) : (defaultDayIso && openDayModal(defaultDayIso))}
              disabled={!selectedDayIso && !defaultDayIso}
            >
              Add note {selectedDayIso && "to selected day"}
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-base-200 bg-base-100 p-5">
            <div className="flex flex-wrap items-center gap-4 pb-5">
              <div className="flex items-center gap-3 rounded-2xl bg-base-200/50 px-4 py-2 text-sm font-semibold">
                <span className="text-base-content/60">Notes</span>
                <span className="badge badge-primary badge-outline">
                  {summary.notes}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-base-200/40 px-4 py-2 text-sm font-semibold">
                <span className="text-base-content/60">Mood days</span>
                <span className="badge badge-secondary badge-outline">
                  {summary.moods}
                </span>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-1 sm:max-h-none sm:overflow-visible">
              <CalendarGrid
                days={days}
                onDaySelect={selectDay}
                onNoteSelect={openNoteDrawer}
                onDeleteNote={deleteNote}
                onAddNote={openDayModal}
                selectedDayIso={selectedDayIso}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-base-200 bg-base-100 p-5 lg:sticky lg:top-4 h-fit">
            <MoodPalette 
              activeDayIso={selectedDay?.iso}
              activeMoods={selectedDay?.moods}
            />
          </div>
        </section>
      </div>

      <DayComposerModal
        open={dayModalOpen}
        day={
          selectedDay ??
          days.find((day) => day.iso === dragMeta?.dayIso) ??
          days.find((day) => day.iso === defaultDayIso)
        }
        onClose={closeDayModal}
        onSave={(note) => {
          const targetIso =
            selectedDay?.iso ?? dragMeta?.dayIso ?? defaultDayIso;
          if (targetIso) {
            upsertNote(targetIso, note);
          }
        }}
      />

      <NoteDrawer
        open={noteDrawerOpen}
        day={selectedDay}
        note={selectedNote}
        onClose={closeNoteDrawer}
        onSave={(note) => {
          if (selectedDay) {
            upsertNote(selectedDay.iso, note);
          }
        }}
      />

      <DragOverlay>
        {dragMeta && draggingNote ? (
          <NoteChip
            note={draggingNote}
            dayIso={dragMeta.dayIso}
            onClick={() => null}
          />
        ) : null}
      </DragOverlay>

      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition",
          noteDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeNoteDrawer}
      />
    </DndContext>
  );
}

