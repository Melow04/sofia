import { create } from "zustand";
import type { CalendarDay, DayNote, MoodOption } from "@/types/calendar";
import { generateCalendarDays, getMonthKey } from "@/lib/calendar";

type CalendarStore = {
  activeMonth: Date;
  daysMap: Record<string, CalendarDay[]>;
  dayModalOpen: boolean;
  noteDrawerOpen: boolean;
  selectedDayIso?: string;
  selectedNote?: { dayIso: string; noteId: string };
  setMonth: (date: Date) => void;
  loadMonth: (date?: Date) => Promise<void>;
  getDays: () => CalendarDay[];
  selectDay: (dayIso: string) => void;
  openDayModal: (dayIso: string) => void;
  closeDayModal: () => void;
  openNoteDrawer: (dayIso: string, noteId: string) => void;
  closeNoteDrawer: () => void;
  upsertNote: (dayIso: string, note: DayNote) => void;
  deleteNote: (dayIso: string, noteId: string) => void;
  setMood: (dayIso: string, moods: MoodOption[]) => void;
  moveNote: (noteId: string, sourceIso: string, targetIso: string) => void;
};

const seedDate = new Date();
const seedKey = getMonthKey(seedDate);

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  activeMonth: seedDate,
  daysMap: {},
  dayModalOpen: false,
  noteDrawerOpen: false,
  selectedDayIso: undefined,
  selectedNote: undefined,
  setMonth: (date) => {
    const key = getMonthKey(date);
    set({ activeMonth: date });
  },
  loadMonth: async (date) => {
    const target = date ?? get().activeMonth;
    const key = getMonthKey(target);
    
    // Don't reload if already loaded
    if (get().daysMap[key]) {
      return;
    }
    
    try {
      const res = await fetch(`/api/days?month=${key}`);
      const json = await res.json();
      const rawDays = json.days ?? [];
      // Hydrate Date objects from ISO strings
      const days: CalendarDay[] = rawDays.map((day: any) => ({
        ...day,
        date: new Date(day.date),
      }));
      set((state) => ({
        daysMap: { ...state.daysMap, [key]: days },
      }));
    } catch {
      // Fallback to generated days if API fails
      const days = generateCalendarDays(target);
      set((state) => ({
        daysMap: { ...state.daysMap, [key]: days },
      }));
    }
  },
  getDays: () => {
    const state = get();
    const key = getMonthKey(state.activeMonth);
    return state.daysMap[key] ?? [];
  },
  selectDay: (dayIso) =>
    set({
      selectedDayIso: dayIso,
    }),
  openDayModal: (dayIso) =>
    set({
      selectedDayIso: dayIso,
      dayModalOpen: true,
    }),
  closeDayModal: () =>
    set({
      dayModalOpen: false,
      selectedDayIso: undefined,
    }),
  openNoteDrawer: (dayIso, noteId) =>
    set({
      noteDrawerOpen: true,
      selectedNote: { dayIso, noteId },
      selectedDayIso: dayIso,
    }),
  closeNoteDrawer: () =>
    set({
      noteDrawerOpen: false,
      selectedNote: undefined,
    }),
  upsertNote: (dayIso, note) =>
    set((state) => {
      const key = getMonthKey(state.activeMonth);
      const days = state.daysMap[key];
      if (!days) return state;
      const nextDays = days.map((day) => {
        if (day.iso !== dayIso) return day;
        const nextNotes = day.notes.some((n) => n.id === note.id)
          ? day.notes.map((n) => (n.id === note.id ? note : n))
          : [...day.notes, note];
        return { ...day, notes: nextNotes };
      });

      // persist
      void fetch(`/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayIso, note }),
      }).catch(() => {});

      return {
        daysMap: {
          ...state.daysMap,
          [key]: nextDays,
        },
      };
    }),
  deleteNote: (dayIso, noteId) =>
    set((state) => {
      const key = getMonthKey(state.activeMonth);
      const days = state.daysMap[key];
      if (!days) return state;
      
      const nextDays = days.map((day) => {
        if (day.iso !== dayIso) return day;
        return {
          ...day,
          notes: day.notes.filter((n) => n.id !== noteId),
        };
      });

      // persist deletion
      void fetch(`/api/notes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayIso, noteId }),
      }).catch(() => {});

      return {
        daysMap: {
          ...state.daysMap,
          [key]: nextDays,
        },
      };
    }),
  setMood: (dayIso, moods) =>
    set((state) => {
      const key = getMonthKey(state.activeMonth);
      const days = state.daysMap[key];
      if (!days) return state;
      // persist
      void fetch(`/api/mood`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayIso, moods }),
      }).catch(() => {});

      return {
        daysMap: {
          ...state.daysMap,
          [key]: days.map((day) =>
            day.iso === dayIso ? { ...day, moods } : day,
          ),
        },
      };
    }),
  moveNote: (noteId, sourceIso, targetIso) =>
    set((state) => {
      const key = getMonthKey(state.activeMonth);
      const days = state.daysMap[key];
      if (!days) return state;

      const sourceDay = days.find((day) => day.iso === sourceIso);
      const targetDay = days.find((day) => day.iso === targetIso);
      if (!sourceDay || !targetDay) return state;

      const note = sourceDay.notes.find((n) => n.id === noteId);
      if (!note) return state;

      const updatedDays = days.map((day) => {
        if (day.iso === sourceIso) {
          return {
            ...day,
            notes: day.notes.filter((n) => n.id !== noteId),
          };
        }
        if (day.iso === targetIso) {
          return {
            ...day,
            notes: [...day.notes, { ...note }],
          };
        }
        return day;
      });

      return {
        daysMap: {
          ...state.daysMap,
          [key]: updatedDays,
        },
      };
    }),
}));

export const getSelectedDay = (state: CalendarStore) => {
  const dayIso = state.selectedDayIso;
  if (!dayIso) return undefined;
  const key = getMonthKey(state.activeMonth);
  const days = state.daysMap[key];
  if (!days) return undefined;
  return days.find((day) => day.iso === dayIso);
};

export const getSelectedNote = (state: CalendarStore) => {
  const selection = state.selectedNote;
  if (!selection) return undefined;
  const key = getMonthKey(state.activeMonth);
  const days = state.daysMap[key];
  if (!days) return undefined;
  const day = days.find((d) => d.iso === selection.dayIso);
  if (!day) return undefined;
  return day.notes.find((note) => note.id === selection.noteId);
};

