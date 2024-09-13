import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Deposit from "../../pages/profile/actions/Deposit";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../../contexts/BackendContext";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import renderWithProviders from "./testsWrapper";
import UserPage from "../../pages/user";
import React from "react";
import { FriendCom } from "../../pages/profile/friends";
import {Principal} from "@dfinity/principal";

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

describe("Deposit Component", () => {
  const mockDispatch = vi.fn();
  const mockEnqueueSnackbar = vi.fn();
  const mockBackendActor = {
    deposit_usdt: vi.fn(),
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

  it("handles a successful deposit", async () => {
    // Mock successful response
    mockBackendActor.deposit_usdt.mockResolvedValue({ Ok: 100 });

    // Mock useBackendContext to return the correct structure
    useBackendContext.mockReturnValue({
      backendActor: mockBackendActor,
      authClient: null,
      agent: null,
      isAuthenticating: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    let id = "z4gk5-xnlf4-xwuvn-txv6a-brmuq-hk36q-yzzqm-jeqs5-7dyrg-a2gii-2qe";
    // let user_history = {
    //   id: {
    //     __principal__: id,
    //   },
    //   // id: Principal.fromText(id)
    //   actions_rate: 0,
    //   balance: 0,
    //   rates_by_actions: [],
    //   name: "New",
    //   description: "safd",
    //   total_debt: 0,
    //   spent: 0,
    //   rates_by_others: [],
    //   users_rate: 0,
    //   users_interacted: 0,
    //   photo: {},
    //   debts: [],
    //   received: 0,
    // };
    let user = {
      id: Principal.fromText(id),
      actions_rate: 0,
      balance: 0,
      rates_by_actions: [],
      name: "New",
      description: "safd",
      total_debt: 0,
      spent: 0,
      rates_by_others: [],
      users_rate: 0,
      users_interacted: 0,
      photo: {},
      debts: [],
      received: 0,
    };

    renderWithProviders(<FriendCom
                        rate={0}
                        {...user}
                        labelId={"labelId"}
                    />);
  });
});
