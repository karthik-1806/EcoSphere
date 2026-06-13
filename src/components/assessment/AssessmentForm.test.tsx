import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { AppProvider } from "@/components/providers/AppProvider";
import { AssessmentForm } from "./AssessmentForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe("AssessmentForm interactions", () => {
  it("renders presets and updates live preview and submits", async () => {
    render(
      <AppProvider>
        <AssessmentForm />
      </AppProvider>
    );

    // Preset button for transport should exist
    const preset = screen.getByRole("button", { name: /Short drive/i });
    expect(preset).toBeTruthy();

    // Click preset -> updates Amount display
    fireEvent.click(preset);
    const amountValue = screen.getByText("5");
    expect(amountValue).toBeTruthy();

    // Live preview shows carbon impact (non-empty)
    const preview = screen.getByText(/Estimated Carbon Impact/i);
    expect(preview).toBeTruthy();

    // Submit the form using aria-label
    const submit = screen.getByRole("button", { name: /Submit carbon log/i });
    fireEvent.click(submit);

    // After submit, amount resets to default 10
    const amountAfter = await screen.findByText("10");
    expect(amountAfter).toBeTruthy();
  });
});
