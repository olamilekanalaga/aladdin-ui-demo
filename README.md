# Aladdin UI Demo

Evidence-first frontend prototype for Aladdin with Ask IFA.

This repository is a frontend-only Vite + React demo. It uses structured mock data that mirrors the future backend contract, but it does not connect to live Aladdin services.

## Product stance

Aladdin is an on-chain behavioural-intelligence terminal. This demo must not present itself as:

- a trading execution terminal;
- a prediction engine;
- a token-calling product;
- a live backend monitor.

The interface is designed to answer one trading-research question:

> What trade does this evidence change?

## Workspaces

- Launches: New Launches, Pre-Migration, Migrated, Discovery / Trending.
- Token Intelligence: trade facts, first 100 buyer retention, participants, holders, live-state evidence, formation checkpoints and historical matches.
- Wallet Intelligence: wallet temperament and wallet-token behaviour.
- Live Terminal: token stream, wallet/CA search, trench charts and labels.\n- Ask IFA: quiet query layer with table output and CSV export when the user asks.

## Formation model

The demo uses event checkpoints:

- BUY_10
- BUY_25
- BUY_50
- BUY_100

It intentionally avoids fixed 1-minute, 5-minute or 10-minute formation boundaries.

## Demo data notice

Every page includes:

> Demo data - Backend not connected

Unknown backend values are rendered as `Unavailable`, not zero.

## Routes

- `/`
- `/login`
- `/app/launches/new`
- `/app/launches/premigration`
- `/app/launches/migrated`
- `/app/launches/trending`
- `/app/token/:mint/overview`
- `/app/token/:mint/first-100`
- `/app/token/:mint/formation-evidence`
- `/app/wallet/:address`
- `/app/live\n- `/app/ask-ifa``

`vercel.json` rewrites nested routes to `index.html` so browser refresh does not 404.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

The GitHub repository is deployed to Vercel:

https://aladdin-ui-alpha.vercel.app/

Vercel should auto-deploy after changes are pushed to `main`.
