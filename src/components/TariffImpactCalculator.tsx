import React, { useState, useEffect } from 'react';
import { BarChart3, DollarSign, Package, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface HsCode {
  code: string;
  description: string;
}

interface Sector {
  id: string;
  name: string;
  avgTariff: number;
}

interface ImpactData {
  yearly: Array<{
    year: string;
    importValue: number;
    tariffCost: number;
    totalCost: number;
  }>;
  comparison: Array<{
    year: string;
    'With Tariffs': number;
    'Without Tariffs': number;
  }>;
  summary: {
    totalTariffs: number;
    averageImpact: string;
    finalYearCost: number;
    totalValue: number;
  };
}

interface TariffImpactCalculatorProps {
  hsCodeOptions: HsCode[];
  sectorOptions: Sector[];
}

const TariffImpactCalculator: React.FC<TariffImpactCalculatorProps> = ({
  hsCodeOptions,
  sectorOptions
}) => {
  const [selectedHsCode, setSelectedHsCode] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [importValue, setImportValue] = useState<string>('');
  const [projectedGrowth, setProjectedGrowth] = useState<string>('5');
  const [years, setYears] = useState<string>('5');

  const [impactData, setImpactData] = useState<ImpactData | null>(null);

  const calculateImpact = () => {
    if (!selectedHsCode || !selectedSector || !importValue || !projectedGrowth || !years) {
      return;
    }

    const baseValue = parseFloat(importValue);
    const growth = parseFloat(projectedGrowth) / 100;
    const numYears = parseInt(years);
    const sector = sectorOptions.find(s => s.id === selectedSector);
    
    if (!sector) return;

    const yearlyData = [];
    const comparisonData = [];
    let currentValue = baseValue;
    
    for (let i = 0; i <= numYears; i++) {
      const tariffCost = currentValue * sector.avgTariff;
      const totalCost = currentValue + tariffCost;
      
      yearlyData.push({
        year: `Year ${i}`,
        importValue: Math.round(currentValue),
        tariffCost: Math.round(tariffCost),
        totalCost: Math.round(totalCost)
      });

      comparisonData.push({
        year: `Year ${i}`,
        'With Tariffs': Math.round(totalCost),
        'Without Tariffs': Math.round(currentValue)
      });

      currentValue = currentValue * (1 + growth);
    }

    setImpactData({
      yearly: yearlyData,
      comparison: comparisonData,
      summary: {
        totalTariffs: yearlyData.reduce((sum, data) => sum + data.tariffCost, 0),
        averageImpact: (sector.avgTariff * 100).toFixed(1),
        finalYearCost: yearlyData[yearlyData.length - 1].totalCost,
        totalValue: yearlyData.reduce((sum, data) => sum + data.importValue, 0)
      }
    });
  };

  useEffect(() => {
    calculateImpact();
  }, [selectedHsCode, selectedSector, importValue, projectedGrowth, years]);

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            HS Code
          </label>
          <select
            value={selectedHsCode}
            onChange={(e) => setSelectedHsCode(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="">Select HS Code</option>
            {hsCodeOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code} - {option.description}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sector
          </label>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="">Select Sector</option>
            {sectorOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Import Value (USD)
          </label>
          <input
            type="number"
            value={importValue}
            onChange={(e) => setImportValue(e.target.value)}
            placeholder="Enter value"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Projected Annual Growth (%)
          </label>
          <input
            type="number"
            value={projectedGrowth}
            onChange={(e) => setProjectedGrowth(e.target.value)}
            placeholder="Enter growth rate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Projection Years
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            min="1"
            max="10"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Results Section */}
      {impactData && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-teal-600" />
                <h3 className="ml-2 text-lg font-semibold text-gray-900">Total Tariffs</h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${Math.round(impactData.summary.totalTariffs).toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-teal-600" />
                <h3 className="ml-2 text-lg font-semibold text-gray-900">Average Impact</h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {impactData.summary.averageImpact}%
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-teal-600" />
                <h3 className="ml-2 text-lg font-semibold text-gray-900">Final Year Cost</h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${Math.round(impactData.summary.finalYearCost).toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-teal-600" />
                <h3 className="ml-2 text-lg font-semibold text-gray-900">Total Value</h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${Math.round(impactData.summary.totalValue).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={impactData.yearly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="importValue" name="Import Value" fill="#0d9488" />
                    <Bar dataKey="tariffCost" name="Tariff Cost" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Comparison</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={impactData.comparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="With Tariffs" stroke="#f97316" strokeWidth={2} />
                    <Line type="monotone" dataKey="Without Tariffs" stroke="#0d9488" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TariffImpactCalculator; 