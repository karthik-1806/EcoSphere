import { describe, it, expect } from "vitest";
import {
  calculateEntryCarbon,
  computeBreakdown,
  percentageBreakdown,
  sustainabilityRating
} from "./calculator";
import type { CarbonEntry, CarbonCategory } from "@/types";

describe("calculator extra coverage", () => {
  it("handles all categories and fallback options", () => {
    expect(calculateEntryCarbon("transport", 10, "car")).toBeGreaterThan(0);
    expect(calculateEntryCarbon("transport", 10, "unknown-option")).toBeGreaterThanOrEqual(0);
    expect(calculateEntryCarbon("food", 2, "meat")).toBeGreaterThan(0);
    expect(calculateEntryCarbon("energy", 5, "gas")).toBeGreaterThan(0);
    expect(calculateEntryCarbon("waste", 1, "recycled")).toBeGreaterThan(0);
    // unknown category returns 0
    expect(calculateEntryCarbon("unknown" as unknown as CarbonCategory, 10)).toBe(0);
  });

  it("computes breakdown and percentages including zero-total path", () => {
    const entries: readonly CarbonEntry[] = [
      {
        id: "1",
        category: "transport",
        value: 1,
        description: "x",
        date: new Date().toISOString(),
        carbonValue: 5
      },
      {
        id: "2",
        category: "food",
        value: 1,
        description: "x",
        date: new Date().toISOString(),
        carbonValue: 5
      }
    ];

    const breakdown = computeBreakdown(entries);

    expect(breakdown.transport).toBe(5);
    expect(breakdown.food).toBe(5);
    expect(breakdown.total).toBe(10);

    const pct = percentageBreakdown(breakdown);
    expect(pct.transport + pct.food + pct.energy + pct.waste).toBeCloseTo(100, 1);

    const zeroPct = percentageBreakdown({ transport: 0, food: 0, energy: 0, waste: 0, total: 0 });
    expect(zeroPct.transport).toBe(0);
    expect(zeroPct.food).toBe(0);
  });

  it("evaluates sustainabilityRating boundaries", () => {
    expect(sustainabilityRating(0).label).toBe("Excellent");
    expect(sustainabilityRating(50).label).toBe("Excellent");
    expect(sustainabilityRating(100).label).toBe("Good");
    expect(sustainabilityRating(250).label).toBe("Average");
    expect(sustainabilityRating(400).label).toBe("High");
    expect(sustainabilityRating(1000).label).toBe("Very High");
  });
});
