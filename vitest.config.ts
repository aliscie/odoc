import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    alias: {
      "@": "/src",
    },
    environment: "jsdom",
    globals: true,
    threads: false,
    watch: true,
    setupFiles:
      process.env.VITE_TEST_ENV === "backend" ? "./setup_tests.ts" : [],
    setupFilesAfterEnv: [
      "@testing-library/jest-dom/extend-expect",
      "./src/frontend/setupTests.ts",
    ],
  },
});
