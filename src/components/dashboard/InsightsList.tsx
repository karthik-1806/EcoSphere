import type { Insight } from "@/types";

interface InsightsListProps {
  insights: readonly Insight[];
}

export function InsightsList({ insights }: InsightsListProps) {
  return (
    <section aria-labelledby="insights" className="card flex h-full flex-col p-6">
      <h2
        id="insights"
        className="mb-4 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-widest text-slate-500"
      >
        AI Optimization Engine Insights
      </h2>

      <ul className="flex-1 space-y-3 overflow-y-auto">
        {insights.map((i) => (
          <li
            key={i.id}
            className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:bg-slate-100"
          >
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-100 text-xs text-emerald-600">
              ✦
            </div>
            <div className="space-y-1">
              <strong className="block text-xs font-bold tracking-tight text-slate-900">
                {i.title}
              </strong>
              <p className="text-[11px] leading-relaxed text-slate-600">{i.message}</p>
            </div>
          </li>
        ))}
        {insights.length === 0 && (
          <div className="py-8 text-center text-xs font-medium text-slate-500">
            No behavioral diagnostics reported yet.
          </div>
        )}
      </ul>
    </section>
  );
}
