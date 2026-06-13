"use client";

import React, { useState } from "react";
import { useFootprint } from "@/hooks/useFootprint";
import { sanitizeText } from "@/lib/utils";
import { GoalSchema } from "@/lib/schemas";
import type { Goal } from "@/types";

export function GoalsPanel() {
  const { goals, addGoal, toggleGoalActive } = useFootprint();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Goal["category"]>("total");
  const [targetValue, setTargetValue] = useState(100);

  const [goalError, setGoalError] = useState<string | null>(null);

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setGoalError(null);

    const cleanTitle = sanitizeText(title || "Untitled Goal");
    const now = new Date().toISOString();
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : String(Date.now());
    const goal: Goal = {
      id,
      title: cleanTitle,
      category,
      targetValue,
      progress: 0,
      active: true,
      createdAt: now
    };

    const validation = GoalSchema.safeParse(goal);
    if (!validation.success) {
      setGoalError(validation.error.errors.map((err) => err.message).join(", "));
      return;
    }

    addGoal(validation.data);
    setTitle("");
    setTargetValue(100);
  };

  return (
    <section aria-labelledby="goals" className="card fade-in mt-4">
      <h2 id="goals" className="text-lg font-medium">
        Goals
      </h2>

      <form onSubmit={onCreate} className="mt-3 grid grid-cols-1 items-end gap-4 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label htmlFor="goal-title" className="mb-1 block text-xs font-bold text-slate-700">
            Goal title
          </label>
          <input
            id="goal-title"
            aria-label="Goal title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="goal-category" className="mb-1 block text-xs font-bold text-slate-700">
            Category
          </label>
          <select
            id="goal-category"
            aria-label="Goal category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Goal["category"])}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="total">Total</option>
            <option value="transport">Transport</option>
            <option value="food">Food</option>
            <option value="energy">Energy</option>
            <option value="waste">Waste</option>
          </select>
        </div>
        <div>
          <label htmlFor="goal-target" className="mb-1 block text-xs font-bold text-slate-700">
            Target value
          </label>
          <input
            id="goal-target"
            aria-label="Target value"
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(Number(e.target.value))}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="sm:col-span-4">
          <button
            type="submit"
            className="mt-2 rounded bg-emerald-600 px-3 py-2 text-white transition hover:bg-emerald-500"
          >
            Create Goal
          </button>
        </div>
      </form>

      <ul className="mt-4 space-y-3">
        {goalError && (
          <div role="alert" className="text-sm text-rose-500">
            {goalError}
          </div>
        )}
        {goals.map((g) => (
          <li
            key={g.id}
            className="flex items-center justify-between rounded border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-800">{g.title}</div>
              <div className="text-xs font-medium text-slate-500">
                {g.category} • Target {g.targetValue}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded border border-slate-200/50 bg-slate-100">
                <div
                  style={{ width: `${Math.min(100, Math.max(0, g.progress))}%` }}
                  className="h-full bg-emerald-500"
                ></div>
              </div>
            </div>
            <div className="ml-4 flex flex-col items-end">
              <button
                aria-pressed={g.active}
                onClick={() => toggleGoalActive(g.id)}
                className={`rounded px-2 py-1 text-xs font-semibold ${g.active ? "border border-emerald-200 bg-emerald-100 text-emerald-700" : "border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {g.active ? "Active" : "Inactive"}
              </button>
              <div className="mt-2 text-xs font-bold text-slate-600">{g.progress}%</div>
            </div>
          </li>
        ))}
        {goals.length === 0 && (
          <li className="text-sm font-medium text-slate-500">No goals yet.</li>
        )}
      </ul>
    </section>
  );
}
