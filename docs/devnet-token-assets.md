# Aladdin synthetic Devnet token assets

These assets exist only on Solana Devnet and have no monetary value. They support read-only product demonstrations, metadata verification and future isolated wallet research. They are not proof of live or historical Solana activity.

## Canonical frontend mapping

- `app/data/devnet-market-manifest.json` records each synthetic scenario ID, mint address, decimals and creation signatures.
- `app/data/devnet-market.ts` exposes read-only lookup helpers.
- `/api/devnet-market/metadata/[tokenId]` serves public Token-2022 metadata.
- `/api/devnet-market/artwork/[tokenId]` serves deterministic synthetic artwork.
- `scripts/devnet-assets/deploy-token-assets.mjs` is an operational Devnet-only creation script. It must never enter a browser bundle.

The manifest currently contains 24 deployed synthetic tokens. Existing mints must be preserved; do not recreate them merely because a frontend trading experiment changes.

## Security boundary

The production frontend contains no purchase builder, wallet adapter, client signing flow or mint-authority environment variable. The locally ignored `.devnet-market-authority.json` belongs only to operational Devnet asset maintenance. Never commit it, expose it through a `NEXT_PUBLIC_` variable or copy it into frontend code.

## Explorer verification

Mint and metadata transaction signatures in the manifest can be inspected on Solana Explorer with `cluster=devnet`. Public metadata and artwork are read-only. Simulated card metrics do not establish an exchange rate or market price.
