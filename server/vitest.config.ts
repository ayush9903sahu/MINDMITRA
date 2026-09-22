import { defineConfig } from "vitest/config.js";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./src/__tests__/setup.ts"],
    hookTimeout: 20000,
    testTimeout: 20000,
  },
});
