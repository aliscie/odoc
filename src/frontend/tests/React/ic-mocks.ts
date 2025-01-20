// src/frontend/tests/ic-mocks.ts
import { vi } from 'vitest';

// Mock dfinity agent
vi.mock('@dfinity/agent', () => ({
  Actor: {
    createActor: vi.fn(),
  },
  HttpAgent: vi.fn(() => ({
    fetchRootKey: vi.fn(),
  })),
}));

// Mock dfinity principal
vi.mock('@dfinity/principal', () => ({
  Principal: {
    fromText: vi.fn((text) => ({ toString: () => text })),
    anonymous: vi.fn(),
  },
}));

// Mock dfinity auth client
vi.mock('@dfinity/auth-client', () => ({
  AuthClient: {
    create: vi.fn(() => Promise.resolve({
      getIdentity: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    })),
  },
}));

// Mock canister IDs
vi.mock('process', () => ({
  env: {
    BACKEND_CANISTER_ID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    NODE_ENV: 'test',
  },
}));

// Mock window.ic
Object.defineProperty(window, 'ic', {
  value: {
    plug: {
      isConnected: vi.fn(() => Promise.resolve(true)),
      createAgent: vi.fn(),
      requestConnect: vi.fn(),
      createActor: vi.fn(),
      agent: {
        getPrincipal: vi.fn(),
      },
    },
  },
  writable: true,
});

// Mock canister functions
export const mockBackendActor = {
  get_user: vi.fn(),
  get_initial_data: vi.fn(),
  register: vi.fn(),
  update_user_profile: vi.fn(),
  get_user_notifications: vi.fn(),
  see_notifications: vi.fn(),
  delete_custom_contract: vi.fn(),
  // Add other backend canister methods as needed
};

vi.mock('canisters/backend', () => ({
  createActor: () => mockBackendActor,
}));

// Cleanup
afterEach(() => {
  vi.clearAllMocks();
});
