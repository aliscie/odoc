import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    alias: {
      "@": "/src",
    },
    environment: "jsdom",
    globals: true,
    threads: false,
    watch: true,
    setupFiles: ["./src/frontend/tests/backend/backend_unit_test_setup.ts"],
    setupFilesAfterEnv: [
      "@testing-library/jest-dom/extend-expect",
      // "./src/frontend/tests/React/testSetup.ts",
    ],
  },
});
