import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ContractItem from "../../pages/profile/ContractItem";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../../contexts/BackendContext";
import useGetUser from "../../utils/get_user_by_principal";
import renderWithProviders from "./utils/frontendTestSetup";

// Mock necessary hooks and functions
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("notistack", () => ({
  useSnackbar: vi.fn(),
}));

vi.mock("../../contexts/BackendContext", () => ({
  useBackendContext: vi.fn(),
}));

vi.mock("../../utils/get_user_by_principal", () => ({
  _esModule: true,
  default: vi.fn(),
}));

vi.mock("../../utils/time", () => ({
  default: vi.fn().mockReturnValue("formatted-date"),
}));

describe("ContractItem Component", () => {
  const mockDispatch = vi.fn();
  const mockEnqueueSnackbar = vi.fn();
  const mockCloseSnackbar = vi.fn();

  const mockGetUser = vi.fn();
  const mockBackendActor = {
    delete_payment: vi.fn(),
  };

  const props = {
    id: "123",
    sender: "0xSender",
    receiver: "0xReceiver",
    amount: 100,
    date_created: "2022-01-01",
    canceled: false,
  };

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useSnackbar.mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar,
      closeSnackbar: mockCloseSnackbar,
    });
    useBackendContext.mockReturnValue({
      backendActor: mockBackendActor,
      authClient: null,
      agent: null,
      isAuthenticating: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    useGetUser.mockReturnValue({
      getUser: mockGetUser,
    });
    useSelector.mockReturnValue({
      filesState: {
        profile: { id: "0xSender", name: "User" }, // Mock profile data
        all_friends: [
          { id: "0xReceiver", name: "Receiver" },
          // Add more friends if needed
        ],
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders sender, receiver, amount, and date created", async () => {
    mockGetUser.mockResolvedValue({ name: "User" });

    renderWithProviders(<ContractItem {...props} />);

    expect(await screen.findByText(props.sender)).toBeInTheDocument();
    expect(await screen.findByText(props.receiver)).toBeInTheDocument();
    expect(
      await screen.findByText(`${props.amount} USDTs`),
    ).toBeInTheDocument();
    expect(await screen.findByText("formatted-date")).toBeInTheDocument();
  });

  it("renders canceled status with correct style and report button", async () => {
    renderWithProviders(<ContractItem {...props} canceled={true} />);

    const listItem = await screen.findByText(`Sender: ${props.sender}`);
    expect(listItem).toHaveStyle("textDecoration: line-through");
    expect(listItem).toHaveStyle("color: tomato");

    expect(screen.getByRole("button", { name: /report/i })).toBeInTheDocument();
  });

  it("handles delete operation successfully", async () => {
    mockBackendActor.delete_payment.mockResolvedValue({ Ok: {} });

    renderWithProviders(<ContractItem {...props} />);

    const deleteButton = screen.getByRole("button", { name: /report/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockBackendActor.delete_payment).toHaveBeenCalledWith(props.id);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Deleted successfully", {
        variant: "success",
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "REMOVE_CONTRACT", id: props.id }),
      );
    });
  });

  it("handles delete operation failure", async () => {
    mockBackendActor.delete_payment.mockResolvedValue({ Err: "Error message" });

    renderWithProviders(<ContractItem {...props} />);

    const deleteButton = screen.getByRole("button", { name: /report/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockBackendActor.delete_payment).toHaveBeenCalledWith(props.id);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Error message", {
        variant: "error",
      });
    });
  });

  it("shows an error message if backendActor is not available", async () => {
    useBackendContext.mockReturnValue({
      backendActor: null,
      authClient: null,
      agent: null,
      isAuthenticating: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithProviders(<ContractItem {...props} />);

    const deleteButton = screen.getByRole("button", { name: /report/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "Backend actor is not available",
        { variant: "error" },
      );
    });
  });
});
