import type {StorybookConfig} from "@storybook/react-vite";

const config: StorybookConfig = {
    core: {
        builder: '@storybook/builder-vite', // 👈 The builder enabled here.
    },
    typescript: {
        // Enables the `react-docgen-typescript` parser.
        // See https://storybook.js.org/docs/api/main-config/main-config-typescript for more information about this option.
        reactDocgen: 'react-docgen-typescript',
    },
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-onboarding",
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
};
export default config;
