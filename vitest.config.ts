import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    esbuild: {
      jsxInject: `import React from 'react'`,
    },
    environment: "jsdom",
    globals: true,
    threads: false,
    watch: true,
    compilerOptions: {
      types: ["vitest/globals"],
    },
    // include: ['src/*/.{test,spec}.{js,ts,jsx,tsx}'],
    // globalSetup: ["./src/frontend/tests/React/setup.ts"],

    setupFiles:
      process.env.VITE_TEST_ENV === "backend"
        ? "./src/frontend/tests/backend/backend_unit_test_setup.ts"
        : [],
    // reporters: ["default", {
    //     async onWatcherRerun() {
    //         await teardown();
    //         await setup();
    //     }
    // }]
    setupFilesAfterEnv: [
      "@testing-library/jest-dom/extend-expect", // Ensure jest-dom extensions are loaded
      "./src/frontend/tests/React/utils/frontendTestSetup.tsx",
    ],
  },
});
