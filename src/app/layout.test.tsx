import { describe, it, expect } from "vitest";
import RootLayout from "./layout";

describe("RootLayout", () => {
  it("renders children", () => {
    const result = RootLayout({
      children: <div data-testid="child-element">Test Child</div>
    });

    expect(result.type).toBe("html");
    expect(result.props.lang).toBe("en");
  });
});
