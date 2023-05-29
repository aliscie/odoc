import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BasicMenu from "../components/genral/basic_menu";

describe('BasicMenu', () => {
  test('renders menu options and triggers onClick', () => {
    const mockOnClick = jest.fn();

    const options = [
      { content: 'option 1', onClick: mockOnClick },
      { content: 'option 2' },
    ];

    render(
      <BasicMenu options={options}>
        <button>Open Menu</button>
      </BasicMenu>
    );

    const openMenuButton = screen.getByText('Open Menu');
    fireEvent.click(openMenuButton);

    const option1 = screen.getByText('option 1');
    const option2 = screen.getByText('option 2');

    fireEvent.click(option1);
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    fireEvent.click(option2);
    expect(mockOnClick).toHaveBeenCalledTimes(1); // onClick should not be triggered for option2
  });
});
