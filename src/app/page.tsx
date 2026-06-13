"use client";

import Link from "next/link";

const TELEMETRY_DATA = [
  { id: "t1", height: 35 },
  { id: "t2", height: 20 },
  { id: "t3", height: 60 },
  { id: "t4", height: 45 },
  { id: "t5", height: 90 },
  { id: "t6", height: 40 },
  { id: "t7", height: 55 },
  { id: "t8", height: 30 },
  { id: "t9", height: 95 },
  { id: "t10", height: 50 },
  { id: "t11", height: 65 },
  { id: "t12", height: 75 },
  { id: "t13", height: 40 },
  { id: "t14", height: 85 }
] as const;

export default function Home() {
  const operationalPipeline = [
    {
      index: "01",
      phase: "Assess",
      subtitle: "Granular Ingestion",
      details: "Execute rapid telemetry scans across public utility grids, travel vectors, and supply chains to isolate baseline variables.",
      icon: (
        <svg aria-hidden="true" className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      index: "02",
      phase: "Track",
      subtitle: "Time-Series Ledger",
      details: "Log anomalies inside continuous environmental analytics dashboards, recording real-time programmatic trend shifts.",
      icon: (
        <svg aria-hidden="true" className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      index: "03",
      phase: "Improve",
      subtitle: "Prescriptive Mitigation",
      details: "Deploy algorithmic recommendations to dynamically lower carbon exposure coefficients without throttling operational velocity.",
      icon: (
        <svg aria-hidden="true" className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-28 fade-in">
      
      {/* Premium Hero Interface Section */}
      <section className="card p-8 md:p-14 relative overflow-hidden group">
        {/* Vector ambient light orb */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[rgb(var(--accent))]/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-[rgb(var(--accent))]/15 transition-all duration-700" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Context Text Block */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-semibold tracking-widest uppercase mb-6 w-fit shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Optimization Engine Active
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              EcoSphere <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500">
                Carbon Intelligence.
              </span>
            </h1>
            
            <p className="mt-6 text-sm md:text-base text-slate-600 leading-relaxed max-w-xl">
              Deconstruct, model, and mitigate systemic carbon outputs. Leverage deep historical tracking data points and prescriptive machine curves to optimize enterprise and lifestyle environmental margins.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all duration-200 shadow-[0_0_24px_rgba(16,185,129,0.2)] hover:shadow-[0_0_32px_rgba(16,185,129,0.3)]"
              >
                Initialize Assessment
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm"
              >
                Launch Console
              </Link>
            </div>
          </div>

          {/* Graphical Micro-Telemetry Monitor Block */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="w-full aspect-[4/3] rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between relative shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Emissions Target Index</span>
                  <span className="text-2xl font-mono font-black text-slate-900 mt-1 block">3.14 <span className="text-xs font-normal text-slate-400">MT CO₂e</span></span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-200 text-[10px] font-mono text-emerald-600 font-bold">
                  STABLE RUNTIME
                </span>
              </div>
              
              {/* Dynamic bar charts displaying telemetry curves */}
              <div aria-hidden="true" className="w-full h-24 flex items-end gap-1.5 px-2 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                {TELEMETRY_DATA.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-sm transition-all duration-500" 
                    style={{ height: `${item.height}%` }}
                  />
                ))}
              </div>
              
              <div className="text-[11px] font-medium text-slate-500 flex justify-between items-center border-t border-slate-100 pt-4">
                <span>Data Pipelines: Synchronized</span>
                <span className="font-mono text-xs text-slate-400">0.0024s response</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Pipeline Infrastructure Step Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600">System Pipeline</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mt-1">Processing Architecture</h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            Raw environment logs scale across automated analytical models to generate high-fidelity, actionable mitigation insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {operationalPipeline.map((item) => (
            <div 
              key={item.index} 
              className="card group hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between min-h-[250px] shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-emerald-300 group-hover:bg-emerald-50 transition-all duration-300">
                    {item.icon}
                  </div>
                  <span className="font-mono text-sm font-black text-slate-800 tracking-tighter group-hover:text-emerald-600 transition-colors">
                    {item.index}
                  </span>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">{item.phase}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mt-0.5">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-500 mt-5 border-t border-slate-100 pt-4 group-hover:border-slate-200 transition-colors">
                {item.details}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Simulator Widget Embed Block */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-600">Telemetry Evaluation</span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Impact Scenario Matrix</h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Adjust the micro-variable coefficient models inside the interactive matrix workspace below to run automated predictive runtime carbon trajectories.
          </p>
        </div>
        
        <div className="p-1.5 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="bg-[rgb(var(--bg))] rounded-[22px] overflow-hidden">
            
          </div>
        </div>
      </section>

    </main>
  );
}