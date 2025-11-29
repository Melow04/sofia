import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

export async function POST(request: Request) {
  const supabase = getClient();
  const payload = await request.json();
  // { dayIso: string, note: { id, title, type, body?, color, tags? } }
  if (!payload?.dayIso || !payload?.note) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!supabase) {
    // No persistence configured
    return NextResponse.json({ ok: false, reason: "Supabase not configured" }, { status: 501 });
  }

  // upsert into a `days` table with notes array in JSONB
  const { data: day, error: fetchErr } = await supabase
    .from("days")
    .select("iso,notes")
    .eq("iso", payload.dayIso)
    .maybeSingle();

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  const nextNotes = Array.isArray(day?.notes) ? [...day!.notes] : [];
  const idx = nextNotes.findIndex((n: any) => n.id === payload.note.id);
  if (idx >= 0) nextNotes[idx] = payload.note; else nextNotes.push(payload.note);

  const { error: upsertErr } = await supabase
    .from("days")
    .upsert({ iso: payload.dayIso, notes: nextNotes }, { onConflict: "iso" });

  if (upsertErr) {
    return NextResponse.json({ error: upsertErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = getClient();
  const payload = await request.json();
  // { dayIso: string, noteId: string }
  if (!payload?.dayIso || !payload?.noteId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!supabase) {
    // No persistence configured
    return NextResponse.json({ ok: false, reason: "Supabase not configured" }, { status: 501 });
  }

  // Fetch the day
  const { data: day, error: fetchErr } = await supabase
    .from("days")
    .select("iso,notes")
    .eq("iso", payload.dayIso)
    .maybeSingle();

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  if (!day || !Array.isArray(day.notes)) {
    return NextResponse.json({ ok: true }); // Nothing to delete
  }

  // Remove the note from the array
  const nextNotes = day.notes.filter((n: any) => n.id !== payload.noteId);

  const { error: upsertErr } = await supabase
    .from("days")
    .upsert({ iso: payload.dayIso, notes: nextNotes }, { onConflict: "iso" });

  if (upsertErr) {
    return NextResponse.json({ error: upsertErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
