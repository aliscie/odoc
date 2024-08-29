import React from "react";
import { BackendProvider } from "../../contexts/BackendContext";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../../redux/reducers";
import { initialState as filesInitialState } from "../../redux/types/filesTypes";
import { initialChatsState as chatsInitialState } from "../../redux/types/chatsTypes";
import { initialState as uiInitialState } from "../../redux/types/uiTypes";
import { notificationInitialState } from "../../redux/types/notificationTypes";
import { mockBackendActor } from "./mocks";

vi.mock("react-redux", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

vi.mock("../../contexts/BackendContext", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useBackendContext: () => ({
      backendActor: mockBackendActor,
    }),
    BackendProvider: ({ children, backendActor }) => (
      <div>
        {React.createElement(
          actual.BackendProvider,
          { value: backendActor },
          children,
        )}
      </div>
    ),
  };
});

const renderWithProviders = (
  component: React.ReactElement,
  store: ReturnType<typeof configureStore> = configureStore({
    reducer: rootReducer,
    preloadedState: {
      files: filesInitialState,
      chats: chatsInitialState,
      ui: uiInitialState,
      notification: notificationInitialState,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(), // Add middleware if needed
  }),
) => {
  if (!store) {
    throw new Error(
      "Store is required. Please provide a valid store instance.",
    );
  }

  return render(
    <Provider store={store}>
      <BackendProvider backendActor={mockBackendActor}>
        <div>{component}</div>
      </BackendProvider>
    </Provider>,
  );
};

export default renderWithProviders;
