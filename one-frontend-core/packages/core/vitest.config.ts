import { defineConfig } from "vitest/config";

// Unit test runner for the core package. jsdom backs the URL and cookie
// helpers inside ObjectHelper.
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/__tests__/*.{test,spec}.ts"],
  },
});
