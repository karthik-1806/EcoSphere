"use client";

import React, { useState } from "react";
import { useFootprint } from "@/hooks/useFootprint";
import { sanitizeText } from "@/lib/utils";
import { ChallengeSchema } from "@/lib/schemas";

export function ChallengesPanel() {
  const { challenges, addChallenge, completeChallenge } = useFootprint();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationDays, setDurationDays] = useState(7);

  const [challengeError, setChallengeError] = useState<string | null>(null);

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setChallengeError(null);

    const cleanTitle = sanitizeText(title || "Untitled Challenge");
    const cleanDescription = sanitizeText(description || "");
    const now = new Date().toISOString();
    const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : String(Date.now());
    const challenge = { id, title: cleanTitle, description: cleanDescription, durationDays, completed: false, createdAt: now };

    const validation = ChallengeSchema.safeParse(challenge);
    if (!validation.success) {
      setChallengeError(validation.error.errors.map((err) => err.message).join(", "));
      return;
    }

    addChallenge(validation.data);
    setTitle("");
    setDescription("");
    setDurationDays(7);
  };

  return (
    <section aria-labelledby="challenges" className="mt-4 card fade-in">
      <h2 id="challenges" className="text-lg font-medium text-slate-900">Challenges</h2>

      <form onSubmit={onCreate} className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-2">
          <label htmlFor="challenge-title" className="block text-xs font-bold text-slate-700 mb-1">
            Challenge title
          </label>
          <input
            id="challenge-title"
            aria-label="Challenge title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white text-slate-900 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="challenge-duration" className="block text-xs font-bold text-slate-700 mb-1">
            Duration days
          </label>
          <input
            id="challenge-duration"
            aria-label="Duration days"
            type="number"
            min={1}
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            className="w-full rounded border border-slate-300 bg-white text-slate-900 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="challenge-description" className="block text-xs font-bold text-slate-700 mb-1">
            Description
          </label>
          <input
            id="challenge-description"
            aria-label="Challenge description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white text-slate-900 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="sm:col-span-3">
          <button type="submit" className="mt-2 rounded bg-emerald-600 text-white px-3 py-2 hover:bg-emerald-500 transition">
            Create Challenge
          </button>
        </div>
      </form>

      <ul className="mt-4 space-y-3">
        {challengeError && <div role="alert" className="text-sm text-rose-500">{challengeError}</div>}
      {challenges.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-3 border border-slate-200 rounded bg-white shadow-sm">
            <div>
              <div className="text-sm font-bold text-slate-800">{c.title}</div>
              <div className="text-xs text-slate-500 font-medium">{c.durationDays} days • {c.completed ? 'Completed' : 'Active'}</div>
            </div>
            <div className="flex items-center gap-2">
              {!c.completed && (
                <button onClick={() => completeChallenge(c.id)} className="rounded px-2 py-1 border border-slate-200 bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors text-xs">Complete</button>
              )}
              {c.completed && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Done</span>}
            </div>
          </li>
        ))}
        {challenges.length === 0 && <li className="text-sm text-slate-500 font-medium">No challenges yet.</li>}
      </ul>
    </section>
  );
}
