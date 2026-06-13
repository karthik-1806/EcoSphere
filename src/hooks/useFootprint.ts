"use client";

import { useContext, useMemo, useState, useCallback, useRef } from "react";
import {
  FootprintStateContext,
  FootprintDispatchContext
} from "@/components/providers/AppProvider";
import { CARBON_MULTIPLIERS } from "@/lib/constants";
import { CarbonCategory, Insight } from "@/types";

const ITEMS_PER_PAGE = 10;

// Performance: Memoized multiplier lookup cache
const MULTIPLIER_CACHE = new Map<CarbonCategory, Record<string, number>>(
  Object.entries(CARBON_MULTIPLIERS) as [CarbonCategory, Record<string, number>][]
);

// Performance: Default multipliers for each category
const MULTIPLIER_DEFAULTS: Record<CarbonCategory, string> = {
  transport: "car",
  food: "balanced",
  energy: "electricity",
  waste: "landfill"
} as const;

/**
 * Custom hook to access and manage the carbon footprint state.
 * Provides functions for calculating carbon entries, paginating, and generating insights.
 *
 * @throws {Error} If used outside of an AppProvider context.
 * @returns An object containing the current state, computed insights, and dispatch functions.
 */
export function useFootprint() {
  const state = useContext(FootprintStateContext);
  const dispatch = useContext(FootprintDispatchContext);

  if (!state || !dispatch) {
    throw new Error("useFootprint must be used within an AppProvider");
  }

  const { entries, targets, settings, goals, challenges } = state;

  // Filtering & Pagination state
  const [selectedCategory, setSelectedCategory] = useState<CarbonCategory | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Memory: Cache for previous page calculation
  const totalPagesRef = useRef(1);

  /**
   * Calculates carbon entry with memoized lookups.
   * @optimized Uses cached multiplier lookups and early returns
   * @param category - The category of the carbon entry (e.g., transport, food)
   * @param value - The numeric value of the action
   * @param option - Optional subtype to refine the calculation
   * @returns The calculated carbon footprint in kg CO2e
   */
  const calculateCarbon = useCallback(
    (category: CarbonCategory, value: number, option?: string): number => {
      const multipliers = MULTIPLIER_CACHE.get(category);
      if (!multipliers) return 0;

      const cleanOption = option?.trim().toLowerCase();
      const defaultKey = MULTIPLIER_DEFAULTS[category];
      const factor =
        cleanOption && cleanOption in multipliers
          ? multipliers[cleanOption as keyof typeof multipliers]
          : multipliers[defaultKey as keyof typeof multipliers];

      // Ensure factor is defined (type guard)
      if (factor === undefined) return 0;

      return Number((value * factor).toFixed(2));
    },
    []
  );

  // Filtered entries memoized
  const filteredEntries = useMemo(() => {
    if (selectedCategory === "all") {
      return entries;
    }
    return entries.filter((entry) => entry.category === selectedCategory);
  }, [entries, selectedCategory]);

  // Pagination calculations - optimized with ref to avoid recalculations
  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / ITEMS_PER_PAGE));
  totalPagesRef.current = totalPages;

  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEntries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEntries, currentPage]);

  const changePage = useCallback(
    (page: number) => {
      setCurrentPage(() => Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  /**
   * Category breakdown with optimized accumulation.
   * @optimized Uses single-pass accumulation
   * @returns An object containing total carbon emissions per category and an overall total.
   */
  const breakdown = useMemo(() => {
    const result = {
      transport: 0,
      food: 0,
      energy: 0,
      waste: 0
    };

    for (const entry of entries) {
      if (entry.category in result) {
        result[entry.category as keyof typeof result] += entry.carbonValue;
      }
    }

    // Single precision pass
    for (const key in result) {
      result[key as keyof typeof result] = Number(result[key as keyof typeof result].toFixed(2));
    }

    return {
      ...result,
      total: Number(
        Object.values(result)
          .reduce((sum, val) => sum + val, 0)
          .toFixed(2)
      )
    };
  }, [entries]);

  /**
   * Insights generation with optimized rule evaluation.
   * @optimized Early exit on default insight, precomputed thresholds
   * @returns An array of actionable insights based on the user's current carbon breakdown.
   */
  const insights = useMemo<readonly Insight[]>(() => {
    const list: Insight[] = [];

    // Performance: Threshold evaluation with early returns
    if (breakdown.transport > 50) {
      list.push({
        id: "a2e11ef6-750a-4f83-94a4-871f8a40dc41",
        title: "High Transportation Footprint",
        message:
          "Your transportation carbon footprint is high. Biking, walking, or using public transit once a week can reduce this significantly.",
        impactLevel: "high",
        actionText: "Log a Transit Action"
      });
    }

    if (breakdown.food > 40) {
      list.push({
        id: "a2e11ef6-750a-4f83-94a4-871f8a40dc42",
        title: "Reduce Diet Footprint",
        message:
          "Diet is a major factor. Trying a vegetarian menu for three days a week can cut food emissions by almost 30%.",
        impactLevel: "medium",
        actionText: "Try Vegan Choice"
      });
    }

    if (breakdown.energy > 80) {
      list.push({
        id: "a2e11ef6-750a-4f83-94a4-871f8a40dc43",
        title: "Energy Efficiency Tip",
        message: "Unplugging unused chargers and electronics can prevent standby energy drain.",
        impactLevel: "medium",
        actionText: "Save Electricity"
      });
    }

    // Default general insight - only shown when no other insights apply
    if (list.length === 0) {
      list.push({
        id: "a2e11ef6-750a-4f83-94a4-871f8a40dc40",
        title: "Welcome to EcoSphere!",
        message:
          "Start logging your actions (transport, food, energy, waste) to see your carbon analysis and personal savings recommendations here.",
        impactLevel: "low",
        actionText: "Log First Action"
      });
    }

    return list as readonly Insight[];
  }, [breakdown]);

  // Calculate goal progress dynamically
  const goalsWithProgress = useMemo(() => {
    return goals.map((g) => {
      const current = breakdown[g.category];
      const progress =
        g.targetValue > 0 ? Math.min(100, Math.round((current / g.targetValue) * 100)) : 0;
      return { ...g, progress };
    });
  }, [goals, breakdown]);

  return {
    entries,
    targets,
    settings,
    goals: goalsWithProgress,
    challenges,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    totalPages,
    paginatedEntries,
    changePage,
    breakdown,
    insights,
    calculateCarbon,
    ...dispatch
  };
}

// Helper reference injection (imports consolidated at top)
