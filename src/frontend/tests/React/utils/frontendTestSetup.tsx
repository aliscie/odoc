import { vi } from "vitest";

// Mock react-redux hooks at the top level without relying on other variables
vi.mock("react-redux", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

vi.mock("../../contexts/BackendContext", async (importOriginal) => {
  const { backendMocks } = await import("./backendMocks");
  const { authClientMock } = await import("./authClientMock");
  const actual = await importOriginal();
  return {
    ...actual,
    useBackendContext: () => ({
      backendActor: backendMocks,
      authClient: authClientMock,
      isAuthenticating: false,
      login: vi.fn(),
      logout: vi.fn(),
    }),
    BackendProvider: ({ children }) => <div>{children}</div>,
  };
});

vi.mock("@dfinity/auth-client", async () => {
  const { authClientMock } = await import("./authClientMock");
  return {
    AuthClient: authClientMock,
  };
});

vi.mock("indexedDB", async () => {
  const { indexedDBMock } = await import("./indexedDBMock");
  return {
    indexedDB: indexedDBMock,
  };
});

import React from "react";
import { BackendProvider } from "../../../contexts/BackendContext";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../../../redux/reducers";
import { initialState as filesInitialState } from "../../../redux/types/filesTypes";
import { initialChatsState as chatsInitialState } from "../../../redux/types/chatsTypes";
import { initialState as uiInitialState } from "../../../redux/types/uiTypes";
import { notificationInitialState } from "../../../redux/types/notificationTypes";

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
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
  }),
) => {
  return render(
    <Provider store={store}>
      <BackendProvider>
        <div>{component}</div>
      </BackendProvider>
    </Provider>,
  );
};

export default renderWithProviders;
