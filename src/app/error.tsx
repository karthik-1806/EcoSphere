"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg))] px-4 py-10">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/[0.08] bg-slate-950/95 p-10 shadow-2xl shadow-black/20">
        <div className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Something went wrong</p>
          <h1 className="text-4xl font-black text-white">Application Error</h1>
          <p className="text-sm leading-7 text-slate-400">
            An unexpected error occurred while rendering the page. Please try again or return home.
          </p>
          <div className="rounded-3xl bg-slate-900/80 p-5 text-left text-xs text-slate-300 border border-white/[0.06]">
            <p className="font-semibold text-slate-200">Error details</p>
            <pre className="mt-3 max-h-40 overflow-auto text-[11px] leading-5 text-slate-300">{error.message}</pre>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Reload Page
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-white/[0.08] bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
