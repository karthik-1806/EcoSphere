

interface CarbonScoreCardProps {
  total: number;
}

export function CarbonScoreCard({ total }: CarbonScoreCardProps) {
  return (
    <section aria-labelledby="score" className="card relative overflow-hidden group p-6">
      <div aria-hidden="true" className="absolute -right-16 -top-16 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      <span id="score" className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
        Aggregate Carbon Footprint Index
      </span>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-5xl font-mono font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-slate-700 to-slate-900">
          {total.toLocaleString()}
        </span>
        <span className="text-sm font-bold text-slate-500 tracking-wide">kg CO₂e / period</span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-4">
        <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Real-time time-series logging operational layer</span>
      </div>
    </section>
  );
}
