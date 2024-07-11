import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../redux/main';
import Deposit from './deposit';

/** @type {import('@storybook/react').Meta<typeof Deposit>} */
const meta = {
  title: 'Components/Deposit',
  component: Deposit,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;

/** @type {import('@storybook/react').StoryFn<typeof Deposit>} */
const Template = (args) => <Deposit {...args} />;

export const Default = Template.bind({});
Default.args = {
  // You can add props here if the component accepts any
};
