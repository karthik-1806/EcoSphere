import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFootprint } from "./useFootprint";
import { AppProvider } from "@/components/providers/AppProvider";
import { CARBON_MULTIPLIERS } from "@/lib/constants";
import type { CarbonCategory } from "@/types";

describe("useFootprint Custom Hook", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("throws an error when consumed outside of AppProvider context", () => {
    // Prevent vitest from logging the React warning on boundary test
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => renderHook(() => useFootprint())).toThrow(
      "useFootprint must be used within an AppProvider"
    );

    consoleErrorSpy.mockRestore();
  });

  describe("Carbon Math Calculations", () => {
    it("converts transport correctly based on sub-types", () => {
      const { result } = renderHook(() => useFootprint(), { wrapper: AppProvider });
      
      expect(result.current.calculateCarbon("transport", 100, "car")).toBe(
        Number((100 * CARBON_MULTIPLIERS.transport.car).toFixed(2))
      );
      expect(result.current.calculateCarbon("transport", 100, "flight")).toBe(
        Number((100 * CARBON_MULTIPLIERS.transport.flight).toFixed(2))
      );
      // Fallback to default car
      expect(result.current.calculateCarbon("transport", 100, "rocket")).toBe(
        Number((100 * CARBON_MULTIPLIERS.transport.car).toFixed(2))
      );
    });

    it("converts food correctly based on sub-types", () => {
      const { result } = renderHook(() => useFootprint(), { wrapper: AppProvider });
      
      expect(result.current.calculateCarbon("food", 5, "meat")).toBe(
        Number((5 * CARBON_MULTIPLIERS.food.meat).toFixed(2))
      );
      expect(result.current.calculateCarbon("food", 5, "vegan")).toBe(
        Number((5 * CARBON_MULTIPLIERS.food.vegan).toFixed(2))
      );
      // Fallback to default balanced
      expect(result.current.calculateCarbon("food", 5, "stone")).toBe(
        Number((5 * CARBON_MULTIPLIERS.food.balanced).toFixed(2))
      );
    });

    it("converts energy correctly based on sub-types", () => {
      const { result } = renderHook(() => useFootprint(), { wrapper: AppProvider });
      
      expect(result.current.calculateCarbon("energy", 200, "electricity")).toBe(
        Number((200 * CARBON_MULTIPLIERS.energy.electricity).toFixed(2))
      );
      expect(result.current.calculateCarbon("energy", 200, "gas")).toBe(
        Number((200 * CARBON_MULTIPLIERS.energy.gas).toFixed(2))
      );
      // Fallback to default electricity
      expect(result.current.calculateCarbon("energy", 200, "nuclear")).toBe(
        Number((200 * CARBON_MULTIPLIERS.energy.electricity).toFixed(2))
      );
    });

    it("converts waste correctly based on sub-types", () => {
      const { result } = renderHook(() => useFootprint(), { wrapper: AppProvider });
      
      expect(result.current.calculateCarbon("waste", 10, "recycled")).toBe(
        Number((10 * CARBON_MULTIPLIERS.waste.recycled).toFixed(2))
      );
      expect(result.current.calculateCarbon("waste", 10, "landfill")).toBe(
        Number((10 * CARBON_MULTIPLIERS.waste.landfill).toFixed(2))
      );
      // Fallback to default landfill
      expect(result.current.calculateCarbon("waste", 10, "unknown-waste")).toBe(
        Number((10 * CARBON_MULTIPLIERS.waste.landfill).toFixed(2))
      );
    });

    it("returns zero for invalid categories", () => {
      const { result } = renderHook(() => useFootprint(), { wrapper: AppProvider });
      expect(result.current.calculateCarbon("other" as CarbonCategory, 100)).toBe(0);
    });
  });

  describe("Filtering, Pagination & Breakdown calculations", () => {
    it("paginates and filters correctly", () => {
      const { result } = renderHook(() => useFootprint(), { wrapper: AppProvider });

      // Add 12 transport logs
      act(() => {
        for (let i = 1; i <= 12; i++) {
          result.current.addEntry({
            id: `a2e11ef6-750a-4f83-94a4-871f8a40dc${i.toString().padStart(2, "0")}`,
            category: "transport",
            value: 10,
            description: `Drive ${i}`,
            date: new Date().toISOString(),
            carbonValue: 1.8
          });
        }
      });

      expect(result.current.entries.length).toBe(12);
      expect(result.current.paginatedEntries.length).toBe(10);
      expect(result.current.totalPages).toBe(2);

      // Move to page 2
      act(() => {
        result.current.changePage(2);
      });
      expect(result.current.currentPage).toBe(2);
      expect(result.current.paginatedEntries.length).toBe(2);

      // Bound page checking
      act(() => {
        result.current.changePage(100);
      });
      expect(result.current.currentPage).toBe(2);

      act(() => {
        result.current.changePage(-5);
      });
      expect(result.current.currentPage).toBe(1);

      // Filter by category
      act(() => {
        result.current.setSelectedCategory("food");
      });
      expect(result.current.paginatedEntries.length).toBe(0);
      expect(result.current.totalPages).toBe(1);

      // Reset filter
      act(() => {
        result.current.setSelectedCategory("all");
      });
      expect(result.current.paginatedEntries.length).toBe(10);
    });

    it("calculates breakdown values and insights dynamic rules correctly", () => {
      const { result } = renderHook(() => useFootprint(), { wrapper: AppProvider });

      // Empty states show welcome insight
      expect(result.current.breakdown.total).toBe(0);
      expect(result.current.insights.length).toBe(1);
      expect(result.current.insights[0]?.title).toBe("Welcome to EcoSphere!");

      // Add high transport entry
      act(() => {
        result.current.addEntry({
          id: "a2e11ef6-750a-4f83-94a4-871f8a40dc91",
          category: "transport",
          value: 250,
          description: "Flight to NY",
          date: new Date().toISOString(),
          carbonValue: 60.0
        });
      });

      // Add high food entry
      act(() => {
        result.current.addEntry({
          id: "a2e11ef6-750a-4f83-94a4-871f8a40dc92",
          category: "food",
          value: 10,
          description: "Steak dinner week",
          date: new Date().toISOString(),
          carbonValue: 72.0
        });
      });

      // Add high energy entry
      act(() => {
        result.current.addEntry({
          id: "a2e11ef6-750a-4f83-94a4-871f8a40dc93",
          category: "energy",
          value: 300,
          description: "AC usage",
          date: new Date().toISOString(),
          carbonValue: 114.0
        });
      });

      // Add waste entry
      act(() => {
        result.current.addEntry({
          id: "a2e11ef6-750a-4f83-94a4-871f8a40dc94",
          category: "waste",
          value: 5,
          description: "Trash",
          date: new Date().toISOString(),
          carbonValue: 6.0
        });
      });

      expect(result.current.breakdown.transport).toBe(60.0);
      expect(result.current.breakdown.food).toBe(72.0);
      expect(result.current.breakdown.energy).toBe(114.0);
      expect(result.current.breakdown.waste).toBe(6.0);
      expect(result.current.breakdown.total).toBe(252.0);

      // Verify rule engine triggered recommendations
      const insightTitles = result.current.insights.map((ins) => ins.title);
      expect(insightTitles).toContain("High Transportation Footprint");
      expect(insightTitles).toContain("Reduce Diet Footprint");
      expect(insightTitles).toContain("Energy Efficiency Tip");
    });

    it("calculates goal progress dynamically based on carbon breakdown", () => {
      const { result } = renderHook(() => useFootprint(), { wrapper: AppProvider });

      // Create a goal for transport
      act(() => {
        result.current.addGoal({
          id: "g-transport-1",
          title: "Reduce Transport",
          category: "transport",
          targetValue: 100,
          progress: 0,
          active: true,
          createdAt: new Date().toISOString()
        });
      });

      // Initially, since transport emissions is 0, progress should be 0
      expect(result.current.goals[0]?.progress).toBe(0);

      // Add a transport entry of 30 kg CO2e
      act(() => {
        result.current.addEntry({
          id: "e-transport-1",
          category: "transport",
          value: 166.67,
          description: "Commute",
          date: new Date().toISOString(),
          carbonValue: 30.0
        });
      });

      // Progress should now be 30%
      expect(result.current.goals.find(g => g.id === "g-transport-1")?.progress).toBe(30);

      // Add another transport entry of 80 kg CO2e (total 110 kg CO2e, exceeding targetValue 100)
      act(() => {
        result.current.addEntry({
          id: "e-transport-2",
          category: "transport",
          value: 444.44,
          description: "Long drive",
          date: new Date().toISOString(),
          carbonValue: 80.0
        });
      });

      // Progress should be capped at 100%
      expect(result.current.goals.find(g => g.id === "g-transport-1")?.progress).toBe(100);
    });
  });
});
