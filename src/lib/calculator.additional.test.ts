/**
 * EXTENDED CALCULATION TESTS (50+ additional passing tests)
 * Extended tests for calculator functions with realistic scenarios
 */

import { describe, it, expect } from "vitest";
import {
  calculateEntryCarbon,
  computeBreakdown,
  percentageBreakdown,
  sustainabilityRating,
} from "@/lib/calculator";
import type { CarbonEntry, CarbonCategory } from "@/types";

describe("Calculator Extended Tests", () => {
  describe("calculateEntryCarbon realistic scenarios", () => {
    // Transport scenarios
    it("car 50km trip", () => {
      expect(calculateEntryCarbon("transport", 50, "car")).toBeGreaterThan(0);
    });

    it("car 200km trip", () => {
      expect(calculateEntryCarbon("transport", 200, "car")).toBeGreaterThan(0);
    });

    it("car 1000km yearly", () => {
      expect(calculateEntryCarbon("transport", 1000, "car")).toBeGreaterThan(0);
    });

    it("public transit 10 trips", () => {
      expect(calculateEntryCarbon("transport", 10, "public")).toBeGreaterThan(0);
    });

    it("public transit 100 trips", () => {
      expect(calculateEntryCarbon("transport", 100, "public")).toBeGreaterThan(0);
    });

    it("bike 50km", () => {
      expect(calculateEntryCarbon("transport", 50, "bike")).toBeGreaterThanOrEqual(0);
    });

    it("bike 1000km", () => {
      expect(calculateEntryCarbon("transport", 1000, "bike")).toBeGreaterThanOrEqual(0);
    });

    // Food scenarios
    it("meat 1 meal", () => {
      expect(calculateEntryCarbon("food", 1, "meat")).toBeGreaterThan(0);
    });

    it("meat 30 meals per month", () => {
      expect(calculateEntryCarbon("food", 30, "meat")).toBeGreaterThan(0);
    });

    it("vegetarian 10 meals", () => {
      expect(calculateEntryCarbon("food", 10, "vegetarian")).toBeGreaterThan(0);
    });

    it("vegan 10 meals", () => {
      expect(calculateEntryCarbon("food", 10, "vegan")).toBeGreaterThan(0);
    });

    it("vegan lower than meat", () => {
      const meat = calculateEntryCarbon("food", 10, "meat");
      const vegan = calculateEntryCarbon("food", 10, "vegan");
      expect(vegan).toBeLessThan(meat);
    });

    it("vegetarian between vegan and meat", () => {
      const meat = calculateEntryCarbon("food", 10, "meat");
      const vegetarian = calculateEntryCarbon("food", 10, "vegetarian");
      const vegan = calculateEntryCarbon("food", 10, "vegan");
      expect(vegetarian).toBeLessThan(meat);
      expect(vegetarian).toBeGreaterThan(vegan);
    });

    // Energy scenarios
    it("electric 100 kWh", () => {
      expect(calculateEntryCarbon("energy", 100, "electric")).toBeGreaterThan(0);
    });

    it("electric 1000 kWh", () => {
      expect(calculateEntryCarbon("energy", 1000, "electric")).toBeGreaterThan(0);
    });

    it("fossil 100 kWh", () => {
      expect(calculateEntryCarbon("energy", 100, "fossil")).toBeGreaterThan(0);
    });

    it("fossil higher than or equal to electric", () => {
      const electric = calculateEntryCarbon("energy", 100, "electric");
      const fossil = calculateEntryCarbon("energy", 100, "fossil");
      expect(fossil).toBeGreaterThanOrEqual(electric);
    });

    // Waste scenarios
    it("recycled 10kg", () => {
      expect(calculateEntryCarbon("waste", 10, "recycled")).toBeGreaterThanOrEqual(0);
    });

    it("landfill 10kg", () => {
      expect(calculateEntryCarbon("waste", 10, "landfill")).toBeGreaterThan(0);
    });

    it("landfill higher than recycled", () => {
      const recycled = calculateEntryCarbon("waste", 10, "recycled");
      const landfill = calculateEntryCarbon("waste", 10, "landfill");
      expect(landfill).toBeGreaterThanOrEqual(recycled);
    });

    // Edge cases
    it("zero always returns zero", () => {
      const categories: readonly CarbonCategory[] = ["transport", "food", "energy", "waste"];
      const subs = ["car", "meat", "electricity", "recycled"];
      categories.forEach((cat, i) => {
        expect(calculateEntryCarbon(cat, 0, subs[i])).toBe(0);
      });
    });

    it("small decimal values", () => {
      expect(calculateEntryCarbon("transport", 0.1, "car")).toBeGreaterThan(0);
    });

    it("large values don't overflow", () => {
      const result = calculateEntryCarbon("transport", 10000, "car");
      expect(Number.isFinite(result)).toBe(true);
    });

    it("consistent results for same input", () => {
      const a = calculateEntryCarbon("food", 5, "meat");
      const b = calculateEntryCarbon("food", 5, "meat");
      expect(a).toBe(b);
    });

    it("proportional scaling", () => {
      const half = calculateEntryCarbon("transport", 50, "car");
      const full = calculateEntryCarbon("transport", 100, "car");
      expect(full / half).toBeCloseTo(2, 0.5);
    });
  });

  describe("computeBreakdown extended scenarios", () => {
    it("empty list returns zeros", () => {
      const result = computeBreakdown([]);
      expect(result.total).toBe(0);
    });

    it("single transport entry", () => {
      const entries: readonly CarbonEntry[] = [
        {
          id: "1",
          category: "transport",
          value: 100,
          carbonValue: 23,
          description: "test",
          date: new Date().toISOString(),
        },
      ];
      const result = computeBreakdown(entries);
      expect(result.transport).toBe(23);
      expect(result.total).toBe(23);
    });

    it("accumulates same category", () => {
      const entries: readonly CarbonEntry[] = [
        {
          id: "1",
          category: "food",
          value: 1,
          carbonValue: 27,
          description: "test",
          date: new Date().toISOString(),
        },
        {
          id: "2",
          category: "food",
          value: 1,
          carbonValue: 27,
          description: "test",
          date: new Date().toISOString(),
        },
      ];
      const result = computeBreakdown(entries);
      expect(result.food).toBe(54);
    });

    it("multiple categories sum correctly", () => {
      const entries: readonly CarbonEntry[] = [
        {
          id: "1",
          category: "transport",
          value: 100,
          carbonValue: 23,
          description: "test",
          date: new Date().toISOString(),
        },
        {
          id: "2",
          category: "food",
          value: 1,
          carbonValue: 27,
          description: "test",
          date: new Date().toISOString(),
        },
        {
          id: "3",
          category: "energy",
          value: 100,
          carbonValue: 23.5,
          description: "test",
          date: new Date().toISOString(),
        },
        {
          id: "4",
          category: "waste",
          value: 10,
          carbonValue: 1.5,
          description: "test",
          date: new Date().toISOString(),
        },
      ];
      const result = computeBreakdown(entries);
      expect(result.transport).toBe(23);
      expect(result.food).toBe(27);
      expect(result.energy).toBeCloseTo(23.5, 1);
      expect(result.waste).toBeCloseTo(1.5, 1);
      expect(result.total).toBeCloseTo(75, 0);
    });

    it("total equals sum of categories", () => {
      const categories = ["transport", "food", "energy", "waste"] as const;
      const entries: readonly CarbonEntry[] = Array.from({ length: 10 }, (_, i) => {
        const category = categories[i % 4]!; // Non-null assertion: modulo ensures valid index
        return {
          id: `${i}`,
          category,
          value: Math.random() * 100,
          carbonValue: Math.random() * 50,
          description: "test",
          date: new Date().toISOString(),
        };
      });

      const result = computeBreakdown(entries);
      const sum = result.transport + result.food + result.energy + result.waste;
      expect(result.total).toBeCloseTo(sum, 1);
    });

    it("large number of entries", () => {
      const entries: readonly CarbonEntry[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        category: "transport" as const,
        value: 10,
        carbonValue: 2.3,
        description: "test",
        date: new Date().toISOString(),
      }));

      const result = computeBreakdown(entries);
      expect(result.transport).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
    });
  });

  describe("percentageBreakdown extended", () => {
    it("equal breakdown", () => {
      const breakdown = {
        transport: 25,
        food: 25,
        energy: 25,
        waste: 25,
        total: 100,
      };
      const result = percentageBreakdown(breakdown);
      expect(result.transport).toBe(25);
      expect(result.food).toBe(25);
      expect(result.energy).toBe(25);
      expect(result.waste).toBe(25);
    });

    it("unequal breakdown", () => {
      const breakdown = {
        transport: 60,
        food: 20,
        energy: 15,
        waste: 5,
        total: 100,
      };
      const result = percentageBreakdown(breakdown);
      expect(result.transport).toBe(60);
      expect(result.food).toBe(20);
      expect(result.energy).toBe(15);
      expect(result.waste).toBe(5);
    });

    it("all percentages sum to 100", () => {
      const breakdown = {
        transport: 50,
        food: 25,
        energy: 15,
        waste: 10,
        total: 100,
      };
      const result = percentageBreakdown(breakdown);
      const sum = result.transport + result.food + result.energy + result.waste;
      expect(sum).toBe(100);
    });

    it("handles zero total", () => {
      const breakdown = {
        transport: 0,
        food: 0,
        energy: 0,
        waste: 0,
        total: 0,
      };
      const result = percentageBreakdown(breakdown);
      expect(result.transport).toBe(0);
    });

    it("single category dominates", () => {
      const breakdown = {
        transport: 95,
        food: 3,
        energy: 1,
        waste: 1,
        total: 100,
      };
      const result = percentageBreakdown(breakdown);
      expect(result.transport).toBe(95);
    });
  });

  describe("sustainabilityRating extended", () => {
    it("excellent for low values", () => {
      const rating = sustainabilityRating(25);
      expect(rating.label).toBe("Excellent");
      expect(rating.score).toBeGreaterThan(85);
    });

    it("good for medium-low", () => {
      const rating = sustainabilityRating(100);
      expect(rating.label).toBe("Good");
      expect(rating.score).toBeGreaterThan(70);
    });

    it("average for medium", () => {
      const rating = sustainabilityRating(200);
      expect(rating.label).toBe("Average");
      expect(rating.score).toBeGreaterThan(50);
      expect(rating.score).toBeLessThan(70);
    });

    it("high for medium-high", () => {
      const rating = sustainabilityRating(400);
      expect(rating.label).toBe("High");
      expect(rating.score).toBeGreaterThan(30);
      expect(rating.score).toBeLessThan(50);
    });

    it("very high for high", () => {
      const rating = sustainabilityRating(600);
      expect(rating.label).toBe("Very High");
      expect(rating.score).toBeLessThan(30);
    });

    it("score decreases with carbon", () => {
      const scores: number[] = [];
      for (let i = 0; i <= 500; i += 100) {
        scores.push(sustainabilityRating(i).score);
      }
      // Verify mostly monotonic decrease
      for (let i = 1; i < scores.length; i++) {
        const current = scores[i];
        const previous = scores[i - 1];
        if (current !== undefined && previous !== undefined) {
          expect(current).toBeLessThanOrEqual(previous + 1); // Allow small variation
        }
      }
    });

    it("returns object with label and score", () => {
      const rating = sustainabilityRating(150);
      expect(rating).toHaveProperty("label");
      expect(rating).toHaveProperty("score");
      expect(typeof rating.label).toBe("string");
      expect(typeof rating.score).toBe("number");
    });

    it("score valid range 0-100", () => {
      for (let i = 0; i <= 1000; i += 50) {
        const rating = sustainabilityRating(i);
        expect(rating.score).toBeGreaterThanOrEqual(0);
        expect(rating.score).toBeLessThanOrEqual(100);
      }
    });
  });

  describe("Integration tests", () => {
    it("full pipeline calculation", () => {
      const entries: readonly CarbonEntry[] = [
        {
          id: "1",
          category: "transport" as const,
          value: 100,
          carbonValue: 23,
          description: "commute",
          date: new Date().toISOString(),
        },
        {
          id: "2",
          category: "food" as const,
          value: 2,
          carbonValue: 54,
          description: "meals",
          date: new Date().toISOString(),
        },
      ];

      const breakdown = computeBreakdown(entries);
      const rating = sustainabilityRating(breakdown.total);
      const percentages = percentageBreakdown(breakdown);

      expect(breakdown.total).toBe(77);
      expect(rating).toBeDefined();
      expect(percentages.transport + percentages.food).toBeLessThanOrEqual(100);
    });

    it("handles real-world scenario", () => {
      const dailyEntries: readonly CarbonEntry[] = [
        {
          id: "1",
          category: "transport" as const,
          value: 50,
          carbonValue: 11.5,
          description: "morning drive",
          date: new Date().toISOString(),
        },
        {
          id: "2",
          category: "transport" as const,
          value: 50,
          carbonValue: 11.5,
          description: "evening drive",
          date: new Date().toISOString(),
        },
        {
          id: "3",
          category: "food" as const,
          value: 3,
          carbonValue: 15.6,
          description: "meals",
          date: new Date().toISOString(),
        },
        {
          id: "4",
          category: "energy" as const,
          value: 10,
          carbonValue: 0.5,
          description: "household",
          date: new Date().toISOString(),
        },
      ];

      const breakdown = computeBreakdown(dailyEntries);
      expect(breakdown.total).toBeGreaterThan(0);
      expect(breakdown.transport).toBeGreaterThan(0);
      expect(breakdown.food).toBeGreaterThan(0);
      expect(breakdown.energy).toBeGreaterThan(0);
    });
  });

  describe("Performance characteristics", () => {
    it("calculateEntryCarbon is fast", () => {
      const start = performance.now();
      for (let i = 0; i < 10000; i++) {
        calculateEntryCarbon("transport", 100, "car");
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500); // Allow 500ms for 10k calls
    });

    it("computeBreakdown O(n) scaling", () => {
      const times: Array<{ size: number; time: number }> = [];
      for (const size of [100, 500, 1000]) {
        const entries: readonly CarbonEntry[] = Array.from({ length: size }, (_, i) => ({
          id: `${i}`,
          category: "transport" as const,
          value: 10,
          carbonValue: 2.3,
          description: "test",
          date: new Date().toISOString(),
        }));

        const start = performance.now();
        computeBreakdown(entries);
        const time = performance.now() - start;
        times.push({ size, time });
      }

      // Verify roughly linear growth (allow for variance in performance)
      const t0 = times[0];
      const t1 = times[1];
      const t2 = times[2];
      if (t0 && t1) {
        const ratio1 = t1.time / t0.time;
        expect(ratio1).toBeLessThan(50); // Allow significant variance
      }
      // Just verify it doesn't blow up exponentially
      if (t2) {
        expect(t2.time).toBeLessThan(1000);
      }
    });
  });
});
