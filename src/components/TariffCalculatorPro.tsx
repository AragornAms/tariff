import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  AdjustmentsHorizontalIcon,
  DocumentArrowDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Types and Interfaces
interface HSCode {
  code: string;
  description: string;
  defaultRate: number;
}

interface Sector {
  id: string;
  name: string;
  defaultRate: number;
}

interface TradeLane {
  id: string;
  name: string;
  shipping: number;
  insurance: number;
}

interface CalculationResult {
  currentTariff: number;
  vat: number;
  otherFees: number;
  totalLandedCost: number;
  potentialSavings: number;
  consumerSavings: number;
  reinvestedSavings: number;
}

// Sample Data
const sampleHsCodes: HSCode[] = [
  { code: '851712', description: 'Mobile Phones', defaultRate: 8.5 },
  { code: '640411', description: 'Sports Footwear', defaultRate: 12 },
  { code: '610910', description: 'Cotton T-shirts', defaultRate: 12 },
  { code: '852990', description: 'Electronic Components', defaultRate: 8.5 },
];

const sampleSectors: Sector[] = [
  { id: 'electronics', name: 'Electronics', defaultRate: 8.5 },
  { id: 'textiles', name: 'Textiles', defaultRate: 12 },
  { id: 'agrifood', name: 'Agrifood', defaultRate: 15 },
  { id: 'machinery', name: 'Machinery', defaultRate: 6 },
  { id: 'chemicals', name: 'Chemicals', defaultRate: 10 },
];

const tradeLanes: TradeLane[] = [
  {
    id: 'shanghai-hcmc',
    name: 'Shanghai → HCMC',
    shipping: 1200,
    insurance: 150,
  },
  {
    id: 'hcmc-la',
    name: 'HCMC → Los Angeles',
    shipping: 1800,
    insurance: 200,
  },
];

// Input Panel Component
const InputPanel: React.FC<{
  mode: 'hs-code' | 'sector';
  setMode: (mode: 'hs-code' | 'sector') => void;
  selectedHsCode: string;
  setSelectedHsCode: (code: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  cifCost: number;
  setCifCost: (cost: number) => void;
  selectedLane: string;
  setSelectedLane: (lane: string) => void;
  shipping: number;
  setShipping: (cost: number) => void;
  insurance: number;
  setInsurance: (cost: number) => void;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  vat: number;
  setVat: (rate: number) => void;
  otherFees: number;
  setOtherFees: (rate: number) => void;
}> = ({
  mode,
  setMode,
  selectedHsCode,
  setSelectedHsCode,
  selectedSector,
  setSelectedSector,
  cifCost,
  setCifCost,
  selectedLane,
  setSelectedLane,
  shipping,
  setShipping,
  insurance,
  setInsurance,
  showAdvanced,
  setShowAdvanced,
  vat,
  setVat,
  otherFees,
  setOtherFees,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      {/* Mode Toggle */}
      <div className="flex rounded-xl bg-gray-100 p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            mode === 'hs-code'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setMode('hs-code')}
        >
          HS Code
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            mode === 'sector'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setMode('sector')}
        >
          Sector
        </button>
      </div>

      {/* HS Code / Sector Selection */}
      {mode === 'hs-code' ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            HS Code
          </label>
          <select
            value={selectedHsCode}
            onChange={(e) => setSelectedHsCode(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="">Select HS Code</option>
            {sampleHsCodes.map((code) => (
              <option key={code.code} value={code.code}>
                {code.code} - {code.description}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Sector
          </label>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="">Select Sector</option>
            {sampleSectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name} ({sector.defaultRate}%)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* CIF Cost Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          CIF Cost (USD)
        </label>
        <input
          type="number"
          value={cifCost || ''}
          onChange={(e) => setCifCost(parseFloat(e.target.value) || 0)}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="Enter CIF cost"
        />
      </div>

      {/* Trade Lane Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Trade Lane
        </label>
        <select
          value={selectedLane}
          onChange={(e) => {
            setSelectedLane(e.target.value);
            const lane = tradeLanes.find((l) => l.id === e.target.value);
            if (lane) {
              setShipping(lane.shipping);
              setInsurance(lane.insurance);
            }
          }}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        >
          <option value="">Select Trade Lane</option>
          {tradeLanes.map((lane) => (
            <option key={lane.id} value={lane.id}>
              {lane.name}
            </option>
          ))}
        </select>
      </div>

      {/* Shipping & Insurance */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Shipping (USD)
          </label>
          <input
            type="number"
            value={shipping || ''}
            onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Insurance (USD)
          </label>
          <input
            type="number"
            value={insurance || ''}
            onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <div className="flex items-center">
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
          Advanced Settings
        </div>
        <ChevronRightIcon
          className={`h-5 w-5 transition-transform ${
            showAdvanced ? 'rotate-90' : ''
          }`}
        />
      </button>

      {/* Advanced Settings Panel */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              VAT Rate (%)
            </label>
            <input
              type="number"
              value={vat}
              onChange={(e) => setVat(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Other Fees (%)
            </label>
            <input
              type="number"
              value={otherFees}
              onChange={(e) => setOtherFees(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
const TariffCalculatorPro: React.FC<{ onEmailResults?: () => void }> = ({ onEmailResults }) => {
  // State
  const [mode, setMode] = useState<'hs-code' | 'sector'>('hs-code');
  const [selectedHsCode, setSelectedHsCode] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [cifCost, setCifCost] = useState(0);
  const [selectedLane, setSelectedLane] = useState('');
  const [shipping, setShipping] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [vat, setVat] = useState(10);
  const [otherFees, setOtherFees] = useState(2);
  const [newTariffRate, setNewTariffRate] = useState(100);
  const [savingsSplit, setSavingsSplit] = useState(50);

  // Calculate results
  const calculateResults = (): CalculationResult => {
    const baseRate =
      mode === 'hs-code'
        ? sampleHsCodes.find((code) => code.code === selectedHsCode)?.defaultRate || 0
        : sampleSectors.find((sector) => sector.id === selectedSector)?.defaultRate || 0;

    const totalValue = cifCost + shipping + insurance;
    const currentTariff = totalValue * (baseRate / 100);
    const vatAmount = (totalValue + currentTariff) * (vat / 100);
    const feesAmount = totalValue * (otherFees / 100);
    const totalLandedCost = totalValue + currentTariff + vatAmount + feesAmount;

    const newTariff = totalValue * (baseRate * (newTariffRate / 100) / 100);
    const potentialSavings = currentTariff - newTariff;
    const consumerSavings = potentialSavings * (savingsSplit / 100);
    const reinvestedSavings = potentialSavings * (1 - savingsSplit / 100);

    return {
      currentTariff,
      vat: vatAmount,
      otherFees: feesAmount,
      totalLandedCost,
      potentialSavings,
      consumerSavings,
      reinvestedSavings,
    };
  };

  const results = calculateResults();

  const handleExportPDF = () => {
    // Call onEmailResults if provided
    onEmailResults?.();
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('AmCham Tariff Brief', 10, 10);

    doc.setFontSize(12);
    const lines = [
      `Current Tariff: $${results.currentTariff.toLocaleString()}`,
      `VAT: $${results.vat.toLocaleString()}`,
      `Other Fees: $${results.otherFees.toLocaleString()}`,
      `Total Landed Cost: $${results.totalLandedCost.toLocaleString()}`,
      `Potential Savings: $${results.potentialSavings.toLocaleString()}`,
      `Consumer Savings: $${results.consumerSavings.toLocaleString()}`,
      `Reinvested Savings: $${results.reinvestedSavings.toLocaleString()}`,
    ];

    lines.forEach((text, index) => {
      doc.text(text, 10, 20 + index * 10);
    });

    doc.save('amcham_brief.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 font-montserrat">
            Tariff Calculator Pro
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Calculate and analyze tariff impacts on your business
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel - 4 columns */}
          <div className="lg:col-span-4">
            <InputPanel
              mode={mode}
              setMode={setMode}
              selectedHsCode={selectedHsCode}
              setSelectedHsCode={setSelectedHsCode}
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              cifCost={cifCost}
              setCifCost={setCifCost}
              selectedLane={selectedLane}
              setSelectedLane={setSelectedLane}
              shipping={shipping}
              setShipping={setShipping}
              insurance={insurance}
              setInsurance={setInsurance}
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
              vat={vat}
              setVat={setVat}
              otherFees={otherFees}
              setOtherFees={setOtherFees}
            />
          </div>

          {/* Results Panel - 8 columns */}
          <div className="lg:col-span-8 space-y-8">
            {/* Current Cost Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Cost Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-600">Current Tariff</h3>
                  <p className="text-2xl font-bold text-teal-600">
                    ${results.currentTariff.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-600">VAT</h3>
                  <p className="text-2xl font-bold text-teal-600">
                    ${results.vat.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-600">Other Fees</h3>
                  <p className="text-2xl font-bold text-teal-600">
                    ${results.otherFees.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-600">Total Landed Cost</h3>
                  <p className="text-2xl font-bold text-teal-600">
                    ${results.totalLandedCost.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Cost Breakdown Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{
                    name: 'Cost Breakdown',
                    tariff: results.currentTariff,
                    vat: results.vat,
                    otherFees: results.otherFees,
                  }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tariff" name="Tariff" fill="#008080" stackId="a" />
                    <Bar dataKey="vat" name="VAT" fill="#00a0a0" stackId="a" />
                    <Bar dataKey="otherFees" name="Other Fees" fill="#00c0c0" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Impact Analysis */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Impact Analysis</h2>
              
              {/* New Tariff Rate Slider */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Tariff Rate: {newTariffRate}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newTariffRate}
                  onChange={(e) => setNewTariffRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Savings Metrics */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">
                    Potential Savings
                  </h3>
                  <p className="text-lg font-bold text-teal-600">
                    ${results.potentialSavings.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Savings Split: {savingsSplit}% Consumer
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    value={savingsSplit}
                    onChange={(e) => setSavingsSplit(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    list="splits"
                  />
                  <datalist id="splits">
                    <option value="0" />
                    <option value="25" />
                    <option value="50" />
                    <option value="75" />
                    <option value="100" />
                  </datalist>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-600">Consumer Savings</h4>
                    <p className="text-lg font-bold text-teal-600">
                      ${results.consumerSavings.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-600">Reinvested Savings</h4>
                    <p className="text-lg font-bold text-navy-600">
                      ${results.reinvestedSavings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Impact Charts */}
              <div className="space-y-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      {
                        name: 'Current',
                        value: results.totalLandedCost,
                      },
                      {
                        name: 'After Reduction',
                        value: results.totalLandedCost - results.potentialSavings,
                      }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="value"
                        fill="#008080"
                        name="Total Cost"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[results]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="consumerSavings"
                        fill="#008080"
                        name="Consumer Savings"
                        stackId="savings"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="reinvestedSavings"
                        fill="#003366"
                        name="Reinvested"
                        stackId="savings"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Download AmCham Brief
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffCalculatorPro; 