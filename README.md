# Aladdin UI Demo

Evidence-first frontend prototype for Aladdin with Ask IFA.

This repository is a frontend-only Next.js (App Router) demo. It uses structured mock data that mirrors the future backend contract, but it does not connect to live Aladdin services.

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
- Live Terminal: token stream, wallet/CA search, trench charts and labels.
- Ask IFA: quiet query layer with table output and CSV export when the user asks.

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

Public:

- `/` — Landing
- `/login` — Account entry
- `/onboarding` — First setup

Terminal (authenticated shell):

- `/live` — Live Terminal
- `/token/:mint/:tab` — Token intelligence (`trades`, `participants`, `most-profitable`, `largest-holders`, `first-100`, `holders`, `overview`)
- `/token/:mint` — Redirects to `/token/:mint/trades`
- `/wallet/:address` — Wallet display
- `/ask-ifa` — Ask IFÁ conversational evidence
- `/settings/:section` — Settings (`profile`, `account-security`, `appearance`, `language`, `ask-ifa`, `ifa-usage`, `telegram`, `api`, `plan-billing`, `tutorial`, `mobile-app`)
- `/settings` — Redirects to `/settings/profile`

## Structure

The project follows the `nestfunded` App Router layout:

- `app/` — routes, `layout.tsx`, `globals.css`
- `app/components/` — shared UI components
- `app/data/` — demo fixtures (bundles, wallets)
- `app/types/` — shared TypeScript types
- `app/utils/` — formatters, navigation, theme, search, settings
- `app/live/`, `app/token/`, `app/wallet/`, `app/ask-ifa/`, `app/settings/` — page-specific components
- `public/` — static assets

## Local development

```bash
npm install
npm run dev
```

Run the demo on port 5174:

```bash
npm run demo
```

## Build

```bash
npm run build
```

## Deployment

The GitHub repository is deployed to Vercel:

https://aladdin-ui-alpha.vercel.app/

Vercel should auto-deploy after changes are pushed to `main`.
