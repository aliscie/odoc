// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from '../../App';
test('renders without crashing', () => {
  render(<App />);
  const linkElement = screen.getByText(/some text in your App component/i);
  expect(linkElement).toBeInTheDocument();
});
