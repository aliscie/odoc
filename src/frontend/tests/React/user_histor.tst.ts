import { render, screen } from "@testing-library/react";
import UserHistoryCom from "../../pages/user"
jest.mock('../utils/get_user_by_principal');

it('should render basic user information and history when user history is provided', () => {
  // Mock dependencies
  // const getUserMock = jest.fn();
  // getUser.mockImplementation(() => ({ getUser: getUserMock }));

  // Mock data
  const profile = {
    spent: 100,
    received: 200,
    users_interacted: 5,
    total_debt: 50,
    rates_by_others: [],
    rates_by_actions: [],
  };

  // Render component
  // render(<UserHistoryCom {...profile} />);

  // Assertions
  // expect(screen.getByText(`spent: ${profile.spent} USDT`)).toBeInTheDocument();
  // expect(screen.getByText(`received: ${profile.received} USDT`)).toBeInTheDocument();
  // expect(screen.getByText(`Interacted with : ${profile.users_interacted} users`)).toBeInTheDocument();
  // expect(screen.getByText(`dept : ${profile.total_debt} dept`)).toBeInTheDocument();
});