"use client";

import { useFootprint } from "@/hooks/useFootprint";
import Link from "next/link";
import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { ChallengesPanel } from "@/components/challenges/ChallengesPanel";
import { CarbonScoreCard } from "@/components/dashboard/CarbonScoreCard";
import { AllocationRing } from "@/components/dashboard/AllocationRing";
import { InsightsList } from "@/components/dashboard/InsightsList";

export default function DashboardPage() {
  const { breakdown, insights, entries, targets, goals, challenges } = useFootprint();

  // Normalize metrics safely for chart distributions or calculate fallback metrics
  const totalWeight = breakdown.total || 1;
  const metrics = [
    {
      label: "Transport",
      value: breakdown.transport || 0,
      color: "bg-emerald-500",
      text: "text-emerald-400"
    },
    { label: "Food", value: breakdown.food || 0, color: "bg-teal-500", text: "text-teal-400" },
    { label: "Energy", value: breakdown.energy || 0, color: "bg-cyan-500", text: "text-cyan-400" },
    { label: "Waste", value: breakdown.waste || 0, color: "bg-indigo-500", text: "text-indigo-400" }
  ];

  return (
    <main className="fade-in mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      {/* Console Subheader Branding */}
      <header className="flex flex-col justify-between gap-4 border-b border-white/[0.04] pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-600">
            Telemetry Node // Console
          </span>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Analytics Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/assessment"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            + Update Assessment Logs
          </Link>
        </div>
      </header>

      {/* Primary Analytical Workspace Grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Metrics & Graph Rings */}
        <div className="space-y-6 lg:col-span-7">
          <CarbonScoreCard total={breakdown.total} />
          <AllocationRing metrics={metrics} totalWeight={totalWeight} />
        </div>

        {/* Right Column: AI Engine Diagnostics & System Insights */}
        <div className="h-full lg:col-span-5">
          <InsightsList insights={insights} />
        </div>
      </div>

      <section aria-labelledby="dashboard-summary" className="card p-6">
        <h2
          id="dashboard-summary"
          className="mb-4 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-widest text-slate-500"
        >
          Dashboard Summary
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">Active Goals</p>
            <p className="text-2xl font-bold text-slate-900">
              {goals.filter((g) => g.active).length}
            </p>
            <p className="mt-2 text-xs text-slate-500">of {goals.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">Goal Progress</p>
            <p className="text-2xl font-bold text-slate-900">
              {goals.length
                ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
                : 0}
              %
            </p>
            <p className="mt-2 text-xs text-slate-500">average completion</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
              Challenges Completed
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {challenges.filter((c) => c.completed).length}
            </p>
            <p className="mt-2 text-xs text-slate-500">of {challenges.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">Target Nodes</p>
            <p className="text-2xl font-bold text-slate-900">{targets.length}</p>
            <p className="mt-2 text-xs text-slate-500">categories monitored</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="targets" className="card p-6">
        <h2
          id="targets"
          className="mb-4 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-widest text-slate-500"
        >
          Target Summary
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {targets.map((target) => (
            <div
              key={`${target.category}-${target.interval}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
                {target.category}
              </p>
              <p className="text-2xl font-bold text-slate-900">{target.targetValue}</p>
              <p className="mt-2 text-xs text-slate-500">{target.interval} target</p>
            </div>
          ))}
        </div>
      </section>

      {/* Middle Grid Panels: Goals & System Challenges */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card rounded-3xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <GoalsPanel />
        </div>
        <div className="card rounded-3xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <ChallengesPanel />
        </div>
      </div>

      {/* Lower Row Ledger Component: Time-Series Actions */}
      <section aria-labelledby="recent" className="card p-6">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 id="recent" className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Historical Activity Ledger
          </h2>
          <span className="font-mono text-[10px] uppercase text-slate-500">
            showing latest 10 sequences
          </span>
        </div>

        <div className="overflow-x-auto">
          <ul className="min-w-[500px] divide-y divide-slate-100">
            {entries.slice(0, 10).map((e) => (
              <li
                key={e.id}
                className="group -mx-2 flex items-center justify-between rounded-lg px-2 py-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-600 shadow-sm transition-colors group-hover:border-emerald-300">
                    {e.category}
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-tight text-slate-800">
                      {e.description}
                    </div>
                    <div className="mt-0.5 text-[10px] font-medium text-slate-500">
                      {new Date(e.date).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-black text-slate-900">
                    {e.carbonValue} kg CO₂e
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-slate-500">{e.value} units</div>
                </div>
              </li>
            ))}
            {entries.length === 0 && (
              <li className="py-8 text-center text-xs font-medium text-slate-500">
                No telemetry sequences detected. Initialize standard carbon calculation matrices to
                populate database rows.
              </li>
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
