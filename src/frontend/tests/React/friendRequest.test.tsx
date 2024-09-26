import { useBackendContext } from "../../contexts/BackendContext";
import { afterEach, describe, it, vi } from "vitest";
import renderWithProviders, { ExtendedRenderOptions } from "./testsWrapper";
import { FriendCom } from "../../pages/profile/friends";
import { Principal } from "@dfinity/principal";

// Mock BackendContext
vi.mock("../../contexts/BackendContext", () => ({
  useBackendContext: vi.fn(),
}));

describe("Deposit Component", () => {
  const mockDispatch = vi.fn();
  // const mockSelector̦= vi.fn();
  const mockEnqueueSnackbar = vi.fn();
  const mockBackendActor = {
    deposit_usdt: vi.fn(),
  };

  // beforeEach(() => {
  //   useSelector.mockImplementation((selectorFn) =>
  //     selectorFn({
  //       filesState: {
  //         profile: { id: "1", name: "Test User" }, // Mock profile data
  //         friends: [
  //           {
  //             receiver: { id: "2", name: "Friend 1", confirmed: false },
  //             sender: { id: "1", name: "Test User" },
  //             confirmed: false,
  //           },
  //           {
  //             receiver: { id: "3", name: "Friend 2", confirmed: true },
  //             sender: { id: "1", name: "Test User" },
  //             confirmed: true,
  //           },
  //         ],
  //       },
  //     }),
  //   );
  // });

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

    // renderWithProviders(<Deposit />);
    global.URL.createObjectURL = vi.fn();
    const preloadedState: ExtendedRenderOptions = {
      preloadedState: {
        filesState: {
          profile: { id: "test", name: "test" },
          friends: [],
        },
      },
    };

    renderWithProviders(
      <FriendCom rate={0} {...user} labelId={"labelId"} />,
      preloadedState,
    );

    //   const depositButton = screen.getByRole("button", { name: /deposit/i });
    //   fireEvent.click(depositButton);
    //
    //   // Wait for async operations to complete
    //   await waitFor(() => {
    //     expect(mockBackendActor.deposit_usdt).toHaveBeenCalledWith(100);
    //     expect(mockDispatch).toHaveBeenCalledWith(
    //       expect.objectContaining({ type: "UPDATE_BALANCE", balance: 100 }),
    //     );
    //     expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
    //   });
  });
});
