import ScenarioComparer from '../components/ScenarioComparer';
import sampleScenarios from '../data/sampleScenarios.json';

export default function ScenarioPage() {
  return (
    <div className="container mx-auto p-4">
      <ScenarioComparer
        initialScenarios={[sampleScenarios[0]]}
        onEmailResults={() => {/* ... */}}
      />
    </div>
  );
}

