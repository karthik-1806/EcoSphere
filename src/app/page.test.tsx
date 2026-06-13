import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home Page Component", () => {
  it("should render page title and subtitle", () => {
    render(<Home />);
    expect(screen.getByText(/EcoSphere/i)).toBeInTheDocument();
    expect(screen.getByText(/Carbon Intelligence/i)).toBeInTheDocument();
  });
});
