import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**"],
    coverage: {
      provider: "v8",
      include: [
        "src/shared/hooks/**",
        "src/shared/lib/format-text.tsx",
        "src/shared/lib/anchor-scroll.tsx",
        "src/features/timeline/presentation/lib/**",
        "src/features/skills/application/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
