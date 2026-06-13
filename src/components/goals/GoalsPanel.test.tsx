import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { AppProvider } from "@/components/providers/AppProvider";
import { GoalsPanel } from "./GoalsPanel";

describe("GoalsPanel", () => {
  it("creates a goal and lists it", () => {
    const { getByLabelText, getByText } = render(
      <AppProvider>
        <GoalsPanel />
      </AppProvider>
    );

    const title = getByLabelText("Goal title") as HTMLInputElement;
    const target = getByLabelText("Target value") as HTMLInputElement;
    const btn = getByText("Create Goal") as HTMLButtonElement;

    fireEvent.change(title, { target: { value: "Test Goal" } });
    fireEvent.change(target, { target: { value: "150" } });
    fireEvent.click(btn);

    expect(getByText("Test Goal")).toBeTruthy();
  });
});
