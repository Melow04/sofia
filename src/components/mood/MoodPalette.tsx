"use client";

import { MOOD_OPTIONS } from "@/lib/moods";
import type { MoodOption } from "@/types/calendar";
import { useCalendarStore } from "@/store/calendar-store";
import { useState, useEffect } from "react";

type MoodPaletteProps = {
  activeDayIso?: string;
  activeMoods?: MoodOption[];
};

export function MoodPalette({ activeDayIso, activeMoods = [] }: MoodPaletteProps) {
  const setMood = useCalendarStore((state) => state.setMood);
  const [selectedMoods, setSelectedMoods] = useState<MoodOption[]>(activeMoods);

  useEffect(() => {
    setSelectedMoods(activeMoods);
  }, [activeMoods]);

  const toggleMood = (mood: MoodOption) => {
    if (!activeDayIso) return;
    
    const isSelected = selectedMoods.some((m) => m.id === mood.id);
    const newMoods = isSelected
      ? selectedMoods.filter((m) => m.id !== mood.id)
      : [...selectedMoods, mood];
    
    setSelectedMoods(newMoods);
    setMood(activeDayIso, newMoods);
  };

  const clearMoods = () => {
    if (!activeDayIso) return;
    setSelectedMoods([]);
    setMood(activeDayIso, []);
  };

  return (
    <section className="rounded-3xl border border-base-200/60 bg-base-100/80 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary flex items-center gap-2">
            <span>🎨</span> Mood Selector
          </p>
          <p className="text-xs text-base-content/60">
            Select multiple moods for gradient blending ✨
          </p>
        </div>
        <button
          className="btn btn-ghost btn-xs rounded-full"
          disabled={!activeDayIso || selectedMoods.length === 0}
          onClick={clearMoods}
        >
          Clear
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {MOOD_OPTIONS.map((option) => {
          const selected = selectedMoods.some((m) => m.id === option.id);
          return (
            <button
              key={option.id}
              className="relative flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition hover:scale-105"
              style={{
                backgroundColor: selected ? `${option.color}33` : "transparent",
                borderColor: selected ? option.color : "currentColor",
                color: selected ? option.color : "inherit",
              }}
              disabled={!activeDayIso}
              onClick={() => toggleMood(option)}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: option.color }}
              />
              <span>{option.label}</span>
              {selected && (
                <span className="badge badge-xs ml-auto">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {!activeDayIso && (
        <p className="mt-4 text-xs text-base-content/60">
          Select a day to choose moods and create beautiful gradients.
        </p>
      )}
    </section>
  );
}

