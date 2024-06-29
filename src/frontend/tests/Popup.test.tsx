import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestPopup from '../components/genral/pop_up';


describe('TestPopup Component', () => {
  test('renders button and shows popup content on click', () => {
    const content = <div>Popup Content</div>;

    render(
      <TestPopup content={content}>
        Open Popup
      </TestPopup>
    );

    const button = screen.getByText('Open Popup');
    expect(button).toBeInTheDocument();

    expect(screen.queryByText('Popup Content')).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByText('Popup Content')).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.queryByText('Popup Content')).not.toBeInTheDocument();
  });
});
