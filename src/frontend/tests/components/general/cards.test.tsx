import { render, screen } from '@testing-library/react';
import BasicCard from '../../../components/genral/card';
import { Button } from '@mui/material';
import '@testing-library/jest-dom';

describe('BasicCard Component', () => {
    /**
     * Test case: Renders card with title, children, and actions.
     * Verifies that the BasicCard component renders correctly with its title, children content, and actions.
     */
  it('renders card with title, children, and actions', () => {

    const mockActions = <Button>Mock Action</Button>;

    render(
      <BasicCard title="Test Card" actions={mockActions}>
        <p>Test Content</p>
      </BasicCard>
    );

    //Assertion: to check that title "Test Card" is present in rendered card
    const titleElement = screen.getByText(/Test Card/i);
    expect(titleElement).toBeInTheDocument();

    //Assertion: to verify that teh text "Text Content" is visible inside the card
    const contentElement = screen.getByText(/Test Content/i);
    expect(contentElement).toBeInTheDocument();

    //Assertion: to verify that the action is "Mock Action" is rendered as expected
    const actionElement = screen.getByText(/Mock Action/i);
    expect(actionElement).toBeInTheDocument();
  });
});
