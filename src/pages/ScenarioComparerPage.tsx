import ScenarioComparer from '../components/ScenarioComparer';

// Sample data structure matching the component's interface
const sampleScenario = {
  id: "demo-1",
  name: "Electronics Import",
  hsCode: "851712",
  fobValue: 25000,
  quantity: 500,
  shipping: 1200,
  insurance: 300,
  incoterm: "CIF"
};

export default function ScenarioPage() {
  return (
    <div className="container mx-auto p-4">
      <ScenarioComparer 
        initialScenarios={[sampleScenario]}
        onEmailResults={() => {/* ... */}}
      />
    </div>
  );
}

