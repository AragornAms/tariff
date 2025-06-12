import { render, screen } from '@testing-library/react';
import TariffCalculatorPro from '../TariffCalculatorPro';
import React from 'react';

it('renders Tariff Calculator Pro heading', () => {
  render(<TariffCalculatorPro />);
  expect(screen.getByText(/Tariff Calculator Pro/i)).toBeInTheDocument();
});
