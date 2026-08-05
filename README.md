# Aladdin UI Demo

Frontend-only, high-fidelity Aladdin Intelligence prototype built with React, TypeScript, and Vite. It uses a shared local fixture store; no blockchain API, wallet provider, database, or production authentication service is connected.

## Current prototype journey

- Mock landing and login
- Launches: New Pairs, Migrated, and Trending
- Search-driven Token Intelligence and Global Wallet Intelligence
- Token trades and participant cohorts
- Contextual Wallet x Token evidence
- Browser history and protected-route return-to-origin behavior
- Loading, no-result, and resolver-error states

## Run locally

```bash
npm install
npm run dev
```

The development server binds to `0.0.0.0`. For the private Tailscale workflow, see [TAILSCALE_DEMO_SETUP.md](TAILSCALE_DEMO_SETUP.md).

## Useful routes

- `/` - Public landing
- `/login` - Mock login
- `/app/launches/new` - New Pairs
- `/app/launches/migrated` - Migrated tokens
- `/app/launches/trending` - Prototype ranking
- `/app/token/:contract/trades` - Token Intelligence
- `/app/token/:contract/participants` - Participant cohorts
- `/app/token/:contract/behaviour/:behaviour` - Behaviour Group Detail
- `/app/token/:contract/wallet/:walletAddress` - Wallet x Token evidence
- `/app/wallet/:walletAddress` - Global Wallet Intelligence

## Validation

```bash
npm run build
```

The prototype is intentionally fixture-backed. Displayed evidence must not be treated as live market intelligence.
