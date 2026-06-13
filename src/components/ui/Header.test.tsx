import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/")
}));

describe("Header component", () => {
  it("renders primary navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: /Assessment/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Launch Platform/i })).toBeInTheDocument();
  });
});
