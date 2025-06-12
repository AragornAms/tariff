export function simulateTariffImpactOnConsumer(input) {
  const {
    basePrice,
    tariffRate,
    newTariffRate,
    growthRate,
    years,
    consumerPassThrough,
  } = input;

  const resultYears = [];
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
