import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg))] px-4 py-10">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/[0.08] bg-slate-950/95 p-10 shadow-2xl shadow-black/20 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">404 — Page not found</p>
        <h1 className="mt-4 text-5xl font-black text-white">Lost in the grid?</h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          The page you are looking for does not exist or may have been moved. Use the links below to get back on track.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/"
            className="rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Return to Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-white/[0.08] bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
