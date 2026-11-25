import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Unit test runner for the template. jsdom backs both service tests
// (DOM elements) and component tests (rendering). The @core alias mirrors
// vite.config.ts so tests resolve the vendored core barrel the same way.
export default defineConfig({
  resolve: {
    alias: {
      "@core": fileURLToPath(new URL("./src/core/index.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/__tests__/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["src/test/setup.ts"],
  },
});
