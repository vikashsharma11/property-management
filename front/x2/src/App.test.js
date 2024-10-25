import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders Real Estate header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Real Estate/i);  // Look for "Real Estate"
  expect(headerElement).toBeInTheDocument();
});
