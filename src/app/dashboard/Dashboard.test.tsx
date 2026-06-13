import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";
import { AppProvider } from "@/components/providers/AppProvider";

describe("Dashboard page", () => {
  it("renders score and breakdown list", () => {
    render(
      <AppProvider>
        <DashboardPage />
      </AppProvider>
    );

    expect(screen.getByText(/Aggregate Carbon Footprint Index/i)).toBeTruthy();
    const breakdownHeadings = screen.getAllByText(/Emission Mass Allocation/i);
    expect(breakdownHeadings.length).toBeGreaterThanOrEqual(1);
    // Ensure at least one category appears in the list
    const transportMatches = screen.getAllByText(/Transport/i);
    expect(transportMatches.length).toBeGreaterThanOrEqual(1);
  });
});
