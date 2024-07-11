import { Preview } from "@storybook/react";
// import '../setup_tests.ts';

/** @type {import('@storybook/react').Preview} */
const preview = {
  parameters: {
    // setupFiles: '../setup_tests.ts',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ["autodocs"]
};

export default preview;
