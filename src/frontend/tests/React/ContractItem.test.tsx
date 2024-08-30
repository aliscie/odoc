import { screen } from "@testing-library/react";
import ContractItem from "../../pages/profile/ContractItem";
import renderWithProviders from "./testSetup";
import "@testing-library/jest-dom";
import { waitFor } from "@testing-library/react";

describe("ContractItem component", () => {
  const props = {
    id: "123",
    sender: "0xSender",
    receiver: "0xReceiver",
    amount: 100,
    date_created: "2022-01-01",
    canceled: false,
  };

  it("renders sender and receiver addresses", async () => {
    renderWithProviders(<ContractItem {...props} />);
    await waitFor(() => {
      expect(screen.findByText(props.sender)).not.toBeNull();
      expect(screen.findByText(props.receiver)).not.toBeNull();
    });
  });

  it("renders amount and date created", async () => {
    renderWithProviders(<ContractItem {...props} />);
    await waitFor(() => {
      expect(screen.findByText(`${props.amount} USDTs`)).not.toBeNull();
      expect(screen.findByText(props.date_created)).not.toBeNull();
    });
  });

  it("renders canceled status", async () => {
    renderWithProviders(<ContractItem {...props} canceled={true} />);
    await waitFor(() => {
      expect(screen.getByText(/Sender: .*/).closest("li")).toHaveStyle(
        "textDecoration: line-through",
      );
      expect(screen.getByText(/Sender: .*/).closest("li")).toHaveStyle(
        "color: tomato",
      );
    });
  });
});
