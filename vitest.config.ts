import { defineConfig } from "vitest/config";
let setupFiles = [];
if (process.env.VITE_TEST_ENV == "backend") {
  setupFiles = ["./src/frontend/tests/backend/backend_unit_test_setup.ts"];
}
// console.log({ setupFiles, x: process.env.VITE_TEST_ENV });
export default defineConfig({
  test: {
    alias: {
      "@": "/src",
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
  },
});
