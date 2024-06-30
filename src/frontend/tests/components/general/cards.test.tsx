import { render, screen } from '@testing-library/react';
import BasicCard from '../../../components/genral/card';
import { Button } from '@mui/material';
import '@testing-library/jest-dom';

describe('BasicCard Component', () => {
  it('renders card with title, children, and actions', () => {

    const mockActions = <Button>Mock Action</Button>;

    render(
      <BasicCard title="Test Card" actions={mockActions}>
        <p>Test Content</p>
      </BasicCard>
    );

    const titleElement = screen.getByText(/Test Card/i);
    expect(titleElement).toBeInTheDocument();

    const contentElement = screen.getByText(/Test Content/i);
    expect(contentElement).toBeInTheDocument();

    const actionElement = screen.getByText(/Mock Action/i);
    expect(actionElement).toBeInTheDocument();
  });
});
