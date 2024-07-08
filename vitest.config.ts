import {defineConfig} from 'vitest/config';

export default defineConfig({
        test: {
            environment: 'jsdom',
            globals: true,
            threads: false,
            watch: true,
            "compilerOptions": {
                "types": ["vitest/globals"]
            },
            // include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
            // globalSetup: ["./src/frontend/tests/React/setup.ts"],
            setupFiles: './setup_tests.ts',
            // reporters: ["default", {
            //     async onWatcherRerun() {
            //         await teardown();
            //         await setup();
            //     }
            // }]
            setupFilesAfterEnv: [
                '@testing-library/jest-dom/extend-expect', // Ensure jest-dom extensions are loaded
                './src/frontend/setupTests.ts',
            ],
        }
    }
);