"use client";

import { AssessmentForm } from "@/components/assessment/AssessmentForm";
import Link from "next/link";

export default function AssessmentPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-[#F6FBF7]">
      {/* Decorative left leaf pattern */}
      <div className="absolute left-0 top-1/4 -translate-y-1/2 -translate-x-1/3 opacity-40 pointer-events-none mix-blend-multiply" aria-hidden="true">
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 400C200 400 0 300 0 200C0 100 200 0 200 0C200 0 400 100 400 200C400 300 200 400 200 400Z" fill="#D1FAE5" />
          <path d="M200 380C200 380 20 290 20 200C20 110 200 20 200 20C200 20 380 110 380 200C380 290 200 380 200 380Z" fill="#A7F3D0" />
        </svg>
      </div>

      {/* Decorative right leaf pattern */}
      <div className="absolute right-0 top-1/2 -translate-y-1/3 translate-x-1/4 opacity-40 pointer-events-none mix-blend-multiply" aria-hidden="true">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-45">
          <path d="M150 300C150 300 0 225 0 150C0 75 150 0 150 0C150 0 300 75 300 150C300 225 150 300 150 300Z" fill="#D1FAE5" />
          <path d="M150 280C150 280 20 215 20 150C20 85 150 20 150 20C150 20 280 85 280 150C280 215 150 280 150 280Z" fill="#6EE7B7" />
        </svg>
      </div>

      <main className="relative z-10 p-4 max-w-2xl mx-auto pt-12 pb-24">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-2">
              Carbon Assessment
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-emerald-500"><path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"/></svg>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Track your actions. Measure your impact.</p>
          </div>
          <nav>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors text-sm shadow-sm">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Home
            </Link>
          </nav>
        </header>

        <section id="assessment-panel" className="mt-8">
          <AssessmentForm />
        </section>
      </main>
    </div>
  );
}
