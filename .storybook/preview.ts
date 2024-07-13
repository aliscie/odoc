import type { Preview } from "@storybook/react";
// import '../setup_tests.ts';

const preview: Preview = {

  parameters: {
    // setupFiles: '../setup_tests.ts',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
