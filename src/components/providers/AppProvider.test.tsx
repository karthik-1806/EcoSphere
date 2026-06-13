import  { useContext } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
  AppProvider,
  FootprintStateContext,
  FootprintDispatchContext
} from "./AppProvider";
import { CarbonEntry, CarbonTarget } from "@/types";

// Helper component to verify state and invoke mutations
function TestConsumer() {
  const state = useContext(FootprintStateContext);
  const dispatch = useContext(FootprintDispatchContext);

  if (!state || !dispatch) {
    return <div data-testid="error">Context Missing</div>;
  }

  const handleAdd = () => {
    const newEntry: CarbonEntry = {
      id: "a2e11ef6-750a-4f83-94a4-871f8a40dc49",
      category: "transport",
      value: 10,
      description: "Commute",
      date: "2026-06-10T20:30:44.000Z",
      carbonValue: 1.8
    };
    dispatch.addEntry(newEntry);
  };

  const handleUpdateTarget = () => {
    const target: CarbonTarget = {
      targetValue: 300,
      category: "total",
      interval: "weekly"
    };
    dispatch.updateTarget(target);
  };

  return (
    <div>
      <div data-testid="entry-count">{state.entries.length}</div>
      <div data-testid="theme">{state.settings.theme}</div>
      <div data-testid="weekly-total-target">
        {state.targets.find((t) => t.category === "total")?.targetValue}
      </div>
      <button data-testid="btn-add" onClick={handleAdd}>
        Add Entry
      </button>
      <button data-testid="btn-delete" onClick={() => dispatch.deleteEntry("a2e11ef6-750a-4f83-94a4-871f8a40dc49")}>
        Delete Entry
      </button>
      <button data-testid="btn-target" onClick={handleUpdateTarget}>
        Update Target
      </button>
      <button data-testid="btn-settings" onClick={() => dispatch.updateSettings({ theme: "dark" })}>
        Update Settings
      </button>
      <button data-testid="btn-reset" onClick={dispatch.resetAll}>
        Reset
      </button>
    </div>
  );
}

describe("AppProvider Context Provider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("provides initialized values and supports mutations", async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    expect(screen.getByTestId("entry-count").textContent).toBe("0");
    expect(screen.getByTestId("theme").textContent).toBe("system");
    expect(screen.getByTestId("weekly-total-target").textContent).toBe("400");

    // Add entry
    await act(async () => {
      screen.getByTestId("btn-add").click();
    });
    expect(screen.getByTestId("entry-count").textContent).toBe("1");

    // Update target
    await act(async () => {
      screen.getByTestId("btn-target").click();
    });
    expect(screen.getByTestId("weekly-total-target").textContent).toBe("300");

    // Update settings
    await act(async () => {
      screen.getByTestId("btn-settings").click();
    });
    expect(screen.getByTestId("theme").textContent).toBe("dark");

    // Delete entry
    await act(async () => {
      screen.getByTestId("btn-delete").click();
    });
    expect(screen.getByTestId("entry-count").textContent).toBe("0");

    // Reset all
    await act(async () => {
      screen.getByTestId("btn-reset").click();
    });
    expect(screen.getByTestId("theme").textContent).toBe("system");

    // Wait for the requestIdleCallback setTimeout (1ms delay) to run in real time
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 15));
    });
  });

  it("renders error if consumed outside of provider", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<TestConsumer />);
    expect(screen.getByTestId("error").textContent).toBe("Context Missing");
    errorSpy.mockRestore();
  });

  it("handles fallback if requestIdleCallback is not available", () => {
    const originalIdle = window.requestIdleCallback;
    (window as { requestIdleCallback?: unknown }).requestIdleCallback = undefined;

    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    // Call add
    act(() => {
      screen.getByTestId("btn-add").click();
    });

    expect(screen.getByTestId("entry-count").textContent).toBe("1");

    // Restore
    (window as { requestIdleCallback?: unknown }).requestIdleCallback = originalIdle;
  });
});
