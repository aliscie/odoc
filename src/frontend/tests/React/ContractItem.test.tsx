import { screen } from "@testing-library/react";
import ContractItem from "../../pages/profile/ContractItem";
import renderWithProviders from "./testSetup";
import { useBackendContext } from "../../contexts/BackendContext";
import { mockBackendActor } from "./mocks";

describe("ContractItem component", () => {
  const props = {
    id: "123",
    sender: "0xSender",
    receiver: "0xReceiver",
    amount: 100,
    date_created: "2022-01-01",
    canceled: false,
  };

  it("renders sender and receiver addresses", () => {
    useBackendContext.mockReturnValue({
      backendActor: mockBackendActor,
    });

    renderWithProviders(<ContractItem {...props} />);
    expect(screen.getByText(props.sender)).toBeInTheDocument();
    expect(screen.getByText(props.receiver)).toBeInTheDocument();
  });

  it("renders amount and date created", () => {
    renderWithProviders(<ContractItem {...props} />);
    expect(screen.getByText(`${props.amount} USDTs`)).toBeInTheDocument();
    expect(screen.getByText(props.date_created)).toBeInTheDocument();
  });

  it("renders canceled status", () => {
    renderWithProviders(<ContractItem {...props} canceled={true} />);
    expect(screen.getByText("Canceled")).toBeInTheDocument();
  });
});
