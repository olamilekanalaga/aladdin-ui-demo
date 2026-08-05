# Aladdin Private Tailscale Demo

This exposes the existing frontend-only Aladdin prototype privately to authorised devices in the same Tailscale tailnet. It does not use Funnel, expose the app publicly, or connect a backend.

## Detected project configuration

- Framework: React + TypeScript SPA using Vite.
- Package manager: npm.
- Fixture mode: local canonical data only.
- Build: `npm run build`.
- Private demo server: `npm run demo`.
- Stable local port: `5174`.
- Local binding for private Serve: `127.0.0.1`.
- SPA fallback: supplied by Vite, including direct nested routes.

## First-time setup

From the `aladdin-ui-demo` directory:

```powershell
npm install
Copy-Item .env.example .env.local
```

The environment file contains only non-secret prototype flags:

```text
VITE_APP_ENV=demo
VITE_DEMO_MODE=true
VITE_USE_MOCK_DATA=true
VITE_TAILSCALE_HOST=desktop-qagf7d0.tail106770.ts.net
```

Never add Tailscale auth keys, wallet secrets, API keys, access tokens or user credentials.

## Start the frontend

In terminal 1:

```powershell
npm run demo
```

Confirm `http://127.0.0.1:5174` opens locally. Keep this terminal running.

## Connect Tailscale

Tailscale must be installed and signed into the intended tailnet:

```powershell
tailscale version
tailscale status
```

If disconnected, use the Tailscale application or run `tailscale up`. Do not enable Funnel.

## Start private Tailscale Serve

In terminal 2:

```powershell
npm run demo:tailscale
```

The script verifies the CLI, confirms port `5174` responds, configures `tailscale serve --bg 5174`, and prints the private HTTPS URL and current configuration.

You can inspect it again with:

```powershell
tailscale serve status
```

## Open from another authorised device

1. Connect the second device to the same authorised tailnet.
2. Open the private `https://<device>.<tailnet>.ts.net` URL printed by Serve.
3. Test Launches, GLIPPY search, Token Intelligence, Participants, contextual wallet evidence and global Wallet Intelligence.

The URL is not intended to work for the public internet.

## Direct route verification

Vite returns the SPA shell for direct routes such as:

- `/app/launches/new`
- `/app/launches/migrated`
- `/app/launches/trending`
- `/app/token/:contract/trades`
- `/app/token/:contract/participants`
- `/app/token/:contract/wallet/:walletAddress`
- `/app/wallet/:walletAddress`

Unauthenticated protected routes redirect to mock login and preserve `returnTo`.

## Stop the demo

Stop the frontend with `Ctrl+C` in terminal 1. The background Serve configuration persists, but it has no working upstream while the frontend is stopped.

Remove the private Serve configuration with:

```powershell
tailscale serve reset
```

Confirm removal:

```powershell
tailscale serve status
```

## Troubleshooting

- **Port 5174 already in use:** identify the existing process or stop the older demo before `npm run demo`. The strict-port setting prevents silently moving the URL.
- **Local page fails:** run `npm install`, then `npm run build`, then retry `npm run demo`.
- **Serve script says Tailscale is missing:** install the Windows Tailscale client and ensure `tailscale.exe` is on PATH.
- **No private HTTPS URL:** confirm `tailscale status` shows this device connected, then rerun `npm run demo:tailscale`.
- **Authorised phone cannot connect:** confirm the phone is online in `tailscale status`, MagicDNS/HTTPS is enabled for the tailnet, and the URL exactly matches `tailscale serve status`.
- **Nested route appears to fail:** confirm the Vite process—not a plain static file server—is serving port 5174.
- **Host rejection:** `vite.config.ts` permits only the exact Tailscale hostname in `VITE_TAILSCALE_HOST`. If the device or tailnet hostname changes, update that non-secret variable and restart Vite. Host validation is not disabled globally.

Tailscale Funnel is deliberately not configured.
