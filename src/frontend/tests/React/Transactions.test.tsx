import React from "react";
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import TransactionHistory from "../../pages/profile/TransactionHistory";
import renderWithProviders from "./testsWrapper";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("notistack", () => ({
  useSnackbar: vi.fn(),
}));

// Mock BackendContext
vi.mock("../../contexts/BackendContext", () => ({
  useBackendContext: vi.fn(() => ({
    backendActor: {},
  })),
}));

describe("TransactionHistory", () => {
  const mockUseSelector = vi.fn();
  const mockEnqueueSnackbar = vi.fn();

  beforeEach(() => {
    useSelector.mockClear();
    useSnackbar.mockClear();
  });

  test("renders a list of ContractItem components when exchanges are present", () => {
    const mockExchanges = [
      { from: "0xSender1", to: "0xReceiver1" },
      { from: "0xSender2", to: "0xReceiver2" },
    ];
    useSelector.mockReturnValue({ wallet: { exchanges: mockExchanges } });
    renderWithProviders(<TransactionHistory />);

    const contractItems = screen.getAllByTestId("contract-item");
    expect(contractItems).toHaveLength(2);

    expect(contractItems[0]).toHaveTextContent("0xSender1");
    expect(contractItems[0]).toHaveTextContent("0xReceiver1");
    expect(contractItems[1]).toHaveTextContent("0xSender2");
    expect(contractItems[1]).toHaveTextContent("0xReceiver2");
  });

  test("renders an empty list when no exchanges are present", () => {
    useSelector.mockReturnValue({ wallet: { exchanges: [] } });
    renderWithProviders(<TransactionHistory />);

    expect(screen.queryByTestId("contract-item")).not.toBeInTheDocument();
  });

  test("renders nothing when wallet is undefined", () => {
    useSelector.mockReturnValue({ wallet: undefined });
    renderWithProviders(<TransactionHistory />);

    expect(screen.queryByTestId("contract-item")).not.toBeInTheDocument();
  });
});
