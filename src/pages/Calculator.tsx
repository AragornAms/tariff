import React from 'react';
import { Calculator as CalculatorIcon } from 'lucide-react';
import TariffCalculatorPro from '../components/TariffCalculatorPro';

interface CalculatorProps {
  onEmailResults: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onEmailResults }) => {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <CalculatorIcon className="h-10 w-10 text-teal-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Tariff Calculator</h1>
          </div>
          <p className="text-lg text-gray-600">
            Calculate and analyze tariff impacts on your Vietnam-US imports
          </p>
        </div>

        {/* Unified Calculator */}
        <TariffCalculatorPro onEmailResults={onEmailResults} />
      </div>
    </div>
  );
};

export default Calculator;