import React, { PropsWithChildren } from "react";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import rootReducer from "../../redux/reducers";
import { setupStore } from "../../redux/store";
import { BackendProvider } from "../../contexts/BackendContext";



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
//
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



export type RootState = ReturnType<typeof rootReducer>;

export interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: any;
}

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) {
  const {
    // preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(extendedRenderOptions.preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <BackendProvider>{children}</BackendProvider>
    </Provider>
  );

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export default renderWithProviders;
