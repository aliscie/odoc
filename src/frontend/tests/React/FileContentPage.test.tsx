import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import FileContentPage from "../../pages/FileContentPage";
import renderWithProviders from "./testsWrapper";

// Mock store and initial state
const initialState = {
  filesState: {
    current_file: null,
    files_content: {},
    profile: { id: "user1" },
    files: [],
  },
};

describe("FileContentPage", () => {
  test("renders 404 when no current_file", () => {
    renderWithProviders(<FileContentPage />);
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
    renderWithProviders(<FileContentPage />);

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

    renderWithProviders(<FileContentPage />);

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
    renderWithProviders(<FileContentPage />);

    const input = screen.getByPlaceholderText("Untitled");
    const keydownEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
    });
    fireEvent(input, keydownEvent);
    expect(keydownEvent.defaultPrevented).toBe(true);
  });
});
