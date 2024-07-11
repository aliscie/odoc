import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { SnackbarProvider } from "notistack";
import { CustomContractComponent } from "./custom_contract";
import { filesReducer } from "../../../redux/files";
import { CustomContract } from "../../../../declarations/backend/backend.did";
import { randomString } from "../../../data_processing/data_samples";

const mockContract: CustomContract = {
  id: randomString(),
  name: "Sample Contract",
  contracts: [],
  promises: [],
  payments: [],
};

const store = configureStore({
  reducer: {
    filesReducer: filesReducer,
  },
  preloadedState: {
    filesReducer: {
      profile: { id: "profile-id", name: "Profile Name" },
      all_friends: [{ id: "friend-id", name: "Friend Name" }],
      wallet: { balance: 1000 },
      contracts: {
        [mockContract.id]: mockContract,
      },
      current_file: { author: "author-id" },
    },
  },
});

const withProviders = (Story) => (
  <Provider store={store}>
    <SnackbarProvider>
      <Story />
    </SnackbarProvider>
  </Provider>
);

// Story Configuration
export default {
  title: "CustomContractComponent",
  component: CustomContractComponent,
  decorators: [withProviders],
} as ComponentMeta<typeof CustomContractComponent>;

// Story Template
const Template: ComponentStory<typeof CustomContractComponent> = (args) => (
  <CustomContractComponent {...args} />
);

// Default Story
export const Default = Template.bind({});
Default.args = {
  contract: mockContract,
};
