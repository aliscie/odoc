export const backendMocks = {
  delete_payment: vi.fn((id: string) => {
    return { Ok: {} };
  }),
};
