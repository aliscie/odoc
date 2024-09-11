import { vi } from "vitest";
import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { initialState as filesInitialState } from "../../../redux/types/filesTypes";
import { initialChatsState as chatsInitialState } from "../../../redux/types/chatsTypes";
import { initialState as uiInitialState } from "../../../redux/types/uiTypes";
import { notificationInitialState } from "../../../redux/types/notificationTypes";
import rootReducer from "../../../redux/reducers";
import {BackendProvider} from "../../../contexts/BackendContext";

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
