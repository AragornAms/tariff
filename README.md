# Tariff News & Simulation Tools

This project contains a Vite + React + TypeScript application for tracking Vietnam ↔ US tariffs along with utilities for modeling tariff impacts.

## Prerequisites

- **Node.js ≥ 18** is required. Use an LTS version for best results.

## Installation

```bash
npm install
```

## Development Server

Run the project locally with:

```bash
npm run dev
```

This starts Vite in development mode and hot-reloads as you modify source files.

## Building for Production

To create an optimized build:

```bash
npm run build
```

The output is placed in the `dist` directory. Preview the build locally using:

```bash
npm run preview
```

## Running Tests

```bash
npm test
```

## Features

- Real-time news feed with the latest tariff updates
- Tariff impact calculator for HS codes and sectors
- Scenario comparison tool to model product variations
- Optional email export and newsletter sign-up

## Consumer Impact Simulation

The file `src/utils/consumerSimulation.js` exports a function `simulateTariffImpactOnConsumer` which models tariff changes on consumer prices over multiple years. An example script is provided in `scripts/consumerSimulationExample.js`.

Run the example with Node:

```bash
node scripts/consumerSimulationExample.js
```

This prints a yearly breakdown of prices before and after the tariff change and the cumulative savings passed on to consumers.
