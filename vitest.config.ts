import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100
      },
      exclude: [
        "node_modules/**",
        ".next/**",
        "out/**",
        "vitest.config.ts",
        "tailwind.config.cjs",
        "postcss.config.cjs",
        "eslint.config.mjs",
        "src/test/setup.ts",
        "src/types/**",
        "next-env.d.ts"
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
