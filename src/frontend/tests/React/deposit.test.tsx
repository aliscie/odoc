import { vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { handleRedux } from '../../redux/main';
import { actor } from '../../App';
import Deposit from '../../pages/profile/actions/deposit';
import TestWrapper from '../utils/tests_wrapper';

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: vi.fn(),
  };
});

vi.mock('../../redux/main', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    handleRedux: vi.fn(),
  };
});

vi.mock('../../App', () => ({
  actor: {
    deposit_usdt: vi.fn(),
  },
}));

describe('Deposit component', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = vi.fn();
    (useDispatch as vi.Mock).mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deposits 100 USDT on button click', async () => {
    const mockResponse = { Ok: 200 };
    (actor.deposit_usdt as vi.Mock).mockResolvedValue(mockResponse);

    render(
      <TestWrapper>
        <Deposit />
      </TestWrapper>
    );

    const depositButton = screen.getByText('Deposit');
    fireEvent.click(depositButton);

    expect(actor.deposit_usdt).toHaveBeenCalledWith(100);
    await screen.findByText('Deposit');
    expect(dispatchMock).toHaveBeenCalledWith(handleRedux('UPDATE_BALANCE', { balance: 200 }));
  });
});
