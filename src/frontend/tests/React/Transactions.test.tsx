import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import TransactionHistory from "../../pages/profile/TransactionHistory";
import { vi } from "vitest";
import { filesReducer } from "../../redux/reducers/filesReducer";

// Mock store and initial state
const initialState = {
  filesState: {
    wallet: {
      exchanges: [
        { from: "0xSender1", to: "0xReceiver1", amount: 100 },
        { from: "0xSender2", to: "0xReceiver2", amount: 200 },
      ],
    },
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

describe("TransactionHistory", () => {
  test("renders a list of ContractItem components when exchanges are present", () => {
    renderWithProviders(<TransactionHistory />, {
      preloadedState: initialState,
    });

    const contractItems = screen.getAllByTestId("contract-item");
    expect(contractItems).toHaveLength(2);

    expect(contractItems[0]).toHaveTextContent("0xSender1");
    expect(contractItems[0]).toHaveTextContent("0xReceiver1");
    expect(contractItems[1]).toHaveTextContent("0xSender2");
    expect(contractItems[1]).toHaveTextContent("0xReceiver2");
  });

  test("renders an empty list when no exchanges are present", () => {
    const stateWithoutExchanges = {
      filesState: {
        wallet: {
          exchanges: [],
        },
      },
    };
    renderWithProviders(<TransactionHistory />, {
      preloadedState: stateWithoutExchanges,
    });

    expect(screen.queryByTestId("contract-item")).not.toBeInTheDocument();
  });

  test("renders nothing when wallet is undefined", () => {
    const stateWithUndefinedWallet = {
      filesState: {
        wallet: undefined,
      },
    };
    renderWithProviders(<TransactionHistory />, {
      preloadedState: stateWithUndefinedWallet,
    });

    expect(screen.queryByTestId("contract-item")).not.toBeInTheDocument();
  });
});
