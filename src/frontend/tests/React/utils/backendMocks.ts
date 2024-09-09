export const backendMocks = {
  delete_payment: vi.fn((id: string) => {
    return { Ok: {} };
  }),

  deposit_usdt: vi.fn(async (amount: number) => {
    if (amount === 100) {
      return { Ok: 100 }; // Adjust based on the expected result structure
    }

    return { Err: "Deposit failed" };
  }),
};
