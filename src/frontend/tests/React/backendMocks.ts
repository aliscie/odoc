export const mockBackendActor = {
  delete_payment: vi.fn((id: string) => {
    return { Ok: {} };
  }),
};
