import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

export async function PATCH(request: Request) {
  const supabase = getClient();
  const payload = await request.json();
  // { dayIso: string, moods: Array<{ id, label, color }> }
  if (!payload?.dayIso) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!supabase) {
    // No persistence configured
    return NextResponse.json({ ok: false, reason: "Supabase not configured" }, { status: 501 });
  }

  const { error } = await supabase
    .from("days")
    .upsert({ iso: payload.dayIso, mood: payload.moods ?? [] }, { onConflict: "iso" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
