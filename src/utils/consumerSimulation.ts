export interface ConsumerSimulationInput {
  basePrice: number; // base landed cost excluding tariffs
  tariffRate: number; // current tariff rate in percent
  newTariffRate: number; // new tariff rate after policy in percent
  growthRate: number; // annual growth of base price in percent
  years: number; // number of years to simulate
  consumerPassThrough: number; // fraction of tariff savings passed to consumer (0-1)
}

export interface ConsumerSimulationYear {
  year: number;
  basePrice: number;
  tariffBefore: number;
  priceBefore: number;
  tariffAfter: number;
  priceAfter: number;
  consumerPriceAfter: number;
  consumerSavings: number;
}

export interface ConsumerSimulationResult {
  years: ConsumerSimulationYear[];
  totalConsumerSavings: number;
}

/**
 * Simulate the impact of a tariff change on consumer prices over time.
 *
 * This assumes the base price grows at a constant rate each year. Tariff
 * savings may be partially passed on to consumers based on the
 * `consumerPassThrough` fraction.
 */
export function simulateTariffImpactOnConsumer(
  input: ConsumerSimulationInput
): ConsumerSimulationResult {
  const {
    basePrice,
    tariffRate,
    newTariffRate,
    growthRate,
    years,
    consumerPassThrough,
  } = input;

  const resultYears: ConsumerSimulationYear[] = [];
  let currentBase = basePrice;
  let totalSavings = 0;

  for (let i = 0; i < years; i++) {
    const tariffBefore = (currentBase * tariffRate) / 100;
    const priceBefore = currentBase + tariffBefore;
    const tariffAfter = (currentBase * newTariffRate) / 100;
    const priceAfter = currentBase + tariffAfter;

    const potentialSavings = tariffBefore - tariffAfter;
    const consumerSavings = potentialSavings * consumerPassThrough;
    const consumerPriceAfter = priceBefore - consumerSavings;

    resultYears.push({
      year: i + 1,
      basePrice: currentBase,
      tariffBefore,
      priceBefore,
      tariffAfter,
      priceAfter,
      consumerPriceAfter,
      consumerSavings,
    });

    totalSavings += consumerSavings;
    currentBase *= 1 + growthRate / 100;
  }

  return { years: resultYears, totalConsumerSavings: totalSavings };
}
