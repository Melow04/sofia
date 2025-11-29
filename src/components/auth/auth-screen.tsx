"use client";

import Link from "next/link";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

type AuthScreenProps = {
  mode: "login" | "register";
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const isLogin = true;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        window.location.assign("/");
      }
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-8">
        <div className="flex justify-end">
          <Link href="/" className="link link-secondary">← Back to home</Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:flex-row sm:items-center sm:px-8">
        <div className="w-full rounded-3xl border border-base-200 bg-base-100 p-10 shadow-soft">
          <p className="text-xs uppercase tracking-[0.35em] text-secondary">Sofia Studio</p>
          <h1 className="mt-4 text-4xl font-display font-semibold leading-tight text-base-content">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-4 text-sm text-base-content/70">
            {isLogin
              ? "Sign in to access your calendar and notes."
              : "Start organizing your days and tracking your moods."}
          </p>
        </div>

        <form className="w-full rounded-3xl border border-base-200 bg-base-100 p-10 text-base-content shadow-soft" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-base-content">
            Login
          </h2>

          <div className="mt-6 space-y-4">
            <label className="form-control">
              <span className="label-text text-xs uppercase tracking-widest text-base-content/60">
                Email
              </span>
              <input className="input input-bordered rounded-xl" placeholder="sofia@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="form-control">
              <span className="label-text text-xs uppercase tracking-widest text-base-content/60">
                Password
              </span>
              <input type="password" className="input input-bordered rounded-xl" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
          </div>

          <button className="btn btn-primary mt-8 w-full rounded-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {error && (
            <div className="mt-3 text-sm text-error">{error}</div>
          )}

          <div className="mt-4 text-center text-sm text-base-content/70">
            Single-user mode. Contact admin to manage access.
          </div>
        </form>
      </div>
    </div>
  );
}

