"use client";

import React, { createContext, useState, useCallback, useMemo, useEffect } from "react";
import { CarbonEntry, CarbonTarget, UserSettings } from "@/types";
import { safeStorageParser, saveToStorage } from "@/lib/utils";
import { CarbonEntrySchema, CarbonTargetSchema, UserSettingsSchema, GoalSchema, ChallengeSchema } from "@/lib/schemas";
import { z } from "zod";
import { INITIAL_USER_SETTINGS, DEFAULT_TARGETS } from "@/lib/constants";

export interface FootprintState {
  readonly entries: readonly CarbonEntry[];
  readonly targets: readonly CarbonTarget[];
  readonly settings: UserSettings;
  readonly goals: readonly import("@/types").Goal[];
  readonly challenges: readonly import("@/types").Challenge[];
}

export interface FootprintDispatch {
  readonly addEntry: (entry: CarbonEntry) => void;
  readonly deleteEntry: (id: string) => void;
  readonly updateTarget: (target: CarbonTarget) => void;
  readonly updateSettings: (settings: Partial<UserSettings>) => void;
  readonly resetAll: () => void;
  readonly addGoal: (goal: import("@/types").Goal) => void;
  readonly toggleGoalActive: (id: string) => void;
  readonly addChallenge: (challenge: import("@/types").Challenge) => void;
  readonly completeChallenge: (id: string) => void;
}

export const FootprintStateContext = createContext<FootprintState | undefined>(undefined);
export const FootprintDispatchContext = createContext<FootprintDispatch | undefined>(undefined);

const ENTRIES_KEY = "ecosphere_entries";
const TARGETS_KEY = "ecosphere_targets";
const SETTINGS_KEY = "ecosphere_settings";
const GOALS_KEY = "ecosphere_goals";
const CHALLENGES_KEY = "ecosphere_challenges";

const defaultTargetsList: readonly CarbonTarget[] = [
  { targetValue: DEFAULT_TARGETS.total, category: "total", interval: "weekly" },
  { targetValue: DEFAULT_TARGETS.transport, category: "transport", interval: "weekly" },
  { targetValue: DEFAULT_TARGETS.food, category: "food", interval: "weekly" },
  { targetValue: DEFAULT_TARGETS.energy, category: "energy", interval: "weekly" },
  { targetValue: DEFAULT_TARGETS.waste, category: "waste", interval: "weekly" }
];

export function AppProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [entries, setEntries] = useState<readonly CarbonEntry[]>([]);
  const [targets, setTargets] = useState<readonly CarbonTarget[]>(defaultTargetsList);
  const [settings, setSettings] = useState<UserSettings>(INITIAL_USER_SETTINGS);
  const [goals, setGoals] = useState<readonly import("@/types").Goal[]>([]);
  const [challenges, setChallenges] = useState<readonly import("@/types").Challenge[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveState = useCallback((key: string, data: unknown) => {
    if (typeof window === "undefined") {
      return;
    }

    saveToStorage(key, data);
  }, []);

  // Load from storage on mount
  useEffect(() => {
    setEntries(safeStorageParser(ENTRIES_KEY, z.array(CarbonEntrySchema), []));
    setTargets(safeStorageParser(TARGETS_KEY, z.array(CarbonTargetSchema), defaultTargetsList));
    setSettings(safeStorageParser(SETTINGS_KEY, UserSettingsSchema, INITIAL_USER_SETTINGS));
    setGoals(safeStorageParser(GOALS_KEY, z.array(GoalSchema), []));
    setChallenges(safeStorageParser(CHALLENGES_KEY, z.array(ChallengeSchema), []));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveState(ENTRIES_KEY, entries);
    }
  }, [entries, saveState, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveState(TARGETS_KEY, targets);
    }
  }, [targets, saveState, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveState(SETTINGS_KEY, settings);
    }
  }, [settings, saveState, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveState(GOALS_KEY, goals);
    }
  }, [goals, saveState, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveState(CHALLENGES_KEY, challenges);
    }
  }, [challenges, saveState, isLoaded]);

  const addEntry = useCallback((entry: CarbonEntry) => {
    setEntries((prev) => [entry, ...prev]);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateTarget = useCallback((target: CarbonTarget) => {
    setTargets((prev) =>
      prev.map((item) =>
        item.category === target.category && item.interval === target.interval ? target : item
      )
    );
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const resetAll = useCallback(() => {
    setEntries([]);
    setTargets(defaultTargetsList);
    setSettings(INITIAL_USER_SETTINGS);
    setGoals([]);
    setChallenges([]);
  }, []);

  const addGoal = useCallback((goal: import("@/types").Goal) => {
    setGoals((prev) => [goal, ...prev]);
  }, []);

  const toggleGoalActive = useCallback((id: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, active: !g.active } : g)));
  }, []);

  const addChallenge = useCallback((challenge: import("@/types").Challenge) => {
    setChallenges((prev) => [challenge, ...prev]);
  }, []);

  const completeChallenge = useCallback((id: string) => {
    setChallenges((prev) => prev.map((c) => (c.id === id ? { ...c, completed: true } : c)));
  }, []);

  const stateWithExtras = useMemo<FootprintState>(() => ({ entries, targets, settings, goals, challenges }), [entries, targets, settings, goals, challenges]);
  const dispatchVal = useMemo<FootprintDispatch>(() => ({
    addEntry,
    deleteEntry,
    updateTarget,
    updateSettings,
    resetAll,
    addGoal,
    toggleGoalActive,
    addChallenge,
    completeChallenge
  }), [addEntry, deleteEntry, updateTarget, updateSettings, resetAll, addGoal, toggleGoalActive, addChallenge, completeChallenge]);

  return (
    <FootprintStateContext.Provider value={stateWithExtras}>
      <FootprintDispatchContext.Provider value={dispatchVal}>
        {children}
      </FootprintDispatchContext.Provider>
    </FootprintStateContext.Provider>
  );
}
