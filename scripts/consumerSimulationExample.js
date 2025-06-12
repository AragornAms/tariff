import { simulateTariffImpactOnConsumer } from '../src/utils/consumerSimulation.js';

const result = simulateTariffImpactOnConsumer({
  basePrice: 100,
  tariffRate: 10,
  newTariffRate: 5,
  growthRate: 2,
  years: 5,
  consumerPassThrough: 0.5,
});

console.log(JSON.stringify(result, null, 2));
