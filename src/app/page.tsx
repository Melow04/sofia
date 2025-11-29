"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarBoard } from "@/components/calendar/CalendarBoard";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

export default function Home() {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      setLoggedIn(Boolean(data.session));
      setChecking(false);
    };
    run();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-base-content">
        <span className="loading loading-spinner" />
      </div>
    );
  }

  if (loggedIn) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
          <CalendarBoard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-12 sm:px-8">
        <section className="rounded-3xl border border-base-200 bg-base-100 p-8 text-base-content shadow-soft">
          <p className="text-xs uppercase tracking-[0.35em] text-secondary">Sofia Studio</p>
          <h1 className="mt-4 text-4xl font-display font-semibold leading-tight text-base-content">
            Your calendar & mood journal
          </h1>
          <p className="mt-5 max-w-2xl text-base text-base-content/70">
            Capture your days, track your moods, and organize your thoughts. Please login to begin.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="btn btn-primary rounded-full px-8">
              Login
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
