import { fireEvent, screen, waitFor } from "@testing-library/react";
import Deposit from "../../pages/profile/actions/Deposit";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../../contexts/BackendContext";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import renderWithProviders from "./utils/frontendTestSetup";
import UserPage from "../../pages/user";
import {
  ActionRating,
  Rating,
  UserProfile,
} from "../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import TestWrapper from "./utils/tests_wrapper";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("notistack", () => ({
  useSnackbar: vi.fn(),
}));

// Mock BackendContext
vi.mock("../../contexts/BackendContext", () => ({
  useBackendContext: vi.fn(),
}));

vi.mock("@dfinity/principal", () => ({
  Principal: {
    fromText: vi.fn().mockReturnValue({}),
  },
}));

describe("Deposit Component", () => {
  const mockDispatch = vi.fn();
  const mockEnqueueSnackbar = vi.fn();
  const mockBackendActor = {
    get_user_profile: vi.fn(),
  };

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useSnackbar.mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar,
      closeSnackbar: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Re-render component after click on send friend request", async () => {
    // Mock successful response
    let id = "trp5a-o2ilp-mov7c-jzihs-aepzm-ipkwf-msvc-rrrvz-p3jof-k4x7v-zae";
    let user: UserProfile = {
      id: Principal.fromText(id),
      actions_rate: 0,
      balance: 100,
      rates_by_actions: [],
      name: "John",
      description: "any",
      total_debt: 100,
      spent: 10,
      rates_by_others: [],
      users_rate: 0,
      users_interacted: 0,
      photo: [],
      debts: [],
      received: 0,
    };
    mockBackendActor.get_user_profile({ Ok: user });

    // Mock useBackendContext to return the correct structure
    useBackendContext.mockReturnValue({
      backendActor: mockBackendActor,
      authClient: null,
      agent: null,
      isAuthenticating: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const mockSearchValue = `?user_id=${id}`;
    delete window.location;
    window.location = { search: mockSearchValue } as any;
    renderWithProviders(
      <TestWrapper>
        <UserPage />
      </TestWrapper>,
    );
  });

  it("does nothing if backendActor is not available", () => {});
});
