export const authClientMock = {
  create: () => ({
    identity: { getPrincipal: () => "mock-principal" },
    isAuthenticated: () => Promise.resolve(true),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
  }),
};
