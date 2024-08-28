import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Deposit from "../../pages/profile/actions/Deposit";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../../contexts/BackendContext";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import renderWithProviders from "./testSetup";

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

    renderWithProviders(<Deposit />);

    const depositButton = screen.getByRole("button", { name: /deposit/i });
    fireEvent.click(depositButton);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockBackendActor.deposit_usdt).toHaveBeenCalledWith(100);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "UPDATE_BALANCE", balance: 100 }),
      );
      expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
    });
  });

  it("handles a failed deposit", async () => {
    // Mock failed response
    mockBackendActor.deposit_usdt.mockResolvedValue({
      Err: "Insufficient funds",
    });

    // Mock useBackendContext to return the correct structure
    useBackendContext.mockReturnValue({
      backendActor: mockBackendActor,
      authClient: null,
      agent: null,
      isAuthenticating: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithProviders(<Deposit />);

    const depositButton = screen.getByRole("button", { name: /deposit/i });
    fireEvent.click(depositButton);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockBackendActor.deposit_usdt).toHaveBeenCalledWith(100);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Insufficient funds", {
        variant: "error",
      });
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it("does nothing if backendActor is not available", () => {
    // Mock useBackendContext to return a structure where backendActor is null
    useBackendContext.mockReturnValue({
      backendActor: null,
      authClient: null,
      agent: null,
      isAuthenticating: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithProviders(<Deposit />);

    const depositButton = screen.getByRole("button", { name: /deposit/i });
    fireEvent.click(depositButton);

    // Assert that deposit_usdt was not called
    expect(mockBackendActor.deposit_usdt).not.toHaveBeenCalled();
    // Assert that neither dispatch nor enqueueSnackbar were called
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
  });
});
