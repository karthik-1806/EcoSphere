import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AssessmentPage from "./page";
import { AppProvider } from "@/components/providers/AppProvider";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe("Assessment page", () => {
  it("shows the assessment heading and form", () => {
    render(
      <AppProvider>
        <AssessmentPage />
      </AppProvider>
    );

    expect(screen.getByRole("heading", { name: /Carbon Assessment/i })).toBeInTheDocument();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });
});
