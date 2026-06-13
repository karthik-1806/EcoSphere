import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { AppProvider } from "@/components/providers/AppProvider";
import { ChallengesPanel } from "./ChallengesPanel";

describe("ChallengesPanel", () => {
  it("creates and completes a challenge", () => {
    const { getByLabelText, getByText } = render(
      <AppProvider>
        <ChallengesPanel />
      </AppProvider>
    );

    const title = getByLabelText("Challenge title") as HTMLInputElement;
    const btn = getByText("Create Challenge") as HTMLButtonElement;

    fireEvent.change(title, { target: { value: "Meatless Week" } });
    fireEvent.click(btn);

    expect(getByText("Meatless Week")).toBeTruthy();
  });
});
