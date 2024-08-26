import React from "react";
import { render, screen } from "@testing-library/react";
import TransactionHistory from "../../pages/profile/TransactionHistory";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { BackendProvider } from "../../contexts/BackendContext";
const mockTransactionRecords = [
  {
    from: "sender1",
    to: "receiver1",
    amount: 100,
  },
  {
    from: "sender2",
    to: "receiver2",
    amount: 200,
  },
];

const mockStore = createStore(() => ({
  filesState: {
    wallet: {
      exchanges: mockTransactionRecords,
    },
  },
}));

describe("TransactionHistory component", () => {
  it("renders transaction records", () => {
    render(
      <Provider store={mockStore}>
        <TransactionHistory />
      </Provider>,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("sender1")).toBeInTheDocument();
    expect(screen.getByText("receiver1")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("sender2")).toBeInTheDocument();
    expect(screen.getByText("receiver2")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("renders empty list when no transaction records", () => {
    const emptyStore = createStore(() => ({
      filesState: {
        wallet: {
          exchanges: [],
        },
      },
    }));

    render(
      <Provider store={emptyStore}>
        <TransactionHistory />
      </Provider>,
    );

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
