// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

// Determine setup files based on test environment
const setupFiles =
  process.env.VITE_TEST_ENV === "backend"
    ? ["./src/frontend/tests/backend/backend_unit_test_setup.ts"]
    : [];

export default defineConfig({
  test: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@frontend": path.resolve(__dirname, "src/frontend"),
      "@backend": path.resolve(__dirname, "src/backend"),
    },
    environment: "jsdom",
    globals: true,
    threads: false,
    watch: true,
    setupFiles,
    setupFilesAfterEnv: [
      "@testing-library/jest-dom/extend-expect",
      "./src/frontend/tests/React/testSetup.ts",
    ],
    include: ["**/*.{md,test,spec}.{js,jsx,ts,tsx}"],
    exclude: [
      "node_modules",
      "dist",
      ".idea",
      ".git",
      ".cache",
      ".dfx",
      "build",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/frontend/tests/setup.ts",
        ".dfx/",
        "dist/",
        "build/",
      ],
    },
    deps: {
      fallbackCJS: true, // Add this line
      inline: ["@dfinity/agent", "@dfinity/candid", "@dfinity/principal"],
    },
  },
});
