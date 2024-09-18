import { vi } from "vitest";
import React from "react";
import { BackendProvider } from "../../contexts/BackendContext";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

vi.mock("react-redux", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: () => {
      return {
        filesState: { profile: { id: "" }, friends: [] },
      };
    },
  };
});

vi.mock("../../contexts/BackendContext", async (importOriginal) => {
  const { backendMocks } = await import("./utils/backendMocks");
  const { authClientMock } = await import("./utils/authClientMock");
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
  const { authClientMock } = await import("./utils/authClientMock");
  return {
    AuthClient: authClientMock,
  };
});

vi.mock("indexedDB", async () => {
  const { indexedDBMock } = await import("./utils/indexedDBMock");
  return {
    indexedDB: indexedDBMock,
  };
});

const renderWithProviders = (
  component: React.ReactElement,
  // store: ReturnType<typeof configureStore> = configureStore({
  //   reducer: rootReducer,
  //   preloadedState: {
  //     files: { filesInitialState, profile: { id: "x" } },
  //     chats: chatsInitialState,
  //     ui: uiInitialState,
  //     notification: notificationInitialState,
  //   },
  //   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
  // }),
) => {
  const mockConfigStore = configureStore();
  const store: ReturnType<typeof configureStore> = mockConfigStore();
  return render(
    <Provider store={store}>
      <BackendProvider>
        <div>{component}</div>
      </BackendProvider>
    </Provider>,
  );
};

export default renderWithProviders;
