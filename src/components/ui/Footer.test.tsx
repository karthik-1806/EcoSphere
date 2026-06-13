import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer component", () => {
  it("renders company and resource links", () => {
    render(<Footer />);

    expect(screen.getByText(/EcoSphere Corp/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Assessment/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Privacy Policy/i })).toBeInTheDocument();
  });
});
