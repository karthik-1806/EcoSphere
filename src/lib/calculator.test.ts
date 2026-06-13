import { describe, it, expect } from "vitest";
import { calculateEntryCarbon, computeBreakdown, percentageBreakdown, sustainabilityRating } from "./calculator";

describe("Calculator", () => {
  it("calculates transport entry carbon", () => {
    expect(calculateEntryCarbon("transport", 100, "car")).toBeCloseTo(18);
    expect(calculateEntryCarbon("transport", 100, "flight")).toBeCloseTo(24);
  });

  it("calculates food entry carbon with fallback", () => {
    expect(calculateEntryCarbon("food", 2, "meat")).toBeCloseTo(14.4);
    expect(calculateEntryCarbon("food", 2, "unknown")).toBeGreaterThan(0);
  });

  it("computes breakdown and percentages", () => {
    const entries = [
      { id: "1", category: "transport" as const, value: 0, description: "", date: "", carbonValue: 10 },
      { id: "2", category: "food" as const, value: 0, description: "", date: "", carbonValue: 5 },
      { id: "3", category: "energy" as const, value: 0, description: "", date: "", carbonValue: 2 }
    ];
    const breakdown = computeBreakdown(entries);
    expect(breakdown.total).toBeCloseTo(17);
    const pct = percentageBreakdown(breakdown);
    expect(pct.transport + pct.food + pct.energy + pct.waste).toBeCloseTo(100);
  });

  it("handles zero total and unknown categories with default fallbacks", () => {
    expect(calculateEntryCarbon("transport", 100, "unknown-vehicle")).toBeGreaterThan(0);
    expect(calculateEntryCarbon("food", 100, "unknown-food")).toBeGreaterThan(0);
    expect(calculateEntryCarbon("energy", 100, "unknown-energy")).toBeGreaterThan(0);
    expect(calculateEntryCarbon("waste", 100, "unknown-waste")).toBeGreaterThan(0);

    const breakdown = computeBreakdown([]);
    expect(breakdown.total).toBe(0);
    const pct = percentageBreakdown(breakdown);
    expect(pct.transport).toBe(0);
    expect(pct.food).toBe(0);
    expect(pct.energy).toBe(0);
    expect(pct.waste).toBe(0);
  });

  it("rates sustainability", () => {
    expect(sustainabilityRating(20).label).toBe("Excellent");
    expect(sustainabilityRating(100).label).toBe("Good");
    expect(sustainabilityRating(400).label).toBe("High");
  });
});
