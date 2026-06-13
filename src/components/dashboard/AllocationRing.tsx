

interface Metric {
  label: string;
  value: number;
  color: string;
  text: string;
}

interface AllocationRingProps {
  metrics: Metric[];
  totalWeight: number;
}

export function AllocationRing({ metrics, totalWeight }: AllocationRingProps) {
  return (
    <section aria-labelledby="breakdown" className="card p-6">
      <h2 id="breakdown" className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 border-b border-slate-100 pb-3">
        Emission Mass Allocation
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
        
        {/* Dynamic Interactive Ring Model */}
        <div role="figure" aria-labelledby="breakdown-visual" className="sm:col-span-5 flex justify-center">
          <h3 id="breakdown-visual" className="sr-only">Category allocation ring distribution</h3>
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg aria-hidden="true" viewBox="0 0 32 32" className="w-full h-full -rotate-90 transform" role="img">
              <circle r="14" cx="16" cy="16" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="4" />
              {/* Simplified stacked progress mapping lines */}
              <circle r="14" cx="16" cy="16" fill="none" stroke="rgba(16,185,129,0.8)" strokeWidth="4" strokeDasharray="88 88" strokeDashoffset="20" strokeLinecap="round" />
            </svg>
            <div className="absolute text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Mass Matrix</span>
              <span className="text-sm font-mono font-bold text-slate-800">100% Verified</span>
            </div>
          </div>
        </div>
        
        {/* Quantized Allocation Bars */}
        <ul className="sm:col-span-7 space-y-4">
          {metrics.map((metric) => {
            const percentage = Math.min(Math.round((metric.value / totalWeight) * 100), 100) || 0;
            return (
              <li key={metric.label} className="space-y-1">
                <div className="flex justify-between text-xs font-medium tracking-wide">
                  <span className="text-slate-600">{metric.label}</span>
                  <span className={`font-mono font-bold text-slate-800`}>
                    {metric.value} kg <span className="text-slate-500 text-[10px]">({percentage}%)</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${metric.color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                </div>
              </li>
            );
          })}
        </ul>

      </div>
    </section>
  );
}
