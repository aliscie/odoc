import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";
import FileContentPage from "../../pages/FileContentPage";
import { filesReducer } from "../../redux/reducers/filesReducer";

// Mock store and initial state
const initialState = {
  filesState: {
    current_file: null,
    files_content: {},
    profile: { id: "user1" },
    files: [],
  },
};

const renderWithProviders = (
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: { filesState: filesReducer },
      preloadedState,
    }),
  } = {},
) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("FileContentPage", () => {
  test("renders 404 when no current_file", () => {
    renderWithProviders(<FileContentPage />, { preloadedState: initialState });
    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
  });

  test("renders Input and EditorComponent when current_file exists", () => {
    const stateWithFile = {
      ...initialState,
      filesState: {
        ...initialState.filesState,
        current_file: {
          id: "file1",
          name: "Test File",
          author: "user1",
          permission: {},
          users_permissions: [],
        },
        files_content: { file1: "Test content" },
      },
    };
    renderWithProviders(<FileContentPage />, { preloadedState: stateWithFile });

    expect(screen.getByPlaceholderText("Untitled")).toHaveValue("Test File");
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  test("dispatches update content action on editor change", () => {
    const dispatch = vi.fn();
    const stateWithFile = {
      ...initialState,
      filesState: {
        ...initialState.filesState,
        current_file: {
          id: "file1",
          name: "Test File",
          author: "user1",
          permission: {},
          users_permissions: [],
        },
        files_content: { file1: "Test content" },
      },
    };

    renderWithProviders(<FileContentPage />, {
      preloadedState: stateWithFile,
      store: configureStore({
        reducer: { filesState: filesReducer },
        preloadedState: stateWithFile,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            thunk: {
              dispatch,
            },
          }),
      }),
    });

    // Mock debounce
    fireEvent.change(screen.getByPlaceholderText("Untitled"), {
      target: { value: "Updated File Title" },
    });

    // Ensure that debounce was called correctly (this may need to be adapted)
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_FILE_TITLE",
      payload: { id: "file1", title: "Updated File Title" },
    });
  });

  test("prevents default on Enter keydown in Input", () => {
    const stateWithFile = {
      ...initialState,
      filesState: {
        ...initialState.filesState,
        current_file: {
          id: "file1",
          name: "Test File",
          author: "user1",
          permission: {},
          users_permissions: [],
        },
        files_content: { file1: "Test content" },
      },
    };
    renderWithProviders(<FileContentPage />, { preloadedState: stateWithFile });

    const input = screen.getByPlaceholderText("Untitled");
    const keydownEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
    });
    fireEvent(input, keydownEvent);
    expect(keydownEvent.defaultPrevented).toBe(true);
  });
});
