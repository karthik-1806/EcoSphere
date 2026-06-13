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
    { label: "Transport", value: breakdown.transport || 0, color: "bg-emerald-500", text: "text-emerald-400" },
    { label: "Food", value: breakdown.food || 0, color: "bg-teal-500", text: "text-teal-400" },
    { label: "Energy", value: breakdown.energy || 0, color: "bg-cyan-500", text: "text-cyan-400" },
    { label: "Waste", value: breakdown.waste || 0, color: "bg-indigo-500", text: "text-indigo-400" },
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-6 py-10 space-y-8 fade-in">
      
      {/* Console Subheader Branding */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600">Telemetry Node // Console</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-1">Analytics Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/assessment" 
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition shadow-sm"
          >
            + Update Assessment Logs
          </Link>
        </div>
      </header>

      {/* Primary Analytical Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Metrics & Graph Rings */}
        <div className="lg:col-span-7 space-y-6">
          <CarbonScoreCard total={breakdown.total} />
          <AllocationRing metrics={metrics} totalWeight={totalWeight} />
        </div>

        {/* Right Column: AI Engine Diagnostics & System Insights */}
        <div className="lg:col-span-5 h-full">
          <InsightsList insights={insights} />
        </div>

      </div>

      <section aria-labelledby="dashboard-summary" className="card p-6">
        <h2 id="dashboard-summary" className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-100 pb-3">
          Dashboard Summary
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Active Goals</p>
            <p className="text-2xl font-bold text-slate-900">{goals.filter((g) => g.active).length}</p>
            <p className="mt-2 text-xs text-slate-500">of {goals.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Goal Progress</p>
            <p className="text-2xl font-bold text-slate-900">{goals.length ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0}%</p>
            <p className="mt-2 text-xs text-slate-500">average completion</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Challenges Completed</p>
            <p className="text-2xl font-bold text-slate-900">{challenges.filter((c) => c.completed).length}</p>
            <p className="mt-2 text-xs text-slate-500">of {challenges.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Target Nodes</p>
            <p className="text-2xl font-bold text-slate-900">{targets.length}</p>
            <p className="mt-2 text-xs text-slate-500">categories monitored</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="targets" className="card p-6">
        <h2 id="targets" className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-100 pb-3">
          Target Summary
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {targets.map((target) => (
            <div key={`${target.category}-${target.interval}`} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">{target.category}</p>
              <p className="text-2xl font-bold text-slate-900">{target.targetValue}</p>
              <p className="mt-2 text-xs text-slate-500">{target.interval} target</p>
            </div>
          ))}
        </div>
      </section>

      {/* Middle Grid Panels: Goals & System Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-1.5 border border-slate-200 bg-white rounded-3xl shadow-sm">
          <GoalsPanel />
        </div>
        <div className="card p-1.5 border border-slate-200 bg-white rounded-3xl shadow-sm">
          <ChallengesPanel />
        </div>
      </div>

      {/* Lower Row Ledger Component: Time-Series Actions */}
      <section aria-labelledby="recent" className="card p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h2 id="recent" className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Historical Activity Ledger
          </h2>
          <span className="text-[10px] font-mono text-slate-500 uppercase">showing latest 10 sequences</span>
        </div>
        
        <div className="overflow-x-auto">
          <ul className="divide-y divide-slate-100 min-w-[500px]">
            {entries.slice(0, 10).map((e) => (
              <li key={e.id} className="py-3.5 flex justify-between items-center group hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <div className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wide group-hover:border-emerald-300 transition-colors shadow-sm">
                    {e.category}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 tracking-tight">{e.description}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{new Date(e.date).toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs font-mono font-black text-slate-900">{e.carbonValue} kg CO₂e</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">{e.value} units</div>
                </div>
              </li>
            ))}
            {entries.length === 0 && (
              <li className="py-8 text-center text-xs text-slate-500 font-medium">
                No telemetry sequences detected. Initialize standard carbon calculation matrices to populate database rows.
              </li>
            )}
          </ul>
        </div>
      </section>

    </main>
  );
}