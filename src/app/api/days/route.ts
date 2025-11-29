import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateCalendarDays } from "@/lib/calendar";

const getClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const monthParam = searchParams.get("month"); // YYYY-MM
  const baseDate = monthParam ? new Date(`${monthParam}-01`) : new Date();

  // Fallback: generate in-memory days if Supabase not configured
  const supabase = getClient();
  if (!supabase) {
    const days = generateCalendarDays(baseDate);
    return NextResponse.json({ source: "memory", days });
  }

  // Fetch persisted days from Supabase and merge with generated calendar
  const { data: persistedDays, error } = await supabase
    .from("days")
    .select("iso,notes,mood")
    .gte("iso", new Date(baseDate.getFullYear(), baseDate.getMonth(), 1).toISOString().split("T")[0])
    .lte("iso", new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).toISOString().split("T")[0]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Generate full calendar grid
  const generatedDays = generateCalendarDays(baseDate);
  
  // Merge persisted data into generated days
  const persistedMap = new Map(
    (persistedDays ?? []).map((d: any) => [d.iso, d])
  );
  
  const mergedDays = generatedDays.map((day) => {
    const persisted = persistedMap.get(day.iso);
    if (persisted) {
      return {
        ...day,
        notes: persisted.notes ?? [],
        moods: Array.isArray(persisted.mood) ? persisted.mood : (persisted.mood ? [persisted.mood] : []),
      };
    }
    return day;
  });

  return NextResponse.json({ source: "supabase", days: mergedDays });
}
