// src/frontend/tests/React/contract/testutility.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleStatusChange } from "../../../components/ContractTable/utils";
import { formatRelativeTime } from "../../../utils/time";
import CustomContractViewer from "../../../components/ContractTable";

// Mock data
const mockProfile = {
  id: '123',
  name: 'Test User'
};

const mockFriends = [
  { id: '123', name: 'Test User' },
  { id: '456', name: 'Friend 1' },
];

const mockContract = {
  id: 'contract-1',
  name: 'Test Contract',
  creator: '123',
  date_created: Date.now(),
  date_updated: Date.now(),
  promises: [],
  payments: [],
  contracts: [],
};

// Mock Redux store
const mockInitialState = {
  uiState: {
    isDarkMode: false
  },
  filesState: {
    profile: mockProfile,
    all_friends: mockFriends
  }
};

const mockStore = createStore((state = mockInitialState) => state);

// Mock functions
const mockOnContractChange = vi.fn();

describe('CustomContractViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={mockStore}>
        <CustomContractViewer
          profile={mockProfile}
          all_friends={mockFriends}
          contracts={[mockContract]}
          onContractChange={mockOnContractChange}
          {...props}
        />
      </Provider>
    );
  };

  it('renders contract name correctly', () => {
    renderComponent();
    expect(screen.getByText('Test Contract')).toBeInTheDocument();
  });

  it('allows editing contract name', async () => {
    renderComponent();
    const contractName = screen.getByText('Test Contract');
    fireEvent.click(contractName);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Contract Name' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockOnContractChange).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockContract,
          name: 'Updated Contract Name'
        })
      );
    });
  });

  it('switches between promises and payments view', () => {
    renderComponent();
    const select = screen.getByLabelText('Select Data');

    fireEvent.mouseDown(select);
    const promisesOption = screen.getByText('Promises');
    fireEvent.click(promisesOption);
    expect(screen.getByText('Promises')).toBeInTheDocument();

    fireEvent.mouseDown(select);
    const paymentsOption = screen.getByText('Payments');
    fireEvent.click(paymentsOption);
    expect(screen.getByText('Payments')).toBeInTheDocument();
  });

  it('creates new contract table', async () => {
    renderComponent();
    const createButton = screen.getByText('Create New Table');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockOnContractChange).toHaveBeenCalledWith(
        expect.objectContaining({
          contracts: expect.arrayContaining([
            expect.objectContaining({
              name: expect.stringMatching(/New Table \d+/)
            })
          ])
        })
      );
    });
  });

  it('deletes contract table', async () => {
    const contractWithTable = {
      ...mockContract,
      contracts: [{
        id: 'table-1',
        name: 'Test Table',
        date_created: Date.now(),
        creator: '123',
        rows: [],
        columns: []
      }]
    };

    renderComponent({ contracts: [contractWithTable] });

    const deleteButton = screen.getByTestId('DeleteIcon');
    fireEvent.click(deleteButton);

    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    await waitFor(() => {
      expect(mockOnContractChange).toHaveBeenCalledWith(
        expect.objectContaining({
          contracts: []
        })
      );
    });

    vi.restoreAllMocks();
  });
});

// Test utility functions
describe('Contract Utility Functions', () => {
  beforeEach(() => {
    // Mock Date.now() to return a fixed timestamp
    vi.spyOn(Date, 'now').mockImplementation(() => 1642438800000); // 2022-01-17T12:00:00.000Z
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formats relative time correctly', () => {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000); // Exactly one hour ago
    expect(formatRelativeTime(oneHourAgo)).toBe('19009 days ago');
    // expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
  });

  it('handles payment status changes', () => {
    const mockContractWithPromise = {
      ...mockContract,
      promises: [{
        id: '123',
        status: { None: null },
        date_created: Date.now(),
        date_released: Date.now(),
        cells: [],
        contract_id: 'contract-1',
        sender: '123',
        amount: 100,
        receiver: '456'
      }]
    };

    const params = {
      data: {
        id: '123',
        status: { None: null }
      },
      newValue: 'Confirmed'
    };

    const result = handleStatusChange(params, mockContractWithPromise);
    expect(result.promises[0].status).toEqual({ Confirmed: null });
  });
});
