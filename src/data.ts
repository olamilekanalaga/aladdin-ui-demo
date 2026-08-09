import type { Checkpoint, TokenBundle, WalletRecord } from "./types";

export const CHECKPOINTS: Checkpoint[] = ["BUY_10", "BUY_25", "BUY_50", "BUY_100"];

export const bundles: TokenBundle[] = [
  {
    token: {
      token_mint: "3XHWBdnGLIPPYpUMp111111111111111111111111",
      name: "Glippy Terminal",
      symbol: "GLIPPY",
      lifecycle: "migrated",
      launch_time: "2026-08-09T13:53:20.000Z",
      migration_time: "2026-08-09T14:22:41.000Z",
      creator_wallet: "9aCrE8orGLP111111111111111111111111111",
      current_checkpoint: "BUY_100",
      price_usd: 0.00000418,
      market_cap_usd: 4180,
      fdv_usd: 4180,
      liquidity_usd: 12640,
      volume_24h_usd: 18420,
      market_index: 72,
      participation_score: 68,
      behaviour_label: "Retained early cohort",
      evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["live backend", "verified holder balances"] },
      first_buyer_summary: { holding: 42, partial_exit: 18, full_exit: 21, accumulated: 9, unknown: 10 },
      checkpoints: [
        { checkpoint: "BUY_10", buys: 10, sells: 1, unique_buyers: 9, unique_sellers: 1, buy_pressure: 0.91, first_buyer_retention: 0.78, top5_buyer_share: 0.42, market_cap_usd: 1420, volume_usd: 780, note: "Healthy first response, but the sample is still tiny." },
        { checkpoint: "BUY_25", buys: 25, sells: 6, unique_buyers: 22, unique_sellers: 4, buy_pressure: 0.81, first_buyer_retention: 0.68, top5_buyer_share: 0.36, market_cap_usd: 2460, volume_usd: 3210, note: "Early buyers remain present while concentration falls." },
        { checkpoint: "BUY_50", buys: 50, sells: 18, unique_buyers: 43, unique_sellers: 14, buy_pressure: 0.74, first_buyer_retention: 0.57, top5_buyer_share: 0.31, market_cap_usd: 3710, volume_usd: 9120, note: "Momentum is broadening; sell pressure is not yet dominant." },
        { checkpoint: "BUY_100", buys: 100, sells: 39, unique_buyers: 76, unique_sellers: 31, buy_pressure: 0.72, first_buyer_retention: 0.51, top5_buyer_share: 0.27, market_cap_usd: 4180, volume_usd: 18420, note: "Tradable momentum candidate; monitor sell acceleration." }
      ]
    },
    trades: [
      { signature: "5sG1ppyBuy100", token_mint: "3XHWBdnGLIPPYpUMp111111111111111111111111", timestamp: "2026-08-09T14:31:44.000Z", side: "buy", wallet: "B7BuyerRetain111111111111111111111111", sol_amount: 1.42, token_amount: 339712, price_usd: 0.00000418, market_cap_usd: 4180, checkpoint: "BUY_100" },
      { signature: "2sG1ppySell099", token_mint: "3XHWBdnGLIPPYpUMp111111111111111111111111", timestamp: "2026-08-09T14:31:12.000Z", side: "sell", wallet: "FsFlipExit111111111111111111111111111", sol_amount: 0.64, token_amount: 159203, price_usd: 0.00000402, market_cap_usd: 4020, checkpoint: "BUY_100" },
      { signature: "3sG1ppyBuy050", token_mint: "3XHWBdnGLIPPYpUMp111111111111111111111111", timestamp: "2026-08-09T14:12:33.000Z", side: "buy", wallet: "A1AccumWallet111111111111111111111111", sol_amount: 0.95, token_amount: 256064, price_usd: 0.00000371, market_cap_usd: 3710, checkpoint: "BUY_50" }
    ],
    first100: [
      { rank: 1, wallet: "A1AccumWallet111111111111111111111111", first_buy_at: "2026-08-09T13:56:22.000Z", buy_sol: 0.81, current_status: "accumulated", retained_pct: 100, later_action: "Added at BUY_25 and BUY_50", confidence: "demo_only" },
      { rank: 2, wallet: "B7BuyerRetain111111111111111111111111", first_buy_at: "2026-08-09T13:58:11.000Z", buy_sol: 0.64, current_status: "holding", retained_pct: 73, later_action: "Trimmed once after migration", confidence: "demo_only" },
      { rank: 3, wallet: "FsFlipExit111111111111111111111111111", first_buy_at: "2026-08-09T14:01:47.000Z", buy_sol: 0.22, current_status: "full_exit", retained_pct: 0, later_action: "Exited before BUY_50", confidence: "demo_only" },
      { rank: 4, wallet: "Rot8Wallet1111111111111111111111111111", first_buy_at: "2026-08-09T14:09:05.000Z", buy_sol: 0.31, current_status: "partial_exit", retained_pct: 38, later_action: "Rotated after migration", confidence: "demo_only" }
    ],
    participants: [
      { wallet: "B7BuyerRetain111111111111111111111111", buys: 4, sells: 1, net_sol: 2.7, retained_pct: 73, behaviour: "conviction holder" },
      { wallet: "A1AccumWallet111111111111111111111111", buys: 6, sells: 0, net_sol: 4.9, retained_pct: 100, behaviour: "early accumulator" },
      { wallet: "FsFlipExit111111111111111111111111111", buys: 2, sells: 3, net_sol: -0.4, retained_pct: 0, behaviour: "fast flipper" },
      { wallet: "Rot8Wallet1111111111111111111111111111", buys: 3, sells: 2, net_sol: 0.8, retained_pct: 38, behaviour: "rotation wallet" }
    ],
    holders: [
      { wallet: "A1AccumWallet111111111111111111111111", share_pct: 4.8, note: "accumulated", confidence: "demo_only" },
      { wallet: "B7BuyerRetain111111111111111111111111", share_pct: 2.9, note: "holding", confidence: "demo_only" },
      { wallet: "HolderSetUnavailable11111111111111111111", share_pct: null, note: "unavailable", confidence: "unavailable" }
    ],
    historical: [
      { title: "Retained early cohort with falling concentration", similarity: 0.74, checkpoint: "BUY_100", decision: "Hold", outcome: "Comparable examples often produced continuation when sell acceleration stayed controlled.", caution: "Demo similarity only; backend matching is not connected." }
    ],
    consultation: [
      { question: "What trade does this change?", answer: "It does not issue a buy call. It supports watchlist or hold consideration because early-buyer retention stayed above 50% by BUY_100.", evidence: ["BUY_100 buy pressure 72%", "First-buyer retention 51%", "Top-five buyer share declined to 27%"], trade_change: "Hold / watchlist / risk sizing", confidence: "demo_only" },
      { question: "What invalidates it?", answer: "A rapid rise in sells while unique buyers flatten would downgrade the formation.", evidence: ["Sell count 39", "Unique buyers 76", "Median holding evidence partial"], trade_change: "Avoid / reduce risk", confidence: "demo_only" }
    ]
  },
  {
    token: {
      token_mint: "7PREBdnHATCHpUMp222222222222222222222222",
      name: "Hatchling Index",
      symbol: "HATCH",
      lifecycle: "pre_migration",
      launch_time: "2026-08-09T14:11:12.000Z",
      migration_time: null,
      creator_wallet: "Cr8Hatch22222222222222222222222222222",
      current_checkpoint: "BUY_50",
      price_usd: 0.00000192,
      market_cap_usd: 1920,
      fdv_usd: 1920,
      liquidity_usd: null,
      volume_24h_usd: 6420,
      market_index: 61,
      participation_score: 57,
      behaviour_label: "Pre-migration breadth forming",
      evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["migration event", "verified liquidity"] },
      first_buyer_summary: { holding: 23, partial_exit: 11, full_exit: 8, accumulated: 4, unknown: 4 },
      checkpoints: [
        { checkpoint: "BUY_10", buys: 10, sells: 2, unique_buyers: 8, unique_sellers: 2, buy_pressure: 0.83, first_buyer_retention: 0.7, top5_buyer_share: 0.49, market_cap_usd: 860, volume_usd: 510, note: "Fast start, concentration still high." },
        { checkpoint: "BUY_25", buys: 25, sells: 8, unique_buyers: 21, unique_sellers: 6, buy_pressure: 0.76, first_buyer_retention: 0.62, top5_buyer_share: 0.41, market_cap_usd: 1340, volume_usd: 2140, note: "Breadth improving, still pre-migration." },
        { checkpoint: "BUY_50", buys: 50, sells: 18, unique_buyers: 41, unique_sellers: 15, buy_pressure: 0.74, first_buyer_retention: 0.54, top5_buyer_share: 0.34, market_cap_usd: 1920, volume_usd: 6420, note: "Worth tracking, not confirmed momentum yet." },
        { checkpoint: "BUY_100", buys: 50, sells: 18, unique_buyers: 41, unique_sellers: 15, buy_pressure: 0.74, first_buyer_retention: 0.54, top5_buyer_share: 0.34, market_cap_usd: null, volume_usd: 6420, note: "BUY_100 not reached." }
      ]
    },
    trades: [
      { signature: "HatchBuy050", token_mint: "7PREBdnHATCHpUMp222222222222222222222222", timestamp: "2026-08-09T14:29:02.000Z", side: "buy", wallet: "HatchBuyer111111111111111111111111111", sol_amount: 0.44, token_amount: 229166, price_usd: 0.00000192, market_cap_usd: 1920, checkpoint: "BUY_50" }
    ],
    first100: [
      { rank: 1, wallet: "HatchBuyer111111111111111111111111111", first_buy_at: "2026-08-09T14:13:10.000Z", buy_sol: 0.47, current_status: "holding", retained_pct: 100, later_action: "No exit observed", confidence: "demo_only" }
    ],
    participants: [
      { wallet: "HatchBuyer111111111111111111111111111", buys: 2, sells: 0, net_sol: 0.91, retained_pct: 100, behaviour: "early accumulator" }
    ],
    holders: [{ wallet: "HatchBuyer111111111111111111111111111", share_pct: 3.1, note: "holding", confidence: "demo_only" }],
    historical: [{ title: "Pre-migration breadth without migration", similarity: 0.51, checkpoint: "BUY_50", decision: "Avoid", outcome: "Often stayed noisy unless retention improved before migration.", caution: "BUY_100 evidence is missing." }],
    consultation: [{ question: "Is HATCH tradable yet?", answer: "Evidence is incomplete. The safer decision is monitor, not enter, until migration or stronger retention is observed.", evidence: ["BUY_50 reached", "Migration missing", "Liquidity unavailable"], trade_change: "Avoid / wait", confidence: "demo_only" }]
  },
  {
    token: {
      token_mint: "9NEWBdnSEEDpUMp3333333333333333333333333",
      name: "Seed Signal",
      symbol: "SEED",
      lifecycle: "new_launch",
      launch_time: "2026-08-09T14:32:10.000Z",
      migration_time: null,
      creator_wallet: "SeedCreator333333333333333333333333333",
      current_checkpoint: "BUY_10",
      price_usd: null,
      market_cap_usd: null,
      fdv_usd: null,
      liquidity_usd: null,
      volume_24h_usd: 120,
      market_index: null,
      participation_score: 34,
      behaviour_label: "Launch detected; insufficient trade evidence",
      evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["BUY_10 complete evidence", "verified price", "supply"] },
      first_buyer_summary: { holding: 5, partial_exit: 0, full_exit: 0, accumulated: 1, unknown: 1 },
      checkpoints: [
        { checkpoint: "BUY_10", buys: 7, sells: 0, unique_buyers: 6, unique_sellers: 0, buy_pressure: 1, first_buyer_retention: 0.86, top5_buyer_share: 0.71, market_cap_usd: null, volume_usd: 120, note: "Launch exists, but BUY_10 has not completed." },
        { checkpoint: "BUY_25", buys: 7, sells: 0, unique_buyers: 6, unique_sellers: 0, buy_pressure: 1, first_buyer_retention: 0.86, top5_buyer_share: 0.71, market_cap_usd: null, volume_usd: 120, note: "Pending." },
        { checkpoint: "BUY_50", buys: 7, sells: 0, unique_buyers: 6, unique_sellers: 0, buy_pressure: 1, first_buyer_retention: 0.86, top5_buyer_share: 0.71, market_cap_usd: null, volume_usd: 120, note: "Pending." },
        { checkpoint: "BUY_100", buys: 7, sells: 0, unique_buyers: 6, unique_sellers: 0, buy_pressure: 1, first_buyer_retention: 0.86, top5_buyer_share: 0.71, market_cap_usd: null, volume_usd: 120, note: "Pending." }
      ]
    },
    trades: [],
    first100: [{ rank: 1, wallet: "SeedEarly11111111111111111111111111111", first_buy_at: "2026-08-09T14:33:02.000Z", buy_sol: 0.08, current_status: "holding", retained_pct: 100, later_action: "No later event", confidence: "demo_only" }],
    participants: [],
    holders: [{ wallet: "SeedEarly11111111111111111111111111111", share_pct: 1.2, note: "holding", confidence: "demo_only" }],
    historical: [],
    consultation: [{ question: "What trade does this change?", answer: "None yet. The token has launch evidence only, so the decision impact is avoid or observe.", evidence: ["No completed BUY_10", "Price unavailable", "Supply unavailable"], trade_change: "Avoid / watchlist", confidence: "demo_only" }]
  }
];

export const wallets: WalletRecord[] = [
  { wallet: "A1AccumWallet111111111111111111111111", label: "Early accumulator", temperament: "early accumulator", observed_tokens: 47, early_entries: 31, median_hold_minutes: 38, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["realized PnL"] } },
  { wallet: "B7BuyerRetain111111111111111111111111", label: "Conviction holder", temperament: "conviction holder", observed_tokens: 39, early_entries: 24, median_hold_minutes: 44, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["realized PnL"] } },
  { wallet: "FsFlipExit111111111111111111111111111", label: "Fast flipper", temperament: "fast flipper", observed_tokens: 64, early_entries: 44, median_hold_minutes: 7, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["realized PnL"] } },
  { wallet: "Rot8Wallet1111111111111111111111111111", label: "Rotation wallet", temperament: "rotation wallet", observed_tokens: 58, early_entries: 21, median_hold_minutes: 16, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["realized PnL"] } },
  { wallet: "HatchBuyer111111111111111111111111111", label: "Early accumulator", temperament: "early accumulator", observed_tokens: 18, early_entries: 12, median_hold_minutes: 26, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["realized PnL"] } },
  { wallet: "SeedEarly11111111111111111111111111111", label: "New launch wallet", temperament: "unknown", observed_tokens: 3, early_entries: 2, median_hold_minutes: 0, evidence_quality: { confidence: "demo_only", source: "frontend fixture", missing: ["trade history"] } }
];

export const walletStats: Record<string, { label: string; behaviour: string; winRate: number | null; trades: number; pnlUsd: number | null; roiPct: number | null; holdingPct: number | null; supplyPct: number | null; usdValue: number | null; age: string; soldPct: number | null; remainingPct: number | null; entryMc: number | null }> = {
  A1AccumWallet111111111111111111111111: { label: "Early accumulator", behaviour: "accumulated", winRate: 0.61, trades: 47, pnlUsd: 1840, roiPct: 142, holdingPct: 100, supplyPct: 4.8, usdValue: 201, age: "38m", soldPct: 0, remainingPct: 100, entryMc: 1420 },
  B7BuyerRetain111111111111111111111111: { label: "Conviction holder", behaviour: "holding", winRate: 0.58, trades: 39, pnlUsd: 960, roiPct: 84, holdingPct: 73, supplyPct: 2.9, usdValue: 121, age: "34m", soldPct: 27, remainingPct: 73, entryMc: 1760 },
  FsFlipExit111111111111111111111111111: { label: "Fast flipper", behaviour: "full exit", winRate: 0.52, trades: 64, pnlUsd: 310, roiPct: 22, holdingPct: 0, supplyPct: 0, usdValue: 0, age: "29m", soldPct: 100, remainingPct: 0, entryMc: 2200 },
  Rot8Wallet1111111111111111111111111111: { label: "Rotation wallet", behaviour: "partial exit", winRate: 0.49, trades: 58, pnlUsd: 420, roiPct: 37, holdingPct: 38, supplyPct: 1.5, usdValue: 63, age: "22m", soldPct: 62, remainingPct: 38, entryMc: 3710 },
  HatchBuyer111111111111111111111111111: { label: "Early accumulator", behaviour: "holding", winRate: 0.57, trades: 18, pnlUsd: 240, roiPct: 48, holdingPct: 100, supplyPct: 3.1, usdValue: 60, age: "19m", soldPct: 0, remainingPct: 100, entryMc: 1340 },
  SeedEarly11111111111111111111111111111: { label: "New launch wallet", behaviour: "holding", winRate: null, trades: 3, pnlUsd: null, roiPct: null, holdingPct: 100, supplyPct: 1.2, usdValue: null, age: "2m", soldPct: 0, remainingPct: 100, entryMc: null }
};

export const fmtMoney = (value: number | null | undefined, precision = 2) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "Unavailable";
  if (Math.abs(value) < 0.01 && value !== 0) return `$${value.toExponential(2)}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: precision }).format(value);
};
export const fmtPct = (value: number | null | undefined) => value === null || value === undefined ? "Unavailable" : `${(value * 100).toFixed(0)}%`;
export const fmtPctWhole = (value: number | null | undefined) => value === null || value === undefined ? "Unavailable" : `${value.toFixed(0)}%`;
export const short = (value: string, left = 6, right = 4) => value.length <= left + right + 3 ? value : `${value.slice(0, left)}...${value.slice(-right)}`;
export function findBundle(mint?: string) { return bundles.find((item) => item.token.token_mint === mint) ?? bundles[0]; }
export function walletInfo(wallet: string) { return walletStats[wallet] ?? { label: "Unknown wallet", behaviour: "unknown", winRate: null, trades: 0, pnlUsd: null, roiPct: null, holdingPct: null, supplyPct: null, usdValue: null, age: "Unavailable", soldPct: null, remainingPct: null, entryMc: null }; }
export function searchDemo(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokenResults = bundles.filter(({ token }) => [token.name, token.symbol, token.token_mint].some((v) => v.toLowerCase().includes(q))).map(({ token }) => ({ type: "token", title: `$${token.symbol} ${token.name}`, subtitle: token.token_mint, route: `/app/token/${token.token_mint}/trades`, confidence: token.evidence_quality.confidence }));
  const walletResults = wallets.filter((w) => [w.wallet, w.label, w.temperament].some((v) => v.toLowerCase().includes(q))).map((w) => ({ type: "wallet", title: w.label, subtitle: w.wallet, route: `/app/wallet/${w.wallet}`, confidence: w.evidence_quality.confidence }));
  const tradeResults = bundles.flatMap((b) => b.trades).filter((t) => t.signature.toLowerCase().includes(q) || t.wallet.toLowerCase().includes(q)).map((t) => ({ type: "transaction", title: t.signature, subtitle: `${t.side.toUpperCase()} ${short(t.token_mint)}`, route: `/app/token/${t.token_mint}/trades`, confidence: "demo_only" as const }));
  return [...tokenResults, ...walletResults, ...tradeResults].slice(0, 10);
}
