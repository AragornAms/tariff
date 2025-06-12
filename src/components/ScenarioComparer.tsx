import React, { useState } from 'react';
import { Plus, X, BarChart3, Table, Calculator, Download, Mail } from 'lucide-react';
import HsLookup from './HsLookup';

interface Scenario {
  id: string;
  name: string;
  hsCode: string;
  hsDescription: string;
  fobValue: number;
  quantity: number;
  shipping: number;
  insurance: number;
  incoterm: string;
}

interface ScenarioResults {
  dutyRate: number;
  dutyAmount: number;
  landedCost: number;
  marginImpact: number;
  totalCost: number;
}

interface ScenarioComparerProps {
  onEmailResults?: () => void;
}

const ScenarioComparer: React.FC<ScenarioComparerProps> = ({ onEmailResults }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: 'Scenario 1',
      hsCode: '',
      hsDescription: '',
      fobValue: 0,
      quantity: 0,
      shipping: 0,
      insurance: 0,
      incoterm: 'FOB'
    }
  ]);
  
  const [results, setResults] = useState<Record<string, ScenarioResults>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  const incotermOptions = ['FOB', 'CIF', 'EXW', 'DDP', 'CFR'];

  // Add new scenario (max 3)
  const addScenario = () => {
    if (scenarios.length >= 3) return;
    
    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: `Scenario ${scenarios.length + 1}`,
      hsCode: '',
      hsDescription: '',
      fobValue: 0,
      quantity: 0,
      shipping: 0,
      insurance: 0,
      incoterm: 'FOB'
    };
    
    setScenarios([...scenarios, newScenario]);
  };

  // Remove scenario
  const removeScenario = (id: string) => {
    if (scenarios.length <= 1) return;
    setScenarios(scenarios.filter(s => s.id !== id));
    
    // Remove results for deleted scenario
    const newResults = { ...results };
    delete newResults[id];
    setResults(newResults);
  };

  // Update scenario data
  const updateScenario = (id: string, field: keyof Scenario, value: string | number) => {
    setScenarios(scenarios.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  // Handle HS code selection
  const handleHsCodeSelect = (id: string, code: string, description: string) => {
    setScenarios(scenarios.map(s => 
      s.id === id ? { ...s, hsCode: code, hsDescription: description } : s
    ));
  };

  // Mock calculation function - in production, this would call an API
  const calculateScenario = (scenario: Scenario): ScenarioResults => {
    const totalValue = scenario.fobValue + scenario.shipping + scenario.insurance;
    
    // Mock tariff rates based on HS code patterns
    let dutyRate = 10; // Default rate
    if (scenario.hsCode.startsWith('61') || scenario.hsCode.startsWith('62')) {
      dutyRate = 16.5; // Textiles
    } else if (scenario.hsCode.startsWith('85')) {
      dutyRate = 8.2; // Electronics
    } else if (scenario.hsCode.startsWith('64')) {
      dutyRate = 12.8; // Footwear
    } else if (scenario.hsCode.startsWith('94')) {
      dutyRate = 6.5; // Furniture
    }
    
    const dutyAmount = totalValue * (dutyRate / 100);
    const totalCost = totalValue + dutyAmount;
    const landedCost = totalCost / scenario.quantity;
    const marginImpact = -((dutyAmount / totalValue) * 100); // Negative impact on margin
    
    return {
      dutyRate,
      dutyAmount,
      landedCost,
      marginImpact,
      totalCost
    };
  };

  // Calculate all scenarios
  const calculateAll = async () => {
    const validScenarios = scenarios.filter(s => 
      s.hsCode && s.fobValue > 0 && s.quantity > 0
    );
    
    if (validScenarios.length === 0) return;
    
    setIsCalculating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newResults: Record<string, ScenarioResults> = {};
    validScenarios.forEach(scenario => {
      newResults[scenario.id] = calculateScenario(scenario);
    });
    
    setResults(newResults);
    setIsCalculating(false);
  };

  // Check if scenario is valid for calculation
  const isScenarioValid = (scenario: Scenario) => {
    return scenario.hsCode && scenario.fobValue > 0 && scenario.quantity > 0;
  };

  const hasValidScenarios = scenarios.some(isScenarioValid);
  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Scenario Comparison</h1>
        <p className="text-lg text-gray-600">
          Compare tariff impacts across multiple product scenarios side by side
        </p>
      </div>

      {/* Scenario Input Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Product Scenarios</h2>
          {scenarios.length < 3 && (
            <button
              onClick={addScenario}
              className="flex items-center px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Scenario
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              index={index}
              onUpdate={updateScenario}
              onRemove={removeScenario}
              onHsCodeSelect={handleHsCodeSelect}
              canRemove={scenarios.length > 1}
              isValid={isScenarioValid(scenario)}
            />
          ))}
        </div>

        {/* Calculate Button */}
        <div className="text-center mt-8">
          <button
            onClick={calculateAll}
            disabled={!hasValidScenarios || isCalculating}
            className="bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center mx-auto"
            aria-label={isCalculating ? "Calculating scenarios" : "Calculate all scenarios"}
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="h-5 w-5 mr-2" />
                Calculate All Scenarios
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {hasResults && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Comparison Results</h2>
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Table className="h-4 w-4 mr-2" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'chart'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Chart
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                {onEmailResults && (
                  <button
                    onClick={onEmailResults}
                    className="flex items-center px-3 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </button>
                )}
              </div>
            </div>
          </div>

          {viewMode === 'table' ? (
            <ComparisonTable scenarios={scenarios} results={results} />
          ) : (
            <ComparisonChart scenarios={scenarios} results={results} />
          )}
        </div>
      )}
    </div>
  );
};

// Scenario Card Component
interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
  onUpdate: (id: string, field: keyof Scenario, value: string | number) => void;
  onRemove: (id: string) => void;
  onHsCodeSelect: (id: string, code: string, description: string) => void;
  canRemove: boolean;
  isValid: boolean;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  index,
  onUpdate,
  onRemove,
  onHsCodeSelect,
  canRemove,
  isValid
}) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
  const headerColor = colors[index % colors.length];

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
      isValid ? 'border-gray-200' : 'border-gray-100'
    } overflow-hidden`}>
      {/* Header */}
      <div className={`${headerColor} text-white p-4 rounded-t-xl flex items-center justify-between`}>
        <input
          type="text"
          value={scenario.name}
          onChange={(e) => onUpdate(scenario.id, 'name', e.target.value)}
          className="bg-transparent border-none text-white placeholder-white/70 font-semibold focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-2 py-1"
          placeholder="Scenario name"
        />
        {canRemove && (
          <button
            onClick={() => onRemove(scenario.id)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Remove scenario"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Form */}
      <div className="p-6 space-y-4">
        {/* HS Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            HS Code
          </label>
          <HsLookup
            value={scenario.hsCode}
            onChange={(code, description) => onHsCodeSelect(scenario.id, code, description)}
            placeholder="Search HS code..."
            className="w-full"
          />
          {scenario.hsDescription && (
            <p className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
              {scenario.hsDescription}
            </p>
          )}
        </div>

        {/* FOB Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            FOB Value (USD)
          </label>
          <input
            type="number"
            value={scenario.fobValue || ''}
            onChange={(e) => onUpdate(scenario.id, 'fobValue', parseFloat(e.target.value) || 0)}
            placeholder="10000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={scenario.quantity || ''}
            onChange={(e) => onUpdate(scenario.id, 'quantity', parseInt(e.target.value) || 0)}
            placeholder="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        {/* Shipping & Insurance */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping
            </label>
            <input
              type="number"
              value={scenario.shipping || ''}
              onChange={(e) => onUpdate(scenario.id, 'shipping', parseFloat(e.target.value) || 0)}
              placeholder="500"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance
            </label>
            <input
              type="number"
              value={scenario.insurance || ''}
              onChange={(e) => onUpdate(scenario.id, 'insurance', parseFloat(e.target.value) || 0)}
              placeholder="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Incoterm */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Incoterm
          </label>
          <select
            value={scenario.incoterm}
            onChange={(e) => onUpdate(scenario.id, 'incoterm', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            {['FOB', 'CIF', 'EXW', 'DDP', 'CFR'].map(term => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// Comparison Table Component
interface ComparisonTableProps {
  scenarios: Scenario[];
  results: Record<string, ScenarioResults>;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ scenarios, results }) => {
  const validScenarios = scenarios.filter(s => results[s.id]);

  if (validScenarios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No calculation results available
      </div>
    );
  }

  const metrics = [
    { key: 'dutyRate', label: 'Duty Rate', format: (val: number) => `${val.toFixed(1)}%` },
    { key: 'dutyAmount', label: 'Duty Amount', format: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { key: 'landedCost', label: 'Landed Cost/Unit', format: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { key: 'marginImpact', label: 'Margin Impact', format: (val: number) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%` },
    { key: 'totalCost', label: 'Total Cost', format: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}` }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="table">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="sticky left-0 bg-white z-10 px-4 py-2 text-left font-semibold text-gray-900">
              Metric
            </th>
            {validScenarios.map((scenario) => (
              <th key={scenario.id} className="text-center py-3 px-4 font-semibold text-gray-900 min-w-[150px]">
                {scenario.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => (
            <tr key={metric.key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-3 px-4 font-medium text-gray-900 sticky left-0 bg-inherit">
                {metric.label}
              </td>
              {validScenarios.map((scenario) => {
                const result = results[scenario.id];
                const value = result[metric.key as keyof ScenarioResults];
                return (
                  <td key={scenario.id} className="py-3 px-4 text-center">
                    <span className={
                      metric.key === 'marginImpact' 
                        ? value < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'
                        : 'text-gray-900'
                    }>
                      {metric.format(value)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Comparison Chart Component
interface ComparisonChartProps {
  scenarios: Scenario[];
  results: Record<string, ScenarioResults>;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ scenarios, results }) => {
  const validScenarios = scenarios.filter(s => results[s.id]);

  if (validScenarios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No calculation results available
      </div>
    );
  }

  // Find max values for scaling
  const maxDutyAmount = Math.max(...validScenarios.map(s => results[s.id].dutyAmount));
  const maxTotalCost = Math.max(...validScenarios.map(s => results[s.id].totalCost));

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];

  return (
    <div className="space-y-8">
      {/* Duty Amount Chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Duty Amount Comparison</h3>
        <div className="space-y-3">
          {validScenarios.map((scenario, index) => {
            const result = results[scenario.id];
            const percentage = (result.dutyAmount / maxDutyAmount) * 100;
            return (
              <div key={scenario.id} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700 flex-shrink-0">
                  {scenario.name}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-6 relative">
                    <div
                      className={`${colors[index % colors.length]} h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-white text-xs font-semibold">
                        ${result.dutyAmount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {result.dutyRate.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Cost Chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Cost Comparison</h3>
        <div className="space-y-3">
          {validScenarios.map((scenario, index) => {
            const result = results[scenario.id];
            const percentage = (result.totalCost / maxTotalCost) * 100;
            return (
              <div key={scenario.id} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700 flex-shrink-0">
                  {scenario.name}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-6 relative">
                    <div
                      className={`${colors[index % colors.length]} h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-white text-xs font-semibold">
                        ${result.totalCost.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  ${result.landedCost.toFixed(2)}/unit
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Margin Impact Chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Margin Impact Comparison</h3>
        <div className="space-y-3">
          {validScenarios.map((scenario, index) => {
            const result = results[scenario.id];
            const absImpact = Math.abs(result.marginImpact);
            const maxAbsImpact = Math.max(...validScenarios.map(s => Math.abs(results[s.id].marginImpact)));
            const percentage = (absImpact / maxAbsImpact) * 100;
            
            return (
              <div key={scenario.id} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700 flex-shrink-0">
                  {scenario.name}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-6 relative">
                    <div
                      className={`${result.marginImpact < 0 ? 'bg-red-500' : 'bg-green-500'} h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-white text-xs font-semibold">
                        {result.marginImpact > 0 ? '+' : ''}{result.marginImpact.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScenarioComparer;