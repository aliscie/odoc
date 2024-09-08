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
      /* This line of code is a conditional statement that checks if the value of the environment variable
   `VITE_TEST_ENV` is equal to "backend". If the condition is true, it includes the file
   "./setup_tests.ts" in the setupFiles array. If the condition is false, it includes an empty array
   in the setupFiles array. */
      process.env.VITE_TEST_ENV === "backend" ? "./setup_tests.ts" : [],
    setupFilesAfterEnv: [
      "@testing-library/jest-dom/extend-expect",
      "./src/frontend/setupTests.ts",
    ],
  },
});
