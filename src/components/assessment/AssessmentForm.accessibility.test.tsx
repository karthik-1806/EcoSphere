import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AssessmentForm } from "./AssessmentForm";
import { FootprintDispatchContext } from "@/components/providers/AppProvider";
import type { FootprintDispatch } from "@/components/providers/AppProvider";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe("AssessmentForm accessibility and sanitization", () => {
  it("renders accessible form elements and aria attributes", () => {
    const mockDispatch: FootprintDispatch = {
      addEntry: vi.fn(),
      deleteEntry: vi.fn(),
      updateTarget: vi.fn(),
      updateSettings: vi.fn(),
      resetAll: vi.fn(),
      addGoal: vi.fn(),
      toggleGoalActive: vi.fn(),
      addChallenge: vi.fn(),
      completeChallenge: vi.fn()
    };

    render(
      <FootprintDispatchContext.Provider value={mockDispatch}>
        <AssessmentForm />
      </FootprintDispatchContext.Provider>
    );

    // form presence by aria-label
    expect(screen.getByLabelText("Carbon assessment form")).toBeDefined();

    // quick presets present
    expect(screen.getByText("Quick Presets")).toBeDefined();

    // slider exists
    expect(screen.getByLabelText("Amount slider")).toBeInTheDocument();

    // live status region announces preview values
    expect(screen.getByRole("status")).toHaveTextContent(/Estimated Carbon Impact/i);
  });

  it("passes axe accessibility checks", async () => {
    const mockDispatch: FootprintDispatch = {
      addEntry: vi.fn(),
      deleteEntry: vi.fn(),
      updateTarget: vi.fn(),
      updateSettings: vi.fn(),
      resetAll: vi.fn(),
      addGoal: vi.fn(),
      toggleGoalActive: vi.fn(),
      addChallenge: vi.fn(),
      completeChallenge: vi.fn()
    };

    const { container } = render(
      <FootprintDispatchContext.Provider value={mockDispatch}>
        <AssessmentForm />
      </FootprintDispatchContext.Provider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("supports keyboard focus and activation for assessment controls", () => {
    const mockDispatch: FootprintDispatch = {
      addEntry: vi.fn(),
      deleteEntry: vi.fn(),
      updateTarget: vi.fn(),
      updateSettings: vi.fn(),
      resetAll: vi.fn(),
      addGoal: vi.fn(),
      toggleGoalActive: vi.fn(),
      addChallenge: vi.fn(),
      completeChallenge: vi.fn()
    };

    render(
      <FootprintDispatchContext.Provider value={mockDispatch}>
        <AssessmentForm />
      </FootprintDispatchContext.Provider>
    );

    const energyTab = screen.getByRole("tab", { name: /energy category/i });
    energyTab.focus();
    expect(energyTab).toHaveFocus();
    fireEvent.keyDown(energyTab, { key: "Enter", code: "Enter", charCode: 13 });
    expect(energyTab).toHaveAttribute("aria-selected", "true");

    const heaterPreset = screen.getByRole("button", { name: /Preset: Heater \(1kWh\)/i });
    heaterPreset.focus();
    expect(heaterPreset).toHaveFocus();
    fireEvent.keyDown(heaterPreset, { key: " ", code: "Space", charCode: 32 });
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("sanitizes description and calls addEntry on submit", () => {
    const mockDispatch: FootprintDispatch = {
      addEntry: vi.fn(),
      deleteEntry: vi.fn(),
      updateTarget: vi.fn(),
      updateSettings: vi.fn(),
      resetAll: vi.fn(),
      addGoal: vi.fn(),
      toggleGoalActive: vi.fn(),
      addChallenge: vi.fn(),
      completeChallenge: vi.fn()
    };

    render(
      <FootprintDispatchContext.Provider value={mockDispatch}>
        <AssessmentForm />
      </FootprintDispatchContext.Provider>
    );

    const desc = screen.getByLabelText("Description input");
    fireEvent.change(desc, { target: { value: "<script>alert(1)</script>" } });

    const submit = screen.getByRole("button", { name: /Submit carbon log/i });
    fireEvent.click(submit);

    expect(mockDispatch.addEntry).toHaveBeenCalled();
    const mockFn = vi.mocked(mockDispatch.addEntry);
    const entry = mockFn.mock.calls[0]?.[0];
    expect(entry?.description).not.toContain("<script>");
    expect(entry?.description).toContain("&lt;script&gt;");
  });

  it("handles category tabs, slider and validation error", () => {
    const mockDispatch: FootprintDispatch = {
      addEntry: vi.fn(),
      deleteEntry: vi.fn(),
      updateTarget: vi.fn(),
      updateSettings: vi.fn(),
      resetAll: vi.fn(),
      addGoal: vi.fn(),
      toggleGoalActive: vi.fn(),
      addChallenge: vi.fn(),
      completeChallenge: vi.fn()
    };

    render(
      <FootprintDispatchContext.Provider value={mockDispatch}>
        <AssessmentForm />
      </FootprintDispatchContext.Provider>
    );

    // Click on a category tab (using aria-label)
    const energyTab = screen.getByRole("tab", { name: /energy category/i });
    fireEvent.click(energyTab);
    
    // Option input and slider
    const option = screen.getByLabelText("Option input");
    fireEvent.change(option, { target: { value: "electricity" } });

    const slider = screen.getByLabelText("Amount slider");
    fireEvent.change(slider, { target: { value: "0" } });

    // Submitting with value 0 should trigger validation error
    const submit = screen.getByRole("button", { name: /Submit carbon log/i });
    fireEvent.click(submit);

    // Expect an alert role to appear
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
  });
});
