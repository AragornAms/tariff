import { render, screen } from '@testing-library/react';
import ScenarioComparer from '../ScenarioComparer';
import React from 'react';

it('renders Scenario Comparison heading and default scenario', () => {
  render(<ScenarioComparer />);
  expect(screen.getByText(/Scenario Comparison/i)).toBeInTheDocument();
  expect(screen.getByText(/Scenario 1/i)).toBeInTheDocument();
});
