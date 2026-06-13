interface CarbonScoreCardProps {
  total: number;
}

export function CarbonScoreCard({ total }: CarbonScoreCardProps) {
  return (
    <section aria-labelledby="score" className="card group relative overflow-hidden p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/5 blur-2xl"
      />
      <span
        id="score"
        className="block text-[10px] font-bold uppercase tracking-widest text-slate-500"
      >
        Aggregate Carbon Footprint Index
      </span>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="bg-gradient-to-r from-emerald-800 via-slate-700 to-slate-900 bg-clip-text font-mono text-5xl font-black tracking-tighter text-transparent">
          {total.toLocaleString()}
        </span>
        <span className="text-sm font-bold tracking-wide text-slate-500">kg CO₂e / period</span>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        <span>Real-time time-series logging operational layer</span>
      </div>
    </section>
  );
}
