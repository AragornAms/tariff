# Tariff Simulation

This repository includes a small React application along with utilities to simulate the impact of tariffs.

## Setup

Copy `.env.example` to `.env` and replace `VITE_NEWS_API_KEY` with your News API key.

## Development

Before running any lint or test scripts, install the project dependencies:

```bash
npm install
```

The lint and test commands rely on development packages like `vitest` and `@eslint/js`.
Run the checks with:

```bash
npm run lint
npm test
```

## Consumer impact simulation

The file `src/utils/consumerSimulation.js` exports a function `simulateTariffImpactOnConsumer` which models how tariff changes affect consumer prices over multiple years. An example script is provided in `scripts/consumerSimulationExample.js`.

Run the example with Node:

```bash
node scripts/consumerSimulationExample.js
```

This prints a yearly breakdown of prices before and after the tariff change and the cumulative savings passed on to consumers.
