import React from "react";
import { BackendProvider } from "../../contexts/BackendContext";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { createStore } from "redux";

const renderWithProviders = (
  component: React.ReactElement,
  store: ReturnType<typeof createStore> = createStore(() => ({})),
) => {
  if (!store) {
    throw new Error("Store is required");
  }
  return render(
    <Provider store={store}>
      <BackendProvider>{component}</BackendProvider>
    </Provider>,
  );
};

export { renderWithProviders };
